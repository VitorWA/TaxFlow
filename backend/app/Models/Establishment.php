<?php

namespace App\Models;

use App\Domain\Enums\EstablishmentType;
use App\Domain\Enums\State;
use App\Domain\Enums\TaxpayerStatus;
use App\Models\Concerns\BelongsToCompany;
use Database\Factories\EstablishmentFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Establishment extends Model
{
    use BelongsToCompany;

    /** @use HasFactory<EstablishmentFactory> */
    use HasFactory;

    protected $fillable = ['company_id', 'type', 'cnpj', 'state', 'municipality', 'state_registration', 'taxpayer_status'];

    protected function casts(): array
    {
        return ['state' => State::class, 'type' => EstablishmentType::class, 'taxpayer_status' => TaxpayerStatus::class];
    }
}
