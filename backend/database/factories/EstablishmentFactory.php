<?php

namespace Database\Factories;

use App\Models\Company;
use App\Models\Establishment;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Establishment> */
class EstablishmentFactory extends Factory
{
    public function definition(): array
    {
        return ['company_id' => Company::factory(), 'type' => 'matriz', 'cnpj' => fn (array $attributes) => Company::findOrFail($attributes['company_id'])->cnpj, 'state' => 'MT', 'municipality' => 'Cuiabá', 'state_registration' => null, 'taxpayer_status' => 'contribuinte'];
    }
}
