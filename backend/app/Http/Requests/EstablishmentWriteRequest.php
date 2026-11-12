<?php

namespace App\Http\Requests;

use App\Domain\Enums\EstablishmentType;
use App\Domain\Enums\State;
use App\Domain\Enums\TaxpayerStatus;
use App\Domain\ValueObjects\Cnpj;
use App\Models\Establishment;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class EstablishmentWriteRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        if (is_string($this->input('cnpj'))) {
            try {
                $this->merge(['cnpj' => (new Cnpj($this->input('cnpj')))->value]);
            } catch (\InvalidArgumentException) {
            }
        }
    }

    public function authorize(): bool
    {
        $child = $this->route('establishment');
        if ($child instanceof Establishment) {
            Gate::authorize('update', $child);
        } else {
            Gate::authorize('create', [Establishment::class, $this->route('company')]);
        }

        return true;
    }

    public function bodyParameters(): array
    {
        return [
            'company_id' => ['description' => 'Definido pela URL. Não enviar.', 'example' => 'No-example'],
            'type' => ['description' => 'matriz ou filial.', 'example' => 'filial'],
            'cnpj' => ['description' => 'CNPJ válido com a mesma raiz da empresa.', 'example' => '11222333000262'],
            'state' => ['description' => 'UF obrigatória.', 'example' => 'MT'],
            'municipality' => ['description' => 'Município opcional.', 'example' => 'Cuiabá'],
            'state_registration' => ['description' => 'Inscrição estadual opcional.', 'example' => 'No-example'],
            'taxpayer_status' => ['description' => 'contribuinte, nao_contribuinte ou isento.', 'example' => 'contribuinte'],
        ];
    }

    public function rules(): array
    {
        $r = $this->isMethod('post') ? 'required' : 'sometimes';
        $child = $this->route('establishment');
        $company = $this->route('company');

        return [
            'company_id' => ['missing'],
            'type' => [$r, 'required', Rule::enum(EstablishmentType::class)],
            'cnpj' => ['bail', $r, 'required', 'string', function ($a, $v, $fail) use ($company) {
                try {
                    $cnpj = new Cnpj($v);
                    if (substr($cnpj->value, 0, 8) !== substr($company->cnpj, 0, 8)) {
                        $fail('CNPJ deve ter a mesma raiz da empresa.');
                    }
                } catch (\InvalidArgumentException) {
                    $fail('CNPJ inválido.');
                }
            }, Rule::unique('establishments', 'cnpj')->ignore($child instanceof Establishment ? $child->id : null)],
            'state' => [$r, 'required', Rule::enum(State::class)],
            'municipality' => ['sometimes', 'nullable', 'string', 'max:255'],
            'state_registration' => ['sometimes', 'nullable', 'string', 'max:30'],
            'taxpayer_status' => [$r, 'required', Rule::enum(TaxpayerStatus::class)],
        ];
    }
}
