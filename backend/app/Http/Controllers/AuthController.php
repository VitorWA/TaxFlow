<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
     * Entrar e obter token Sanctum.
     *
     * @group Autenticação
     *
     * @unauthenticated
     *
     * @response 200 {"data":{"token":"example-token","token_type":"Bearer","user":{"id":1,"name":"Exemplo","email":"dev@example.test"}}}
     * @response 401 {"error":{"code":"unauthenticated","message":"Credenciais inválidas ou autenticação necessária.","details":{}},"request_id":"example"}
     * @response 422 {"error":{"code":"validation_failed","message":"Os dados informados são inválidos.","details":{"email":["O campo email é obrigatório."]}},"request_id":"example"}
     * @response 429 {"error":{"code":"too_many_requests","message":"Muitas tentativas. Tente novamente mais tarde.","details":{}},"request_id":"example"}
     */
    public function login(LoginRequest $request): JsonResource
    {
        $user = User::where('email', $request->validated('email'))->first();
        // Same hashing cost for unknown users to reduce account enumeration by timing.
        $hash = $user->password ?? '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.';
        if (! Hash::check($request->validated('password'), $hash) || ! $user) {
            throw new AuthenticationException;
        }

        return new JsonResource([
            'token' => $user->createToken('api')->plainTextToken,
            'token_type' => 'Bearer',
            'user' => new UserResource($user),
        ]);
    }

    /**
     * Consultar usuário autenticado.
     *
     * @responseFile 200 docs/examples/user.json
     *
     * @response 401 {"error":{"code":"unauthenticated","message":"Credenciais inválidas ou autenticação necessária.","details":{}},"request_id":"example"}
     * @response 403 {"error":{"code":"forbidden","message":"Acesso não permitido.","details":{}},"request_id":"example"}
     * @response 404 {"error":{"code":"not_found","message":"Recurso não encontrado.","details":{}},"request_id":"example"}
     * @response 422 {"error":{"code":"validation_failed","message":"Os dados informados são inválidos.","details":{}},"request_id":"example"}
     */
    public function me(Request $request): UserResource
    {
        return new UserResource($request->user());
    }

    /**
     * Revogar somente o token Bearer usado nesta requisição.
     *
     * @response 200 {"data":{"message":"Sessão encerrada."}}
     * @response 401 {"error":{"code":"unauthenticated","message":"Credenciais inválidas ou autenticação necessária.","details":{}},"request_id":"example"}
     * @response 403 {"error":{"code":"forbidden","message":"Acesso não permitido.","details":{}},"request_id":"example"}
     * @response 404 {"error":{"code":"not_found","message":"Recurso não encontrado.","details":{}},"request_id":"example"}
     * @response 422 {"error":{"code":"validation_failed","message":"Os dados informados são inválidos.","details":{}},"request_id":"example"}
     */
    public function logout(Request $request): JsonResource
    {
        $request->user()->currentAccessToken()->delete();

        return new JsonResource(['message' => 'Sessão encerrada.']);
    }
}
