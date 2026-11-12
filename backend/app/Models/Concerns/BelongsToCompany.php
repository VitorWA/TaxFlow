<?php

namespace App\Models\Concerns;

use App\Models\Company;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

trait BelongsToCompany
{
    /** @return BelongsTo<Company, $this> */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function scopeAccessibleTo(Builder $query, User $user): Builder
    {
        return $query->whereIn($this->qualifyColumn('company_id'), Company::query()->accessibleTo($user)->select('companies.id'));
    }
}
