<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        if (! app()->environment(['local', 'testing'])) {
            return;
        }
        User::firstOrCreate(['email' => 'test@example.com'], [
            'name' => 'TaxFlow Dev',
            'password' => Hash::make('password'),
        ]);
        $this->call(CompanySeeder::class);
    }
}
