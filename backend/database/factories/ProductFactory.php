<?php

namespace Database\Factories;

use App\Models\Company;
use App\Models\Ncm;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Product> */
class ProductFactory extends Factory
{
    public function definition(): array
    {
        return ['company_id' => Company::factory(), 'description' => fake()->words(3, true), 'ean' => null, 'internal_code' => null, 'ncm_code' => Ncm::factory()];
    }
}
