<?php

namespace App\Http\Resources;

use App\Models\Ncm;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Ncm */
class NcmResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return ['code' => $this->code, 'description' => $this->description, 'valid_from' => $this->valid_from->toDateString(), 'valid_until' => $this->valid_until->toDateString(), 'legal_act' => $this->legal_act, 'source' => $this->source, 'imported_at' => $this->imported_at->toISOString(), 'in_current_table' => $this->in_current_table, 'is_current' => $this->resource->isCurrent()];
    }
}
