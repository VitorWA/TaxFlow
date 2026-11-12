<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class EstablishmentApiTest extends TestCase
{
    use RefreshDatabase;

    private function company(User $user): Company
    {
        $c = Company::factory()->create(['cnpj' => '11222333000181']);
        $c->users()->attach($user, ['role' => 'owner']);

        return $c;
    }

    private function payload(): array
    {
        return ['type' => 'filial', 'cnpj' => '11.222.333/0002-62', 'state' => 'MT', 'municipality' => 'Cuiabá', 'taxpayer_status' => 'contribuinte'];
    }

    public function test_owner_creates_lists_and_updates_establishment(): void
    {
        $user = User::factory()->create();
        $c = $this->company($user);
        $url = '/api/v1/companies/'.$c->id.'/establishments';
        Sanctum::actingAs($user);
        $id = $this->postJson($url, $this->payload())->assertCreated()->assertJsonPath('data.cnpj', '11222333000262')->json('data.id');
        $this->getJson($url)->assertOk()->assertJsonPath('meta.total', 1);
        $this->patchJson($url.'/'.$id, ['state' => 'SP'])->assertOk()->assertJsonPath('data.state', 'SP');
        $this->patchJson($url.'/'.$id, ['company_id' => null])->assertUnprocessable();
        $this->assertDatabaseHas('establishments', ['id' => $id, 'company_id' => $c->id, 'state' => 'SP']);
        $this->postJson($url, $this->payload())->assertUnprocessable();
    }

    public function test_cnpj_root_state_and_transfer_are_validated(): void
    {
        $u = User::factory()->create();
        $c = $this->company($u);
        $url = '/api/v1/companies/'.$c->id.'/establishments';
        Sanctum::actingAs($u);
        foreach ([['cnpj' => '04252011000110'], ['cnpj' => 'invalid'], ['state' => null], ['state' => 'XX'], ['company_id' => 999], ['type' => 'other']] as $bad) {
            $this->postJson($url, array_replace($this->payload(), $bad))->assertUnprocessable();
        }
        $this->assertDatabaseCount('establishments', 0);
    }

    public function test_scoped_parent_and_owner_member_outsider_permissions(): void
    {
        $owner = User::factory()->create();
        $member = User::factory()->create();
        $outsider = User::factory()->create();
        $c = $this->company($owner);
        $c->users()->attach($member, ['role' => 'member']);
        $other = Company::factory()->create();
        $other->users()->attach($owner, ['role' => 'owner']);
        $url = '/api/v1/companies/'.$c->id.'/establishments';
        Sanctum::actingAs($owner);
        $id = $this->postJson($url, $this->payload())->assertCreated()->json('data.id');
        $this->getJson('/api/v1/companies/'.$other->id.'/establishments/'.$id)->assertNotFound();
        $this->patchJson('/api/v1/companies/'.$other->id.'/establishments/'.$id, ['state' => 'SP'])->assertNotFound();
        Sanctum::actingAs($member);
        $this->getJson($url.'/'.$id)->assertOk();
        $this->patchJson($url.'/'.$id, ['state' => 'SP'])->assertForbidden();
        $this->postJson($url, $this->payload())->assertForbidden();
        Sanctum::actingAs($outsider);
        $this->getJson($url)->assertNotFound();
        $this->getJson($url.'/'.$id)->assertNotFound();
        $this->patchJson($url.'/'.$id, ['state' => 'SP'])->assertNotFound();
    }
}
