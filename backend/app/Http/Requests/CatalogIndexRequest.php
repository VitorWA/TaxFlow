<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/** Query parameters */
class CatalogIndexRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function queryParameters(): array
    {
        return ['q' => ['description' => 'Código/descrição para NCM; descrição/EAN/NCM para produtos.', 'example' => '0101'],
            'page' => ['description' => 'Página a partir de 1.', 'example' => 1],
            'per_page' => ['description' => 'Entre 1 e 100; padrão 15.', 'example' => 15],
            'company_id' => ['description' => 'Filtro de empresa somente para produtos.', 'example' => 1]];
    }

    public function rules(): array
    {
        return ['q' => ['sometimes', 'nullable', 'string', 'max:255'], 'page' => ['sometimes', 'integer', 'min:1'], 'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'], 'company_id' => ['sometimes', 'integer', 'min:1']];
    }
}
