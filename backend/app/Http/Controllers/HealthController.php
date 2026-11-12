<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redis;
use Throwable;

class HealthController extends Controller
{
    /**
     * Disponibilidade do banco e Redis.
     *
     * @group Operação
     *
     * @unauthenticated
     *
     * @response 200 {"status":"ok","checks":{"database":"ok","redis":"ok"}}
     * @response 503 {"status":"fail","checks":{"database":"fail","redis":"ok"}}
     */
    public function __invoke(): JsonResponse
    {
        $checks = [
            'database' => $this->check(fn () => DB::connection()->select('select 1')),
            'redis' => $this->check(fn () => Redis::connection()->ping()),
        ];

        $healthy = ! in_array('fail', $checks, true);

        return response()->json([
            'status' => $healthy ? 'ok' : 'fail',
            'checks' => $checks,
        ], $healthy ? 200 : 503);
    }

    /**
     * Executa a checagem sem deixar detalhes da exceção chegarem à resposta.
     */
    private function check(callable $probe): string
    {
        try {
            $probe();

            return 'ok';
        } catch (Throwable $e) {
            report($e);

            return 'fail';
        }
    }
}
