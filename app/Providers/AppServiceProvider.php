<?php

namespace App\Providers;

use App\Models\Developer;
use App\Models\User;
use App\Policies\DeveloperPolicy;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

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
        $this->configureDefaults();

        if (!config('ai.verify_ssl', true)) {
            \Illuminate\Support\Facades\Http::globalOptions([
                'verify' => false,
            ]);
        }
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Gate::policy(Developer::class, DeveloperPolicy::class);
        Gate::policy(\App\Models\ClientComplaint::class, \App\Policies\ClientComplaintPolicy::class);
        Gate::define('access-admin-area', fn (User $user): bool => $user->hasRole('admin'));
        Gate::define('access-tech-lead-area', fn (User $user): bool => $user->hasRole('tech-lead'));
        Gate::define('view-reports', fn (User $user): bool => (new \App\Policies\ReportPolicy)->viewAny($user));

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
