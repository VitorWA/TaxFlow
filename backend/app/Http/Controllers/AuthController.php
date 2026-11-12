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

    public function me(Request $request): UserResource
    {
        return new UserResource($request->user());
    }

    public function logout(Request $request): JsonResource
    {
        $request->user()->currentAccessToken()->delete();

        return new JsonResource(['message' => 'Sessão encerrada.']);
    }
}
