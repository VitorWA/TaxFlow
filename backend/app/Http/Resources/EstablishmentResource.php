<?php

namespace App\Http\Resources;

use App\Models\Establishment;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Establishment */
class EstablishmentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return $this->resource->only(['id', 'company_id', 'type', 'cnpj', 'state', 'municipality', 'state_registration', 'taxpayer_status', 'created_at', 'updated_at']);
    }
}
