<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Exceptions;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;
use Psr\Log\LoggerInterface;
use RuntimeException;
use Tests\TestCase;

class ApiContractTest extends TestCase
{
    public function test_errors_have_request_id_and_never_expose_internal_details(): void
    {
        Exceptions::fake();
        config(['app.debug' => true]);
        Route::get('/api/test-error', fn () => throw new RuntimeException('password=secret SQLSTATE'));
        Route::get('/api/test-forbidden', fn () => abort(403));
        foreach (['/api/test-error' => 500, '/api/test-forbidden' => 403, '/api/missing' => 404] as $path => $status) {
            $response = $this->getJson($path)->assertStatus($status)->assertJsonStructure(['error' => ['code', 'message', 'details'], 'request_id']);
            $this->assertTrue(Str::isUuid($response->json('request_id')));
            $this->assertSame($response->json('request_id'), $response->headers->get('X-Request-ID'));
            $this->assertStringNotContainsString('SQLSTATE', $response->getContent());
            $response->assertJsonMissingPath('trace');
        }
    }

    public function test_cors_accepts_frontend_and_rejects_other_origins(): void
    {
        $this->withHeaders(['Origin' => 'http://localhost:3000', 'Access-Control-Request-Method' => 'POST', 'Access-Control-Request-Headers' => 'authorization,content-type'])
            ->options('/api/v1/auth/login')->assertSuccessful()->assertHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
        $this->withHeaders(['Origin' => 'https://untrusted.example', 'Access-Control-Request-Method' => 'POST'])
            ->options('/api/v1/auth/login')->assertHeaderMissing('Access-Control-Allow-Origin');
    }

    public function test_request_log_contains_metadata_without_credentials(): void
    {
        Log::spy();
        $logger = \Mockery::mock(LoggerInterface::class);
        Log::shouldReceive('channel')->with('api')->andReturn($logger);
        $logger->shouldReceive('info')->once()->with('http_request', \Mockery::on(function (array $context): bool {
            return Str::isUuid($context['request_id']) && $context['status'] === 422
                && ! str_contains(json_encode($context), 'private-password');
        }));
        $this->postJson('/api/v1/auth/login', ['password' => 'private-password'])->assertUnprocessable();
    }
}
