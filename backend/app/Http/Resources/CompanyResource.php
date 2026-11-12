<?php

namespace App\Http\Resources;

use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Company */
class CompanyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'cnpj' => $this->cnpj,
            'legal_name' => $this->legal_name,
            'trade_name' => $this->trade_name,
            'tax_regime' => $this->tax_regime->value,
            'state' => $this->state?->value,
            'municipality' => $this->municipality,
            'state_registration' => $this->state_registration,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
