<?php

use App\Models\Company;
use App\Models\User;
use Illuminate\Contracts\Console\Kernel;
use Illuminate\Support\Facades\Hash;

// Fixtures exclusivamente para o ambiente docker-compose.postman.yml.
require __DIR__.'/../../vendor/autoload.php';
$app = require __DIR__.'/../../bootstrap/app.php';
$app->make(Kernel::class)->bootstrap();

if (! app()->environment('testing') || config('database.default') !== 'mysql'
    || config('database.connections.mysql.database') !== 'taxflow_postman') {
    throw new RuntimeException('Fixtures permitidas somente em testing/MySQL taxflow_postman.');
}

foreach (['owner', 'member', 'outsider'] as $role) {
    User::updateOrCreate(['email' => $role.'@postman.test'], [
        'name' => 'Postman '.ucfirst($role),
        'password' => Hash::make('postman-test-password'),
    ]);
}
$company = Company::firstOrCreate(['cnpj' => '04252011000110'], [
    'legal_name' => 'Empresa Fixture Postman',
    'tax_regime' => 'lucro_real',
]);
foreach (['owner', 'member'] as $role) {
    $user = User::where('email', $role.'@postman.test')->firstOrFail();
    $company->users()->syncWithoutDetaching([$user->id => ['role' => $role]]);
}
echo 'Fixtures MySQL prontas; company_id='.$company->id.PHP_EOL;
