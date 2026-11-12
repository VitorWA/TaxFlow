<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\Concerns\BelongsToCompany;
use App\Models\User;
use App\Policies\EstablishmentPolicy;
use App\Policies\ProductPolicy;
use App\Policies\TaxConsultationPolicy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class CompanyOwnedAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_policies_deny_foreign_resources_and_limit_member_writes(): void
    {
        $owner = User::factory()->create();
        $member = User::factory()->create();
        $outsider = User::factory()->create();
        $company = Company::factory()->create();
        $company->users()->attach($owner, ['role' => 'owner']);
        $company->users()->attach($member, ['role' => 'member']);
        $resource = new CompanyOwnedTestRecord;
        $resource->setAttribute('company_id', $company->id);

        foreach ([EstablishmentPolicy::class, ProductPolicy::class, TaxConsultationPolicy::class] as $policy) {
            Gate::policy(CompanyOwnedTestRecord::class, $policy);
            $this->assertTrue(Gate::forUser($owner)->allows('view', $resource));
            $this->assertTrue(Gate::forUser($owner)->allows('update', $resource));
            $this->assertTrue(Gate::forUser($owner)->allows('create', [CompanyOwnedTestRecord::class, $company]));
            $this->assertTrue(Gate::forUser($member)->allows('view', $resource));
            $this->assertFalse(Gate::forUser($member)->allows('update', $resource));
            $this->assertFalse(Gate::forUser($member)->allows('delete', $resource));
            $this->assertFalse(Gate::forUser($member)->allows('create', [CompanyOwnedTestRecord::class, $company]));
            $this->assertSame(404, Gate::forUser($outsider)->inspect('view', $resource)->status());
            $this->assertSame(404, Gate::forUser($outsider)->inspect('update', $resource)->status());
            $this->assertFalse(Gate::forUser($outsider)->allows('create', [CompanyOwnedTestRecord::class, $company]));
        }
    }

    public function test_scope_filters_by_membership_and_is_empty_without_memberships(): void
    {
        Schema::create('company_owned_test_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id');
        });
        try {
            $user = User::factory()->create();
            $own = Company::factory()->create();
            $foreign = Company::factory()->create();
            $own->users()->attach($user, ['role' => 'member']);
            $record = CompanyOwnedTestRecord::create(['company_id' => $own->id]);
            CompanyOwnedTestRecord::create(['company_id' => $foreign->id]);
            $this->assertSame([$record->id], CompanyOwnedTestRecord::query()->accessibleTo($user)->pluck('id')->all());
            $this->assertSame(0, CompanyOwnedTestRecord::query()->accessibleTo(User::factory()->create())->count());
            $this->assertSame($own->id, $record->company->id);
        } finally {
            Schema::dropIfExists('company_owned_test_records');
        }
    }
}

class CompanyOwnedTestRecord extends Model
{
    use BelongsToCompany;

    public $timestamps = false;

    protected $fillable = ['company_id'];
}
