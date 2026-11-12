<?php

namespace App\Http\Requests;

use App\Domain\ValueObjects\Ean;
use App\Models\Company;
use App\Models\Product;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class ProductWriteRequest extends FormRequest
{
    public function authorize(): bool
    {
        $product = $this->route('product');
        if ($product instanceof Product) {
            Gate::authorize('update', $product);
        } elseif (filter_var($this->input('company_id'), FILTER_VALIDATE_INT) !== false) {
            Gate::authorize('create', [Product::class, Company::findOrFail($this->input('company_id'))]);
        }

        return true;
    }

    public function bodyParameters(): array
    {
        return [
            'company_id' => ['description' => 'Empresa acessível; obrigatório no cadastro, proibido na edição.', 'example' => $this->isMethod('post') ? 1 : 'No-example'],
            'description' => ['description' => 'Descrição do produto.', 'example' => 'Produto exemplo'],
            'ean' => ['description' => 'GTIN/EAN válido de 8, 12, 13 ou 14 dígitos; opcional.', 'example' => '7894900011517'],
            'internal_code' => ['description' => 'Código interno opcional.', 'example' => 'PROD-01'],
            'ncm_code' => ['description' => 'Oito dígitos, existente na tabela e vigente na data da operação.', 'example' => '01012100'],
            'classification_status' => ['description' => 'Campo do servidor. Não enviar.', 'example' => 'No-example'],
            'confirmed_by' => ['description' => 'Campo do servidor. Não enviar.', 'example' => 'No-example'],
            'confirmed_at' => ['description' => 'Campo do servidor. Não enviar.', 'example' => 'No-example'],
        ];
    }

    public function rules(): array
    {
        $create = $this->isMethod('post');
        $r = $create ? 'required' : 'sometimes';

        return ['company_id' => $create ? ['required', 'integer', 'min:1', 'exists:companies,id'] : ['missing'],
            'description' => [$r, 'required', 'string', 'max:255'],
            'ean' => ['bail', 'sometimes', 'nullable', 'string', function ($a, $v, $fail) {
                try {
                    new Ean($v);
                } catch (\InvalidArgumentException) {
                    $fail('EAN/GTIN inválido.');
                }
            }],
            'internal_code' => ['sometimes', 'nullable', 'string', 'max:100'],
            'ncm_code' => [$r, 'required', 'string', 'regex:/^[0-9]{8}$/D'],
            'classification_status' => ['missing'], 'confirmed_by' => ['missing'], 'confirmed_at' => ['missing'],
        ];
    }
}
