<?php

namespace Tests\Integration;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Schedule;
use Tests\TestCase;

class ProbeJob implements ShouldQueue
{
    use Queueable;

    public function __construct(public string $key) {}

    public function handle(): void
    {
        Redis::setex($this->key, 60, 'processed');
    }
}
class RuntimeTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        $this->assertSame('mysql', config('database.default'), 'Runtime smoke exige ambiente MySQL isolado.');
        $this->assertSame('testing', app()->environment());
    }

    public function test_real_redis_queue_worker_processes_job(): void
    {
        $this->assertSame('testing', app()->environment());
        $key = 'runtime-test:'.bin2hex(random_bytes(8));
        $queue = 'probe-'.bin2hex(random_bytes(8));
        try {
            Bus::dispatch((new ProbeJob($key))->onConnection('redis')->onQueue($queue));
            $this->artisan('queue:work', ['connection' => 'redis', '--queue' => $queue, '--once' => true, '--tries' => 1])->assertSuccessful();
            $this->assertSame('processed', Redis::get($key));
        } finally {
            Redis::del($key);
        }
    }

    public function test_scheduler_runs_due_task(): void
    {
        $key = 'schedule-test:'.bin2hex(random_bytes(8));
        try {
            Schedule::call(fn () => Redis::setex($key, 60, 'executed'))->name('runtime-probe')->everyMinute();
            $this->artisan('schedule:run')->assertSuccessful();
            $this->assertSame('executed', Redis::get($key));
        } finally {
            Redis::del($key);
        }
    }
}
