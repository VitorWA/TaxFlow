<?php

namespace App\Http;

use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Throwable;

class ApiErrors
{
    public static function render(Throwable $error, Request $request): ?JsonResponse
    {
        if (! $request->is('api/*')) {
            return null;
        }
        $status = match (true) {
            $error instanceof ValidationException => 422,
            $error instanceof AuthenticationException => 401,
            $error instanceof AuthorizationException => $error->status() ?? 403,
            $error instanceof ModelNotFoundException => 404,
            $error instanceof HttpExceptionInterface => $error->getStatusCode(),
            default => 500,
        };
        [$code, $message] = match ($status) {
            401 => ['unauthenticated', 'Credenciais inválidas ou autenticação necessária.'],
            403 => ['forbidden', 'Acesso não permitido.'],
            404 => ['not_found', 'Recurso não encontrado.'],
            405 => ['method_not_allowed', 'Método não permitido.'],
            422 => ['validation_failed', 'Os dados informados são inválidos.'],
            429 => ['too_many_requests', 'Muitas tentativas. Tente novamente mais tarde.'],
            default => [$status >= 500 ? 'server_error' : 'http_error', $status >= 500 ? 'Erro interno do servidor.' : 'Não foi possível atender à solicitação.'],
        };

        return response()->json([
            'error' => ['code' => $code, 'message' => $message, 'details' => $error instanceof ValidationException ? $error->errors() : (object) []],
            'request_id' => $request->attributes->get('request_id'),
        ], $status, $error instanceof HttpExceptionInterface ? $error->getHeaders() : []);
    }
}
