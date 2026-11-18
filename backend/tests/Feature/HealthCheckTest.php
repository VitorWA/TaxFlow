<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Exceptions;
use Illuminate\Support\Facades\Redis;
use RuntimeException;
use Tests\TestCase;

class HealthCheckTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        // Evita que as falhas simuladas sejam gravadas no log de desenvolvimento.
        Exceptions::fake();
    }

    public function test_returns_ok_when_database_and_redis_are_available(): void
    {
        Redis::shouldReceive('connection->ping')->andReturn(true);

        $this->getJson('/api/health')
            ->assertOk()
            ->assertExactJson([
                'status' => 'ok',
                'checks' => ['database' => 'ok', 'redis' => 'ok'],
            ]);
    }

    public function test_returns_service_unavailable_when_database_fails(): void
    {
        DB::shouldReceive('connection->select')->andThrow(new RuntimeException('db down'));
        Redis::shouldReceive('connection->ping')->andReturn(true);

        $this->getJson('/api/health')
            ->assertServiceUnavailable()
            ->assertExactJson([
                'status' => 'fail',
                'checks' => ['database' => 'fail', 'redis' => 'ok'],
            ]);
    }

    public function test_returns_service_unavailable_when_redis_fails(): void
    {
        Redis::shouldReceive('connection->ping')->andThrow(new RuntimeException('redis down'));

        $this->getJson('/api/health')
            ->assertServiceUnavailable()
            ->assertExactJson([
                'status' => 'fail',
                'checks' => ['database' => 'ok', 'redis' => 'fail'],
            ]);
    }

    public function test_does_not_expose_exception_details(): void
    {
        $secret = 'SQLSTATE[HY000] host=db user=taxflow password=secret';

        DB::shouldReceive('connection->select')->andThrow(new RuntimeException($secret));
        Redis::shouldReceive('connection->ping')->andReturn(true);

        $response = $this->getJson('/api/health')->assertServiceUnavailable();

        $this->assertStringNotContainsString('SQLSTATE', $response->getContent());
        $this->assertStringNotContainsString('password', $response->getContent());
        $this->assertSame(['status', 'checks'], array_keys($response->json()));
        Exceptions::assertReported(fn (RuntimeException $e) => $e->getMessage() === $secret);
    }
}
