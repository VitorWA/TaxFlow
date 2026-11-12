<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        RateLimiter::for('login', function (Request $request) {
            $limits = [
                Limit::perMinute(30)->by('ip:'.$request->ip()),
            ];
            $email = $request->input('email');
            // FormRequest runs after throttling; malformed values still use the IP limit.
            if (is_string($email)) {
                $limits[] = Limit::perMinute(5)->by('login:'.hash('sha256', strtolower($email).'|'.$request->ip()));
            }

            return $limits;
        });
    }
}
