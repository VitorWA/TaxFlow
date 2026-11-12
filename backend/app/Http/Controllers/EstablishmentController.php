<?php

namespace App\Http\Controllers;

use App\Http\Requests\CatalogIndexRequest;
use App\Http\Requests\EstablishmentWriteRequest;
use App\Http\Resources\EstablishmentResource;
use App\Models\Company;
use App\Models\Establishment;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\ValidationException;

/** @group Estabelecimentos */
class EstablishmentController extends Controller
{
    /**
     * Listar estabelecimentos da empresa.
     *
     * @responseFile 200 docs/examples/establishment-list.json
     *
     * @response 401 {"error":{"code":"unauthenticated","message":"Credenciais inválidas ou autenticação necessária.","details":{}},"request_id":"example"}
     * @response 403 {"error":{"code":"forbidden","message":"Acesso não permitido.","details":{}},"request_id":"example"}
     * @response 404 {"error":{"code":"not_found","message":"Recurso não encontrado.","details":{}},"request_id":"example"}
     * @response 422 {"error":{"code":"validation_failed","message":"Os dados informados são inválidos.","details":{}},"request_id":"example"}
     */
    public function index(CatalogIndexRequest $request, Company $company): AnonymousResourceCollection
    {
        Gate::authorize('view', $company);

        return EstablishmentResource::collection($company->establishments()->orderBy('id')->paginate($request->integer('per_page', 15))->withQueryString());
    }

    /**
     * Cadastrar estabelecimento. CNPJ válido com a mesma raiz da empresa; UF obrigatória.
     *
     * @responseFile 201 docs/examples/establishment.json
     *
     * @response 401 {"error":{"code":"unauthenticated","message":"Credenciais inválidas ou autenticação necessária.","details":{}},"request_id":"example"}
     * @response 403 {"error":{"code":"forbidden","message":"Acesso não permitido.","details":{}},"request_id":"example"}
     * @response 404 {"error":{"code":"not_found","message":"Recurso não encontrado.","details":{}},"request_id":"example"}
     * @response 422 {"error":{"code":"validation_failed","message":"Os dados informados são inválidos.","details":{}},"request_id":"example"}
     */
    public function store(EstablishmentWriteRequest $request, Company $company): EstablishmentResource
    {
        try {
            $child = $company->establishments()->create($request->validated());
        } catch (UniqueConstraintViolationException) {
            throw ValidationException::withMessages(['cnpj' => 'CNPJ de estabelecimento já cadastrado.']);
        }

        return new EstablishmentResource($child);
    }

    /**
     * Consultar estabelecimento da empresa indicada na URL.
     *
     * @responseFile 200 docs/examples/establishment.json
     *
     * @response 401 {"error":{"code":"unauthenticated","message":"Credenciais inválidas ou autenticação necessária.","details":{}},"request_id":"example"}
     * @response 403 {"error":{"code":"forbidden","message":"Acesso não permitido.","details":{}},"request_id":"example"}
     * @response 404 {"error":{"code":"not_found","message":"Recurso não encontrado.","details":{}},"request_id":"example"}
     * @response 422 {"error":{"code":"validation_failed","message":"Os dados informados são inválidos.","details":{}},"request_id":"example"}
     */
    public function show(Company $company, Establishment $establishment): EstablishmentResource
    {
        Gate::authorize('view', $establishment);

        return new EstablishmentResource($establishment);
    }

    /**
     * Atualizar estabelecimento. Somente proprietário; company_id não pode ser transferido.
     *
     * @responseFile 200 docs/examples/establishment.json
     *
     * @response 401 {"error":{"code":"unauthenticated","message":"Credenciais inválidas ou autenticação necessária.","details":{}},"request_id":"example"}
     * @response 403 {"error":{"code":"forbidden","message":"Acesso não permitido.","details":{}},"request_id":"example"}
     * @response 404 {"error":{"code":"not_found","message":"Recurso não encontrado.","details":{}},"request_id":"example"}
     * @response 422 {"error":{"code":"validation_failed","message":"Os dados informados são inválidos.","details":{}},"request_id":"example"}
     */
    public function update(EstablishmentWriteRequest $request, Company $company, Establishment $establishment): EstablishmentResource
    {
        try {
            $establishment->update($request->validated());
        } catch (UniqueConstraintViolationException) {
            throw ValidationException::withMessages(['cnpj' => 'CNPJ de estabelecimento já cadastrado.']);
        }

        return new EstablishmentResource($establishment->refresh());
    }
}
