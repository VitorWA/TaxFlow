<?php

namespace App\Services;

use App\Models\Ncm;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class NcmImporter
{
    public const SOURCE = 'https://portalunico.siscomex.gov.br/classif/api/publico/nomenclatura/download/json';

    public function import(string $path): array
    {
        if (! is_file($path) || ! is_readable($path) || filesize($path) > 25000000) {
            throw new InvalidArgumentException('Arquivo NCM ausente, ilegível ou maior que 25 MB.');
        }
        $raw = file_get_contents($path);
        $data = json_decode($raw, true, 512, JSON_THROW_ON_ERROR);
        if (! is_array($data) || ! is_array($data['Nomenclaturas'] ?? null) || ! is_string($data['Data_Ultima_Atualizacao_NCM'] ?? null)) {
            throw new InvalidArgumentException('Formato oficial NCM inválido.');
        }
        $rows = [];
        $now = now();
        foreach ($data['Nomenclaturas'] as $row) {
            if (! is_array($row) || ! is_string($row['Codigo'] ?? null) || ! preg_match('/^[0-9.]+$/D', $row['Codigo'])) {
                throw new InvalidArgumentException('Código NCM malformado.');
            }
            $code = str_replace('.', '', $row['Codigo']);
            if (strlen($code) < 8) {
                continue;
            }
            if (! preg_match('/^[0-9]{8}$/D', $code) || isset($rows[$code])) {
                throw new InvalidArgumentException('Código NCM inválido ou duplicado na carga.');
            }
            foreach (['Descricao', 'Data_Inicio', 'Data_Fim', 'Tipo_Ato_Ini', 'Numero_Ato_Ini', 'Ano_Ato_Ini'] as $key) {
                if (! is_string($row[$key] ?? null) || trim($row[$key]) === '') {
                    throw new InvalidArgumentException('Campo NCM obrigatório: '.$key);
                }
            }
            $from = $this->date($row['Data_Inicio']);
            $until = $this->date($row['Data_Fim']);
            if ($until < $from) {
                throw new InvalidArgumentException('Intervalo de vigência inválido.');
            }
            $description = trim(html_entity_decode(strip_tags($row['Descricao']), ENT_QUOTES | ENT_HTML5, 'UTF-8'));
            if ($description === '') {
                throw new InvalidArgumentException('Descrição NCM vazia.');
            }
            $rows[$code] = ['code' => $code, 'description' => $description, 'valid_from' => $from, 'valid_until' => $until, 'legal_act' => $row['Tipo_Ato_Ini'].' '.$row['Numero_Ato_Ini'].'/'.$row['Ano_Ato_Ini'], 'source' => self::SOURCE, 'imported_at' => $now, 'in_current_table' => true, 'created_at' => $now, 'updated_at' => $now];
        }
        if (! $rows) {
            throw new InvalidArgumentException('Carga sem códigos NCM completos.');
        }
        $hash = hash('sha256', $raw);

        return DB::transaction(function () use ($rows, $hash, $data, $now) {
            DB::table('ncm_imports')->insertOrIgnore(['id' => 1, 'checksum' => '', 'source' => self::SOURCE, 'reference' => '']);
            $previous = DB::table('ncm_imports')->where('id', 1)->lockForUpdate()->first();
            if ($previous->checksum === $hash) {
                return ['count' => count($rows), 'unchanged' => true, 'checksum' => $hash];
            }
            Ncm::query()->update(['in_current_table' => false]);
            foreach (array_chunk(array_values($rows), 250) as $chunk) {
                Ncm::upsert($chunk, ['code'], ['description', 'valid_from', 'valid_until', 'legal_act', 'source', 'imported_at', 'in_current_table', 'updated_at']);
            }
            DB::table('ncm_imports')->where('id', 1)->update(['checksum' => $hash, 'source' => self::SOURCE, 'reference' => $data['Data_Ultima_Atualizacao_NCM'], 'imported_at' => $now]);

            return ['count' => count($rows), 'unchanged' => false, 'checksum' => $hash];
        }, 3);
    }

    private function date(string $value): string
    {
        try {
            $date = CarbonImmutable::createFromFormat('!d/m/Y', $value);
        } catch (\Throwable) {
            throw new InvalidArgumentException('Data NCM inválida: '.$value);
        }
        if (! $date || $date->format('d/m/Y') !== $value) {
            throw new InvalidArgumentException('Data NCM inválida: '.$value);
        }

        return $date->format('Y-m-d');
    }
}
