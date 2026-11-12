<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\DB;
use Knuckles\Scribe\Extracting\Strategies\Responses\ResponseCalls;
use Symfony\Component\Yaml\Yaml;
use Tests\TestCase;

class ApiDocumentationTest extends TestCase
{
    public function test_documentation_is_generated_without_response_calls_and_covers_routes(): void
    {
        $writes = [];
        DB::listen(function ($query) use (&$writes): void {
            if (preg_match('/^\\s*(insert|update|delete|replace|create|drop|alter|truncate)\\b/i', $query->sql)) {
                $writes[] = $query->sql;
            }
        });
        $this->artisan('scribe:generate', ['--no-interaction' => true, '--force' => true])->assertSuccessful();
        $this->assertSame([], $writes, 'Gerar documentação não pode alterar o banco.');
        $this->assertNotContains(ResponseCalls::class, config('scribe.strategies.responses'));
        $this->assertSame([], config('scribe.database_connections_to_transact'));
        $this->assertSame([], config('scribe.examples.models_source'));
        $spec = Yaml::parseFile(storage_path('app/private/scribe/openapi.yaml'));
        foreach ($spec['paths'] as $operations) {
            foreach (['get', 'post', 'put', 'patch'] as $method) {
                if (isset($operations[$method])) {
                    $this->assertNotEmpty($operations[$method]['responses']['200'] ?? $operations[$method]['responses']['201'] ?? null);
                }
            }
        }
        $this->assertArrayHasKey('429', $spec['paths']['/api/v1/auth/login']['post']['responses']);
        $this->assertArrayNotHasKey('requestBody', $spec['paths']['/api/v1/products']['get']);
        foreach (['/api/v1/auth/login', '/api/v1/companies', '/api/v1/companies/{company_id}/establishments', '/api/v1/ncms', '/api/v1/ncms/{ncm_code}', '/api/v1/products', '/api/v1/products/{product_id}/confirm-ncm', '/api/v1/products/{product_id}/ncm-history'] as $path) {
            $this->assertArrayHasKey($path, $spec['paths']);
        }
        $this->get('/docs')->assertOk();
        $this->get('/docs.openapi')->assertOk();
        $this->get('/docs.postman')->assertOk();
        $this->app->instance('env', 'production');
        foreach (['/docs', '/docs.openapi', '/docs.postman'] as $path) {
            $this->get($path)->assertNotFound();
        }
    }
}
