<?php

namespace App\Http\Resources;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Product */
class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return array_merge($this->resource->only(['id', 'company_id', 'description', 'ean', 'internal_code', 'ncm_code', 'classification_status', 'confirmed_by', 'confirmed_at', 'created_at', 'updated_at']), ['ncm' => $this->whenLoaded('ncm', fn () => new NcmResource($this->ncm))]);
    }
}
