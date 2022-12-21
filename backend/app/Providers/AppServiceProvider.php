<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Laravel\Passport\Passport;
class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    protected $policies = [
        'App\Models\Model' => 'App\Policies\ModelPolicy', //uncomment
    ];

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        
    }
}
