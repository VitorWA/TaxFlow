<?php

namespace App\Http\Controllers;

use App\Http\Requests\CatalogIndexRequest;
use App\Http\Requests\ConfirmNcmRequest;
use App\Http\Requests\ProductWriteRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Services\ProductWriter;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Gate;

/** @group Produtos */
class ProductController extends Controller
{
    /**
     * Pesquisar produtos acessíveis por descrição, EAN ou NCM.
     *
     * @responseFile 200 docs/examples/product-list.json
     *
     * @response 401 {"error":{"code":"unauthenticated","message":"Credenciais inválidas ou autenticação necessária.","details":{}},"request_id":"example"}
     * @response 403 {"error":{"code":"forbidden","message":"Acesso não permitido.","details":{}},"request_id":"example"}
     * @response 404 {"error":{"code":"not_found","message":"Recurso não encontrado.","details":{}},"request_id":"example"}
     * @response 422 {"error":{"code":"validation_failed","message":"Os dados informados são inválidos.","details":{}},"request_id":"example"}
     */
    public function index(CatalogIndexRequest $request): AnonymousResourceCollection
    {
        $query = Product::query()->accessibleTo($request->user())->with('ncm');
        if ($request->validated('company_id')) {
            $query->where('company_id', $request->validated('company_id'));
        }
        $q = $request->validated('q');
        if (is_string($q) && $q !== '') {
            $literal = str_replace(['!', '%', '_'], ['!!', '!%', '!_'], $q);
            $query->where(function ($b) use ($literal) {
                foreach (['description', 'ean', 'ncm_code'] as $col) {
                    $b->orWhereRaw($col." LIKE ? ESCAPE '!'", ['%'.$literal.'%']);
                }
            });
        }

        return ProductResource::collection($query->orderBy('id')->paginate($request->integer('per_page', 15))->withQueryString());
    }

    /**
     * Cadastrar produto com classificação sugerida e NCM vigente.
     *
     * @responseFile 201 docs/examples/product.json
     *
     * @response 401 {"error":{"code":"unauthenticated","message":"Credenciais inválidas ou autenticação necessária.","details":{}},"request_id":"example"}
     * @response 403 {"error":{"code":"forbidden","message":"Acesso não permitido.","details":{}},"request_id":"example"}
     * @response 404 {"error":{"code":"not_found","message":"Recurso não encontrado.","details":{}},"request_id":"example"}
     * @response 422 {"error":{"code":"validation_failed","message":"Os dados informados são inválidos.","details":{}},"request_id":"example"}
     */
    public function store(ProductWriteRequest $request, ProductWriter $writer): ProductResource
    {
        return new ProductResource($writer->write($request->validated(), $request->user()));
    }

    /**
     * Consultar produto e NCM.
     *
     * @responseFile 200 docs/examples/product.json
     *
     * @response 401 {"error":{"code":"unauthenticated","message":"Credenciais inválidas ou autenticação necessária.","details":{}},"request_id":"example"}
     * @response 403 {"error":{"code":"forbidden","message":"Acesso não permitido.","details":{}},"request_id":"example"}
     * @response 404 {"error":{"code":"not_found","message":"Recurso não encontrado.","details":{}},"request_id":"example"}
     * @response 422 {"error":{"code":"validation_failed","message":"Os dados informados são inválidos.","details":{}},"request_id":"example"}
     */
    public function show(Product $product): ProductResource
    {
        Gate::authorize('view', $product);

        return new ProductResource($product->load('ncm'));
    }

    /**
     * Atualizar produto. Trocar NCM invalida a confirmação anterior e registra histórico.
     *
     * @responseFile 200 docs/examples/product.json
     *
     * @response 401 {"error":{"code":"unauthenticated","message":"Credenciais inválidas ou autenticação necessária.","details":{}},"request_id":"example"}
     * @response 403 {"error":{"code":"forbidden","message":"Acesso não permitido.","details":{}},"request_id":"example"}
     * @response 404 {"error":{"code":"not_found","message":"Recurso não encontrado.","details":{}},"request_id":"example"}
     * @response 422 {"error":{"code":"validation_failed","message":"Os dados informados são inválidos.","details":{}},"request_id":"example"}
     */
    public function update(ProductWriteRequest $request, Product $product, ProductWriter $writer): ProductResource
    {
        return new ProductResource($writer->write($request->validated(), $request->user(), $product));
    }

    /**
     * Confirmar NCM vigente. Corpo vazio; autor e data são definidos pelo servidor. Repetição é idempotente.
     *
     * @responseFile 200 docs/examples/confirmed.json
     *
     * @response 401 {"error":{"code":"unauthenticated","message":"Credenciais inválidas ou autenticação necessária.","details":{}},"request_id":"example"}
     * @response 403 {"error":{"code":"forbidden","message":"Acesso não permitido.","details":{}},"request_id":"example"}
     * @response 404 {"error":{"code":"not_found","message":"Recurso não encontrado.","details":{}},"request_id":"example"}
     * @response 422 {"error":{"code":"validation_failed","message":"Os dados informados são inválidos.","details":{}},"request_id":"example"}
     */
    public function confirm(ConfirmNcmRequest $request, Product $product, ProductWriter $writer): ProductResource
    {
        return new ProductResource($writer->confirm($product, $request->user()));
    }

    /**
     * Consultar histórico paginado de trocas de NCM, com autor e data.
     *
     * @responseFile 200 docs/examples/history-list.json
     *
     * @response 401 {"error":{"code":"unauthenticated","message":"Credenciais inválidas ou autenticação necessária.","details":{}},"request_id":"example"}
     * @response 403 {"error":{"code":"forbidden","message":"Acesso não permitido.","details":{}},"request_id":"example"}
     * @response 404 {"error":{"code":"not_found","message":"Recurso não encontrado.","details":{}},"request_id":"example"}
     * @response 422 {"error":{"code":"validation_failed","message":"Os dados informados são inválidos.","details":{}},"request_id":"example"}
     */
    public function history(CatalogIndexRequest $request, Product $product): AnonymousResourceCollection
    {
        Gate::authorize('view', $product);

        return JsonResource::collection($product->ncmChanges()->orderBy('id')->paginate($request->integer('per_page', 15)));
    }
}
