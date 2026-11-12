<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class ConfirmNcmRequest extends FormRequest
{
    public function authorize(): bool
    {
        Gate::authorize('update', $this->route('product'));

        return true;
    }

    public function rules(): array
    {
        return ['ncm_code' => ['missing'], 'classification_status' => ['missing'], 'confirmed_by' => ['missing'], 'confirmed_at' => ['missing'], 'company_id' => ['missing']];
    }
}
