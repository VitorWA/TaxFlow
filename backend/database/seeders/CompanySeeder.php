<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\User;
use Illuminate\Database\Seeder;

class CompanySeeder extends Seeder
{
    public function run(): void
    {
        if (! app()->environment(['local', 'testing'])) {
            return;
        }

        $user = User::where('email', 'test@example.com')->first();
        if (! $user) {
            return;
        }

        $company = Company::firstOrCreate(['cnpj' => '11222333000181'], [
            'legal_name' => 'Empresa de Demonstração TaxFlow',
            'tax_regime' => 'simples_nacional',
            'state' => 'MT',
        ]);
        $company->users()->syncWithoutDetaching([$user->id => ['role' => 'owner']]);
    }
}
