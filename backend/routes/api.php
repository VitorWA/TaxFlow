<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\DomainEnumsController;
use App\Http\Controllers\EstablishmentController;
use App\Http\Controllers\HealthController;
use App\Http\Controllers\NcmController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

Route::get('/health', HealthController::class);

Route::prefix('v1')->group(function () {
    Route::post('/auth/login', [AuthController::class, 'login'])->middleware('throttle:login');
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/ncms', [NcmController::class, 'index']);
        Route::get('/ncms/{ncm}', [NcmController::class, 'show'])->where('ncm', '[0-9]{8}');
        Route::apiResource('companies.establishments', EstablishmentController::class)->only(['index', 'store', 'show', 'update'])->scoped();
        Route::apiResource('products', ProductController::class)->only(['index', 'store', 'show', 'update']);
        Route::post('/products/{product}/confirm-ncm', [ProductController::class, 'confirm']);
        Route::get('/products/{product}/ncm-history', [ProductController::class, 'history']);
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/domain/enums', DomainEnumsController::class);
        Route::apiResource('companies', CompanyController::class)->only(['index', 'store', 'show', 'update']);
    });
});
