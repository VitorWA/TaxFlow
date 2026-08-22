<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register_login_read_session_and_logout(): void
    {
        $this->withHeader('Origin', 'http://localhost:3000');
        $this->withoutMiddleware(ValidateCsrfToken::class);

        $email = 'usuario@taxflow.test';
        $password = 'SenhaTeste123!';

        $this->postJson('/api/auth/register', [
            'name' => 'Usuário Teste',
            'company' => 'TaxFlow',
            'cnpj' => '12.345.678/0001-95',
            'email' => $email,
            'password' => $password,
        ])->assertCreated()
            ->assertJson(['message' => 'Conta criada com sucesso.']);

        $this->assertDatabaseHas('users', [
            'email' => $email,
            'cnpj' => '12345678000195',
        ]);

        $this->postJson('/api/auth/login', [
            'email' => $email,
            'password' => $password,
            'remember' => true,
        ])->assertOk()
            ->assertJsonPath('user.email', $email);

        $this->getJson('/api/auth/me')
            ->assertOk()
            ->assertJsonPath('user.email', $email);

        $this->postJson('/api/auth/logout')->assertOk();
        $this->assertGuest();
    }

    public function test_login_rejects_invalid_credentials(): void
    {
        $this->withHeader('Origin', 'http://localhost:3000');
        $this->withoutMiddleware(ValidateCsrfToken::class);

        $this->postJson('/api/auth/login', [
            'email' => 'inexistente@taxflow.test',
            'password' => 'SenhaIncorreta123!',
        ])->assertUnauthorized()
            ->assertJson(['message' => 'E-mail ou senha incorretos.']);
    }

    public function test_registration_accepts_official_alphanumeric_cnpj_format(): void
    {
        $this->withHeader('Origin', 'http://localhost:3000');
        $this->withoutMiddleware(ValidateCsrfToken::class);

        $this->postJson('/api/auth/register', [
            'name' => 'Empresa Alfanumérica',
            'cnpj' => '12.ABC.345/01DE-35',
            'email' => 'alfanumerico@taxflow.test',
            'password' => 'SenhaTeste123!',
        ])->assertCreated();

        $this->assertDatabaseHas('users', [
            'email' => 'alfanumerico@taxflow.test',
            'cnpj' => '12ABC34501DE35',
        ]);
    }

    public function test_registration_rejects_invalid_cnpj(): void
    {
        $this->withHeader('Origin', 'http://localhost:3000');
        $this->withoutMiddleware(ValidateCsrfToken::class);

        $this->postJson('/api/auth/register', [
            'name' => 'Empresa Inválida',
            'cnpj' => '12.ABC.345/01DE-99',
            'email' => 'invalido@taxflow.test',
            'password' => 'SenhaTeste123!',
        ])->assertUnprocessable()
            ->assertJsonValidationErrors('cnpj');
    }
}
