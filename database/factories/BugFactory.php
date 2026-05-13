<?php

namespace Database\Factories;

use App\Models\Bug;
use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Bug>
 */
class BugFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $status = $this->faker->randomElement(['pending', 'resolved']);
        $reportedAt = $this->faker->dateTimeBetween('-1 month', 'now');
        
        return [
            'project_id' => Project::factory(),
            'impact' => $this->faker->randomElement(['high', 'medium', 'low']),
            'status' => $status,
            'description' => $this->faker->paragraph(),
            'developer_id' => $status === 'resolved' ? \App\Models\Developer::factory() : null,
            'reported_at' => $reportedAt,
            'resolved_at' => $status === 'resolved' ? $this->faker->dateTimeBetween($reportedAt, 'now') : null,
        ];
    }
}
