<?php

namespace App\Http\Controllers;

use App\Http\Requests\CompanyIndexRequest;
use App\Http\Requests\CompanyWriteRequest;
use App\Http\Resources\CompanyResource;
use App\Models\Company;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\ValidationException;

class CompanyController extends Controller
{
    /**
     * Listar empresas acessíveis.
     *
     * @responseFile 200 docs/examples/company-list.json
     *
     * @response 401 {"error":{"code":"unauthenticated","message":"Credenciais inválidas ou autenticação necessária.","details":{}},"request_id":"example"}
     * @response 403 {"error":{"code":"forbidden","message":"Acesso não permitido.","details":{}},"request_id":"example"}
     * @response 404 {"error":{"code":"not_found","message":"Recurso não encontrado.","details":{}},"request_id":"example"}
     * @response 422 {"error":{"code":"validation_failed","message":"Os dados informados são inválidos.","details":{}},"request_id":"example"}
     */
    public function index(CompanyIndexRequest $request): AnonymousResourceCollection
    {
        $filters = $request->validated();
        $query = Company::query()->accessibleTo($request->user());
        if (isset($filters['q']) && $filters['q'] !== '') {
            $query->where(function (Builder $query) use ($filters) {
                foreach (['legal_name', 'trade_name', 'cnpj'] as $column) {
                    $query->orWhere($column, 'like', '%'.$filters['q'].'%');
                }
            });
        }
        $query->orderBy($filters['sort'] ?? 'id', $filters['direction'] ?? 'asc');
        if (($filters['sort'] ?? 'id') !== 'id') {
            $query->orderBy('id');
        }

        return CompanyResource::collection($query->paginate($filters['per_page'] ?? 15)->withQueryString());
    }

    /**
     * Cadastrar empresa e vínculo de proprietário.
     *
     * @responseFile 201 docs/examples/company.json
     *
     * @response 401 {"error":{"code":"unauthenticated","message":"Credenciais inválidas ou autenticação necessária.","details":{}},"request_id":"example"}
     * @response 403 {"error":{"code":"forbidden","message":"Acesso não permitido.","details":{}},"request_id":"example"}
     * @response 404 {"error":{"code":"not_found","message":"Recurso não encontrado.","details":{}},"request_id":"example"}
     * @response 422 {"error":{"code":"validation_failed","message":"Os dados informados são inválidos.","details":{}},"request_id":"example"}
     */
    public function store(CompanyWriteRequest $request): CompanyResource
    {
        try {
            $company = DB::transaction(function () use ($request) {
                $company = Company::create($request->validated());
                $company->users()->attach($request->user()->id, ['role' => 'owner']);

                return $company;
            });
        } catch (UniqueConstraintViolationException) {
            throw ValidationException::withMessages(['cnpj' => ['Este CNPJ já está cadastrado.']]);
        }

        return new CompanyResource($company);
    }

    /**
     * Consultar empresa.
     *
     * @responseFile 200 docs/examples/company.json
     *
     * @response 401 {"error":{"code":"unauthenticated","message":"Credenciais inválidas ou autenticação necessária.","details":{}},"request_id":"example"}
     * @response 403 {"error":{"code":"forbidden","message":"Acesso não permitido.","details":{}},"request_id":"example"}
     * @response 404 {"error":{"code":"not_found","message":"Recurso não encontrado.","details":{}},"request_id":"example"}
     * @response 422 {"error":{"code":"validation_failed","message":"Os dados informados são inválidos.","details":{}},"request_id":"example"}
     */
    public function show(Company $company): CompanyResource
    {
        Gate::authorize('view', $company);

        return new CompanyResource($company);
    }

    /**
     * Atualizar empresa.
     *
     * @responseFile 200 docs/examples/company.json
     *
     * @response 401 {"error":{"code":"unauthenticated","message":"Credenciais inválidas ou autenticação necessária.","details":{}},"request_id":"example"}
     * @response 403 {"error":{"code":"forbidden","message":"Acesso não permitido.","details":{}},"request_id":"example"}
     * @response 404 {"error":{"code":"not_found","message":"Recurso não encontrado.","details":{}},"request_id":"example"}
     * @response 422 {"error":{"code":"validation_failed","message":"Os dados informados são inválidos.","details":{}},"request_id":"example"}
     */
    public function update(CompanyWriteRequest $request, Company $company): CompanyResource
    {
        try {
            $company->update($request->validated());
        } catch (UniqueConstraintViolationException) {
            throw ValidationException::withMessages(['cnpj' => ['Este CNPJ já está cadastrado.']]);
        }

        return new CompanyResource($company->refresh());
    }
}
