<?php

namespace Database\Factories;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
            'two_factor_secret' => null,
            'two_factor_recovery_codes' => null,
            'two_factor_confirmed_at' => null,
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    /**
     * Indicate that the model has two-factor authentication configured.
     */
    public function withTwoFactor(): static
    {
        return $this->state(fn (array $attributes) => [
            'two_factor_secret' => encrypt('secret'),
            'two_factor_recovery_codes' => encrypt(json_encode(['recovery-code-1'])),
            'two_factor_confirmed_at' => now(),
        ]);
    }

    /**
     * Assign the admin role after creating the user.
     */
    public function admin(): static
    {
        return $this->afterCreating(fn (User $user) => $user->assignRole(
            Role::query()->firstOrCreate(
                ['slug' => 'admin'],
                [
                    'name' => 'Admin',
                    'description' => 'Full internal administration access.',
                    'is_active' => true,
                ],
            ),
        ));
    }

    /**
     * Assign the tech lead role after creating the user.
     */
    public function techLead(): static
    {
        return $this->afterCreating(fn (User $user) => $user->assignRole(
            Role::query()->firstOrCreate(
                ['slug' => 'tech-lead'],
                [
                    'name' => 'Tech Lead',
                    'description' => 'Technical leadership access for approved internal users.',
                    'is_active' => true,
                ],
            ),
        ));
    }

    /**
     * Keep the user without an approved role.
     */
    public function withoutApprovedRole(): static
    {
        return $this;
    }
}
