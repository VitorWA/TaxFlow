<?php

namespace Database\Factories;

use App\Domain\Enums\TaxRegime;
use App\Models\Company;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Company> */
class CompanyFactory extends Factory
{
    public function definition(): array
    {
        $cnpj = (string) fake()->unique()->numberBetween(10000000, 99999999).'0001';
        foreach ([[5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2], [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]] as $weights) {
            $sum = 0;
            foreach ($weights as $position => $weight) {
                $sum += (int) $cnpj[$position] * $weight;
            }
            $remainder = $sum % 11;
            $cnpj .= $remainder < 2 ? '0' : (string) (11 - $remainder);
        }

        return [
            'cnpj' => $cnpj,
            'legal_name' => fake()->company(),
            'tax_regime' => TaxRegime::from('simples_nacional'),
        ];
    }
}
