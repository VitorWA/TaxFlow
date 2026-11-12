<?php

namespace Tests\Feature;

use App\Models\Ncm;
use App\Models\User;
use App\Services\NcmImporter;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class NcmCatalogTest extends TestCase
{
    use RefreshDatabase;

    private function row(string $code = '0101.21.00'): array
    {
        return ['Codigo' => $code, 'Descricao' => 'Cavalos reprodutores', 'Data_Inicio' => '01/01/2020', 'Data_Fim' => '31/12/9999', 'Tipo_Ato_Ini' => 'Res Gecex', 'Numero_Ato_Ini' => '272', 'Ano_Ato_Ini' => '2021'];
    }

    private function load(array $rows): array
    {
        $path = tempnam(sys_get_temp_dir(), 'ncm');
        try {
            file_put_contents($path, json_encode(['Data_Ultima_Atualizacao_NCM' => 'Vigente em 12/11/2026', 'Ato' => 'Teste', 'Nomenclaturas' => $rows]));

            return app(NcmImporter::class)->import($path);
        } finally {
            unlink($path);
        }
    }

    public function test_import_is_idempotent_preserves_zeroes_and_ignores_hierarchy(): void
    {
        $this->load([$this->row('01'), $this->row()]);
        $result = $this->load([$this->row('01'), $this->row()]);
        $this->assertTrue($result['unchanged']);
        $this->assertDatabaseCount('ncms', 1);
        $this->assertDatabaseHas('ncms', ['code' => '01012100', 'in_current_table' => true]);
    }

    public function test_malformed_date_rolls_back_all_records_and_previous_snapshot(): void
    {
        $this->load([$this->row()]);
        $bad = $this->row('0101.29.00');
        $bad['Data_Inicio'] = '31/02/2026';
        try {
            $this->load([$this->row('0101.30.00'), $bad]);
            $this->fail('Carga deveria falhar');
        } catch (\InvalidArgumentException) {
            $this->assertDatabaseCount('ncms', 1);
            $this->assertTrue(Ncm::findOrFail('01012100')->in_current_table);
        }
    }

    public function test_empty_or_invalid_json_command_fails_without_writes(): void
    {
        $path = tempnam(sys_get_temp_dir(), 'ncm');
        try {
            file_put_contents($path, '{}');
            $this->artisan('ncm:import', ['file' => $path])->assertFailed();
            file_put_contents($path, 'invalid');
            $this->artisan('ncm:import', ['file' => $path])->assertFailed();
            $this->assertDatabaseCount('ncms', 0);
        } finally {
            unlink($path);
        }
    }

    public function test_snapshot_absence_marks_code_unavailable_without_deleting_it(): void
    {
        $this->load([$this->row()]);
        $this->load([$this->row('0101.29.00')]);
        $this->assertFalse(Ncm::findOrFail('01012100')->isCurrent());
        $this->assertDatabaseCount('ncms', 2);
    }

    public function test_search_detail_expired_and_future_dates_require_auth(): void
    {
        $this->travelTo(now()->setDate(2026, 11, 12));
        $this->load([$this->row()]);
        $this->getJson('/api/v1/ncms')->assertUnauthorized();
        Sanctum::actingAs(User::factory()->create());
        $this->getJson('/api/v1/ncms?q=0101&per_page=1')->assertOk()->assertJsonPath('meta.total', 1)->assertJsonPath('data.0.code', '01012100');
        $this->getJson('/api/v1/ncms?q=Cavalos')->assertOk()->assertJsonPath('meta.total', 1);
        $this->getJson('/api/v1/ncms/01012100')->assertOk()->assertJsonPath('data.is_current', true)->assertJsonStructure(['data' => ['source', 'legal_act', 'valid_from', 'valid_until', 'imported_at']]);
        $ncm = Ncm::findOrFail('01012100');
        $ncm->update(['valid_until' => '2026-11-11']);
        $this->getJson('/api/v1/ncms/01012100')->assertOk()->assertJsonPath('data.is_current', false);
        $ncm->update(['valid_from' => '2026-11-13', 'valid_until' => '9999-12-31']);
        $this->assertFalse($ncm->refresh()->isCurrent());
        $ncm->update(['valid_from' => '2026-11-12', 'valid_until' => '2026-11-12']);
        $this->assertTrue($ncm->refresh()->isCurrent());
        $this->getJson('/api/v1/ncms/00000000')->assertNotFound();
        $this->getJson('/api/v1/ncms?per_page=101')->assertUnprocessable();
    }
}
