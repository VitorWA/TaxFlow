<?php

namespace App\Http\Controllers;

use App\Http\Requests\CatalogIndexRequest;
use App\Http\Resources\NcmResource;
use App\Models\Ncm;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/** @group NCM */
class NcmController extends Controller
{
    /**
     * Pesquisar NCM por prefixo do código ou parte da descrição.
     *
     * @responseFile 200 docs/examples/ncm-list.json
     *
     * @response 401 {"error":{"code":"unauthenticated","message":"Credenciais inválidas ou autenticação necessária.","details":{}},"request_id":"example"}
     * @response 403 {"error":{"code":"forbidden","message":"Acesso não permitido.","details":{}},"request_id":"example"}
     * @response 404 {"error":{"code":"not_found","message":"Recurso não encontrado.","details":{}},"request_id":"example"}
     * @response 422 {"error":{"code":"validation_failed","message":"Os dados informados são inválidos.","details":{}},"request_id":"example"}
     */
    public function index(CatalogIndexRequest $request): AnonymousResourceCollection
    {
        $q = $request->validated('q');
        $query = Ncm::query();
        if (is_string($q) && $q !== '') {
            $literal = str_replace(['!', '%', '_'], ['!!', '!%', '!_'], $q);
            $query->where(function ($b) use ($literal) {
                $b->whereRaw("code LIKE ? ESCAPE '!'", [$literal.'%'])->orWhereRaw("description LIKE ? ESCAPE '!'", ['%'.$literal.'%']);
            });
        }

        return NcmResource::collection($query->orderBy('code')->paginate($request->integer('per_page', 15))->withQueryString());
    }

    /**
     * Consultar fonte, ato e vigência de uma NCM de oito dígitos.
     *
     * @responseFile 200 docs/examples/ncm.json
     *
     * @response 401 {"error":{"code":"unauthenticated","message":"Credenciais inválidas ou autenticação necessária.","details":{}},"request_id":"example"}
     * @response 403 {"error":{"code":"forbidden","message":"Acesso não permitido.","details":{}},"request_id":"example"}
     * @response 404 {"error":{"code":"not_found","message":"Recurso não encontrado.","details":{}},"request_id":"example"}
     * @response 422 {"error":{"code":"validation_failed","message":"Os dados informados são inválidos.","details":{}},"request_id":"example"}
     */
    public function show(Ncm $ncm): NcmResource
    {
        return new NcmResource($ncm);
    }
}
