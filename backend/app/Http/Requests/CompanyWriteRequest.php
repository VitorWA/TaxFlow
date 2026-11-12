<?php

namespace App\Http\Requests;

use App\Domain\Enums\State;
use App\Domain\Enums\TaxRegime;
use App\Domain\ValueObjects\Cnpj;
use App\Models\Company;
use Closure;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;
use InvalidArgumentException;

class CompanyWriteRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        if (is_string($this->input('cnpj'))) {
            try {
                $this->merge(['cnpj' => (new Cnpj($this->input('cnpj')))->value]);
            } catch (InvalidArgumentException) {
                // The validation rule returns a field-specific error below.
            }
        }
    }

    public function authorize(): bool
    {
        $company = $this->route('company');
        Gate::authorize($company instanceof Company ? 'update' : 'create', $company ?? Company::class);

        return true;
    }

    public function rules(): array
    {
        $company = $this->route('company');
        $required = $this->isMethod('post') ? 'required' : 'sometimes';

        return [
            'cnpj' => ['bail', $required, 'required', 'string', function (string $attribute, mixed $value, Closure $fail) {
                try {
                    new Cnpj($value);
                } catch (InvalidArgumentException) {
                    $fail('O CNPJ informado é inválido.');
                }
            }, Rule::unique('companies', 'cnpj')->ignore($company instanceof Company ? $company->id : null)],
            'legal_name' => [$required, 'required', 'string', 'max:255'],
            'trade_name' => ['sometimes', 'nullable', 'string', 'max:255'],
            'tax_regime' => [$required, 'required', Rule::enum(TaxRegime::class)],
            'state' => ['sometimes', 'nullable', Rule::enum(State::class)],
            'municipality' => ['sometimes', 'nullable', 'string', 'max:255'],
            'state_registration' => ['sometimes', 'nullable', 'string', 'max:30'],
        ];
    }
}
