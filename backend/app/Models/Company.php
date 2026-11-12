<?php

namespace App\Models;

use App\Domain\Enums\State;
use App\Domain\Enums\TaxRegime;
use Database\Factories\CompanyFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property TaxRegime $tax_regime
 * @property State|null $state
 */
class Company extends Model
{
    /** @return HasMany<Establishment, $this> */
    public function establishments(): HasMany
    {
        return $this->hasMany(Establishment::class);
    }

    /** @use HasFactory<CompanyFactory> */
    use HasFactory;

    protected $fillable = ['cnpj', 'legal_name', 'trade_name', 'tax_regime', 'state', 'municipality', 'state_registration'];

    protected function casts(): array
    {
        return ['tax_regime' => TaxRegime::class, 'state' => State::class];
    }

    /** @return BelongsToMany<User, $this> */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class)->withPivot('role')->withTimestamps();
    }

    /** @param Builder<Company> $query
     * @return Builder<Company>
     */
    public function scopeAccessibleTo(Builder $query, User $user): Builder
    {
        return $query->whereHas('users', fn (Builder $users) => $users->where('users.id', $user->id));
    }
}
