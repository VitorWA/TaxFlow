<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Rules\Cnpj;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:150'],
            'company' => ['nullable', 'string', 'max:150'],
            'cnpj' => ['nullable', 'string', new Cnpj],
            'email' => ['required', 'email', 'max:190', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
        ], [
            'name.required' => 'Informe seu nome completo.',
            'email.required' => 'Informe seu e-mail.',
            'email.email' => 'Informe um e-mail válido.',
            'email.unique' => 'Este e-mail já está cadastrado.',
            'password.required' => 'Informe uma senha.',
            'password.min' => 'A senha precisa ter pelo menos 8 caracteres.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Revise os campos informados.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $validated = $validator->validated();

        $validated['email'] = strtolower($validated['email']);
        $validated['cnpj'] = empty($validated['cnpj']) ? null : Cnpj::normalize($validated['cnpj']);
        $validated['password'] = Hash::make($validated['password']);
        User::create($validated);

        return response()->json(['message' => 'Conta criada com sucesso.'], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
            'remember' => ['sometimes', 'boolean'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Informe seu e-mail e senha.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $credentials = $validator->validated();

        $remember = (bool) ($credentials['remember'] ?? false);
        unset($credentials['remember']);
        $credentials['email'] = strtolower($credentials['email']);

        if (!Auth::attempt($credentials, $remember)) {
            return response()->json(['message' => 'E-mail ou senha incorretos.'], 401);
        }

        $request->session()->regenerate();

        return response()->json(['user' => $request->user()]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json(['user' => $request->user()]);
    }

    public function logout(Request $request): JsonResponse
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        Auth::forgetGuards();

        return response()->json(['message' => 'Sessão encerrada.']);
    }
}
