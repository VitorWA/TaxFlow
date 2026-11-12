<?php

namespace App\Console\Commands;

use App\Services\NcmImporter;
use Illuminate\Console\Command;

class ImportNcm extends Command
{
    protected $signature = 'ncm:import {file : Caminho local do JSON oficial Siscomex}';

    protected $description = 'Importa snapshot oficial NCM de forma atômica e idempotente';

    public function handle(NcmImporter $importer): int
    {
        try {
            $result = $importer->import($this->argument('file'));
        } catch (\InvalidArgumentException|\JsonException $e) {
            $this->error($e->getMessage());

            return self::FAILURE;
        }
        $this->info(json_encode($result, JSON_UNESCAPED_UNICODE));

        return self::SUCCESS;
    }
}
