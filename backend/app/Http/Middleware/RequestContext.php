<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class RequestContext
{
    public function handle(Request $request, Closure $next): Response
    {
        $request->attributes->set('request_id', (string) Str::uuid());
        $request->attributes->set('request_started_at', microtime(true));
        Log::withContext(['request_id' => $request->attributes->get('request_id')]);
        $response = $next($request);
        $response->headers->set('X-Request-ID', $request->attributes->get('request_id'));

        return $response;
    }

    public function terminate(Request $request, Response $response): void
    {
        if (! $request->is('api/*')) {
            return;
        }
        Log::channel('api')->info('http_request', [
            'request_id' => $request->attributes->get('request_id'),
            'method' => $request->method(),
            'route' => $request->route()?->uri(),
            'status' => $response->getStatusCode(),
            'duration_ms' => round((microtime(true) - $request->attributes->get('request_started_at', microtime(true))) * 1000, 2),
        ]);
    }
}
