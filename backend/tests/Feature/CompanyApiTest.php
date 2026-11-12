<?php

namespace Tests\Feature;

use App\Domain\Enums\State;
use App\Domain\Enums\TaxRegime;
use App\Models\Company;
use App\Models\User;
use Database\Seeders\CompanySeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CompanyApiTest extends TestCase
{
    use RefreshDatabase;

    private function payload(): array
    {
        return ['cnpj' => '11.222.333/0001-81', 'legal_name' => 'Empresa A', 'tax_regime' => 'simples_nacional', 'state' => 'MT'];
    }

    public function test_creation_normalizes_cnpj_persists_casts_and_assigns_owner(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);
        $id = $this->postJson('/api/v1/companies', $this->payload() + ['role' => 'member', 'user_id' => 999])
            ->assertCreated()->assertJsonPath('data.cnpj', '11222333000181')->json('data.id');
        $company = Company::findOrFail($id);
        $this->assertSame(TaxRegime::from('simples_nacional'), $company->tax_regime);
        $this->assertSame(State::from('MT'), $company->state);
        $this->assertDatabaseHas('company_user', ['company_id' => $id, 'user_id' => $user->id, 'role' => 'owner']);
        $this->assertSame(1, $user->companies()->count());
        $this->getJson('/api/v1/companies/'.$id)->assertOk()->assertJsonPath('data.tax_regime', 'simples_nacional');
        $this->patchJson('/api/v1/companies/'.$id, ['trade_name' => 'Nome novo'])->assertOk()->assertJsonPath('data.trade_name', 'Nome novo');
        $this->assertDatabaseHas('companies', ['id' => $id, 'tax_regime' => 'simples_nacional']);
    }

    public function test_invalid_or_duplicate_cnpj_and_invalid_enums_are_rejected(): void
    {
        Sanctum::actingAs(User::factory()->create());
        foreach (['00000000000000', '11222333000180', ['unexpected'], 'not-a-cnpj'] as $invalid) {
            $this->postJson('/api/v1/companies', array_replace($this->payload(), ['cnpj' => $invalid]))->assertUnprocessable();
        }
        $this->postJson('/api/v1/companies', array_replace($this->payload(), ['tax_regime' => 'unknown']))->assertUnprocessable();
        $this->postJson('/api/v1/companies', array_replace($this->payload(), ['state' => 'XX']))->assertUnprocessable();
        $this->postJson('/api/v1/companies', $this->payload())->assertCreated();
        $this->postJson('/api/v1/companies', array_replace($this->payload(), ['cnpj' => '11222333000181']))->assertUnprocessable();
        $this->assertDatabaseCount('companies', 1);
    }

    public function test_user_cannot_read_or_change_another_company_even_with_invalid_payload(): void
    {
        $owner = User::factory()->create();
        $company = Company::factory()->create();
        $company->users()->attach($owner, ['role' => 'owner']);
        Sanctum::actingAs(User::factory()->create());
        $this->getJson('/api/v1/companies')->assertOk()->assertJsonCount(0, 'data');
        $this->getJson('/api/v1/companies/'.$company->id)->assertNotFound();
        $this->patchJson('/api/v1/companies/'.$company->id, ['cnpj' => 'invalid'])->assertNotFound();
        $this->assertDatabaseHas('companies', ['id' => $company->id, 'cnpj' => $company->cnpj]);
    }

    public function test_member_can_read_but_cannot_update_or_promote_itself(): void
    {
        $member = User::factory()->create();
        $company = Company::factory()->create();
        $company->users()->attach($member, ['role' => 'member']);
        Sanctum::actingAs($member);
        $this->getJson('/api/v1/companies/'.$company->id)->assertOk();
        $this->patchJson('/api/v1/companies/'.$company->id, ['legal_name' => 'Changed', 'role' => 'owner'])->assertForbidden();
        $this->assertDatabaseHas('company_user', ['company_id' => $company->id, 'user_id' => $member->id, 'role' => 'member']);
    }

    public function test_list_filter_order_pagination_and_company_scope_are_combined(): void
    {
        $user = User::factory()->create();
        foreach (['Empresa Z', 'Empresa A', 'Outra'] as $name) {
            Company::factory()->create(['legal_name' => $name])->users()->attach($user, ['role' => 'owner']);
        }
        Company::factory()->create(['legal_name' => 'Empresa secreta']);
        Sanctum::actingAs($user);
        $this->getJson('/api/v1/companies?q=Empresa&sort=legal_name&direction=asc&per_page=1')
            ->assertOk()->assertJsonPath('meta.total', 2)->assertJsonCount(1, 'data')->assertJsonPath('data.0.legal_name', 'Empresa A');
        $this->getJson('/api/v1/companies?q=Empresa&sort=legal_name&direction=asc&per_page=1&page=2')
            ->assertOk()->assertJsonPath('data.0.legal_name', 'Empresa Z');
        $this->getJson('/api/v1/companies?per_page=101')->assertUnprocessable();
        $this->getJson('/api/v1/companies?sort=password')->assertUnprocessable();
        $this->getJson('/api/v1/companies?page=0')->assertUnprocessable();
    }

    public function test_patch_keeps_current_cnpj_and_rejects_another_company_cnpj(): void
    {
        $user = User::factory()->create();
        $company = Company::factory()->create();
        $other = Company::factory()->create();
        $company->users()->attach($user, ['role' => 'owner']);
        Sanctum::actingAs($user);
        $this->patchJson('/api/v1/companies/'.$company->id, ['cnpj' => $company->cnpj])->assertOk();
        $this->patchJson('/api/v1/companies/'.$company->id, ['cnpj' => $other->cnpj])->assertUnprocessable();
        $this->patchJson('/api/v1/companies/'.$company->id, ['legal_name' => null])->assertUnprocessable();
    }

    public function test_company_seeder_is_idempotent_and_requires_local_environment(): void
    {
        $user = User::factory()->create(['email' => 'test@example.com']);
        $this->seed(CompanySeeder::class);
        $this->seed(CompanySeeder::class);
        $this->assertDatabaseCount('companies', 1);
        $this->assertDatabaseCount('company_user', 1);
        $this->assertSame(1, $user->companies()->count());
    }

    public function test_company_endpoints_require_authentication(): void
    {
        $company = Company::factory()->create();
        $this->getJson('/api/v1/companies')->assertUnauthorized();
        $this->getJson('/api/v1/companies/'.$company->id)->assertUnauthorized();
        $this->postJson('/api/v1/companies', $this->payload())->assertUnauthorized();
        $this->patchJson('/api/v1/companies/'.$company->id, ['legal_name' => 'Changed'])->assertUnauthorized();
    }
}
