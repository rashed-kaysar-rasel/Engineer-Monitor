<?php

namespace Database\Factories;

use App\Models\Developer;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Developer>
 */
class DeveloperFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<Developer>
     */
    protected $model = Developer::class;

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
            'specialization' => fake()->randomElement([
                'frontend',
                'backend',
                'fullstack',
            ]),
        ];
    }

    public function frontend(): static
    {
        return $this->state(fn () => ['specialization' => 'frontend']);
    }

    public function backend(): static
    {
        return $this->state(fn () => ['specialization' => 'backend']);
    }

    public function fullstack(): static
    {
        return $this->state(fn () => ['specialization' => 'fullstack']);
    }
}
