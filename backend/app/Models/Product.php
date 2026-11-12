<?php

namespace App\Models;

use App\Domain\Enums\ClassificationStatus;
use App\Models\Concerns\BelongsToCompany;
use Database\Factories\ProductFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/** @property ClassificationStatus $classification_status */
class Product extends Model
{
    use BelongsToCompany;

    /** @use HasFactory<ProductFactory> */
    use HasFactory;

    protected $fillable = ['company_id', 'description', 'ean', 'internal_code', 'ncm_code'];

    protected function casts(): array
    {
        return ['classification_status' => ClassificationStatus::class, 'confirmed_at' => 'datetime'];
    }

    /** @return BelongsTo<Ncm,$this> */
    public function ncm(): BelongsTo
    {
        return $this->belongsTo(Ncm::class, 'ncm_code', 'code');
    }

    /** @return HasMany<ProductNcmChange,$this> */
    public function ncmChanges(): HasMany
    {
        return $this->hasMany(ProductNcmChange::class);
    }
}
