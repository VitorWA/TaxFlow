<?php

namespace Database\Factories;

use App\Models\Ncm;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Ncm> */
class NcmFactory extends Factory
{
    public function definition(): array
    {
        return ['code' => (string) fake()->unique()->numberBetween(10000000, 99999999), 'description' => 'NCM de teste', 'valid_from' => '2020-01-01', 'valid_until' => '9999-12-31', 'legal_act' => 'Fixture de teste', 'source' => 'fixture', 'imported_at' => now(), 'in_current_table' => true];
    }
}
