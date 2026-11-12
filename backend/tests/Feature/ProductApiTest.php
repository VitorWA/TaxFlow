<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\Ncm;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ProductApiTest extends TestCase
{
    use RefreshDatabase;

    private function setupOwner(): array
    {
        $u = User::factory()->create();
        $c = Company::factory()->create();
        $c->users()->attach($u, ['role' => 'owner']);
        foreach (['01012100', '01012900'] as $code) {
            Ncm::factory()->create(['code' => $code]);
        }
        Sanctum::actingAs($u);

        return [$u, $c];
    }

    private function payload(Company $c): array
    {
        return ['company_id' => $c->id, 'description' => 'Produto teste', 'ean' => '7894900011517', 'internal_code' => 'ABC', 'ncm_code' => '01012100'];
    }

    public function test_product_confirmation_change_invalidation_and_history(): void
    {
        [$u,$c] = $this->setupOwner();
        $id = $this->postJson('/api/v1/products', $this->payload($c))->assertCreated()->assertJsonPath('data.classification_status', 'sugerida')->json('data.id');
        $url = '/api/v1/products/'.$id;
        $this->postJson($url.'/confirm-ncm')->assertOk()->assertJsonPath('data.classification_status', 'confirmada')->assertJsonPath('data.confirmed_by', $u->id);
        $this->postJson($url.'/confirm-ncm')->assertOk();
        $this->assertDatabaseCount('product_ncm_changes', 1);
        $this->patchJson($url, ['description' => 'Novo nome'])->assertOk()->assertJsonPath('data.classification_status', 'confirmada');
        $this->patchJson($url, ['ncm_code' => '01012900'])->assertOk()->assertJsonPath('data.classification_status', 'sugerida')->assertJsonPath('data.confirmed_by', null)->assertJsonPath('data.confirmed_at', null);
        $this->getJson($url.'/ncm-history')->assertOk()->assertJsonPath('meta.total', 2)->assertJsonPath('data.1.old_ncm_code', '01012100')->assertJsonPath('data.1.new_ncm_code', '01012900')->assertJsonPath('data.1.changed_by', $u->id);
        $this->getJson('/api/v1/products?q=789490&per_page=1')->assertOk()->assertJsonPath('meta.total', 1);
    }

    public function test_invalid_or_expired_ncm_ean_and_protected_fields_are_rejected(): void
    {
        [$u,$c] = $this->setupOwner();
        foreach ([['ean' => 'bad'], ['ncm_code' => '00000000'], ['ncm_code' => '1012100'], ['confirmed_by' => $u->id], ['classification_status' => 'confirmada']] as $bad) {
            $this->postJson('/api/v1/products', array_replace($this->payload($c), $bad))->assertUnprocessable();
        }
        $id = $this->postJson('/api/v1/products', $this->payload($c))->assertCreated()->json('data.id');
        $url = '/api/v1/products/'.$id;
        $this->patchJson($url, ['company_id' => $c->id])->assertUnprocessable();
        $this->patchJson($url, ['company_id' => null])->assertUnprocessable();
        $this->postJson($url.'/confirm-ncm', ['confirmed_by' => null])->assertUnprocessable();
        $this->postJson($url.'/confirm-ncm', ['confirmed_at' => '2020-01-01'])->assertUnprocessable();
        Ncm::whereKey('01012100')->update(['valid_until' => '2020-01-02']);
        $this->postJson($url.'/confirm-ncm')->assertUnprocessable();
        $this->postJson('/api/v1/products', $this->payload($c))->assertUnprocessable();
        $this->assertDatabaseCount('products', 1);
        $this->assertDatabaseCount('product_ncm_changes', 1);
    }

    public function test_member_reads_but_other_user_never_sees_or_changes_product(): void
    {
        [$owner,$c] = $this->setupOwner();
        $id = $this->postJson('/api/v1/products', $this->payload($c))->assertCreated()->json('data.id');
        $url = '/api/v1/products/'.$id;
        $member = User::factory()->create();
        $c->users()->attach($member, ['role' => 'member']);
        Sanctum::actingAs($member);
        $this->getJson($url)->assertOk();
        $this->getJson($url.'/ncm-history')->assertOk();
        $this->postJson($url.'/confirm-ncm')->assertForbidden();
        $this->patchJson($url, ['description' => 'No'])->assertForbidden();
        $this->postJson('/api/v1/products', $this->payload($c))->assertForbidden();
        Sanctum::actingAs(User::factory()->create());
        $this->getJson('/api/v1/products?q=Produto')->assertOk()->assertJsonCount(0, 'data');
        $this->getJson($url)->assertNotFound();
        $this->getJson($url.'/ncm-history')->assertNotFound();
        $this->patchJson($url, ['description' => 'No'])->assertNotFound();
        $this->postJson($url.'/confirm-ncm')->assertNotFound();
        $this->postJson('/api/v1/products', $this->payload($c))->assertNotFound();
    }
}
