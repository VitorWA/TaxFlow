<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_compound_email_values_return_validation_errors(): void
    {
        foreach ([[], ['unexpected'], (object) ['address' => 'test@example.com']] as $email) {
            $this->postJson('/api/v1/auth/login', ['email' => $email, 'password' => 'test'])
                ->assertUnprocessable()
                ->assertJsonPath('error.code', 'validation_failed')
                ->assertJsonStructure(['error' => ['details' => ['email']]]);
        }
    }

    public function test_invalid_email_requests_remain_rate_limited_by_ip(): void
    {
        for ($i = 0; $i < 30; $i++) {
            $this->postJson('/api/v1/auth/login', ['email' => [], 'password' => 'test'])->assertUnprocessable();
        }
        $this->postJson('/api/v1/auth/login', ['email' => [], 'password' => 'test'])
            ->assertStatus(429)->assertHeader('Retry-After');
    }

    public function test_login_me_logout_and_revocation_with_real_bearer_token(): void
    {
        $user = User::factory()->create(['password' => Hash::make('test-password')]);
        $response = $this->postJson('/api/v1/auth/login', ['email' => $user->email, 'password' => 'test-password'])
            ->assertOk()->assertJsonPath('data.token_type', 'Bearer')->assertJsonMissingPath('data.user.password');
        $token = $response->json('data.token');
        $this->assertNotSame($token, $user->tokens()->first()->token);
        $otherToken = $user->createToken('other')->plainTextToken;
        $this->withToken($token)->getJson('/api/v1/auth/me')->assertOk()->assertJsonPath('data.user', null)->assertJsonPath('data.id', $user->id);
        $this->withToken($token)->postJson('/api/v1/auth/logout')->assertOk();
        $this->app['auth']->forgetGuards();
        $this->withToken($token)->getJson('/api/v1/auth/me')->assertUnauthorized();
        $this->app['auth']->forgetGuards();
        $this->withToken($otherToken)->getJson('/api/v1/auth/me')->assertOk();
    }

    public function test_invalid_credentials_use_same_error_for_unknown_or_known_user(): void
    {
        $user = User::factory()->create();
        foreach ([$user->email, 'unknown@example.com'] as $email) {
            $this->postJson('/api/v1/auth/login', ['email' => $email, 'password' => 'wrong'])
                ->assertUnauthorized()->assertJsonPath('error.code', 'unauthenticated');
        }
    }

    public function test_login_validation_and_rate_limit(): void
    {
        $this->postJson('/api/v1/auth/login', [])->assertUnprocessable()->assertJsonPath('error.code', 'validation_failed');
        for ($i = 0; $i < 5; $i++) {
            $this->postJson('/api/v1/auth/login', ['email' => 'limited@example.com', 'password' => 'bad'])->assertUnauthorized();
        }
        $this->postJson('/api/v1/auth/login', ['email' => 'limited@example.com', 'password' => 'bad'])
            ->assertStatus(429)->assertHeader('Retry-After')->assertJsonPath('error.code', 'too_many_requests');
    }

    public function test_domain_routes_require_authentication(): void
    {
        foreach (['/api/v1/auth/me', '/api/v1/domain/enums', '/api/v1/companies'] as $path) {
            $this->getJson($path)->assertUnauthorized()->assertJsonPath('error.code', 'unauthenticated');
        }
    }

    public function test_authenticated_user_can_read_enum_options(): void
    {
        $user = User::factory()->create();
        $this->withToken($user->createToken('test')->plainTextToken)->getJson('/api/v1/domain/enums')
            ->assertOk()->assertJsonCount(27, 'data.states')->assertJsonCount(4, 'data.tax_regimes');
    }
}
