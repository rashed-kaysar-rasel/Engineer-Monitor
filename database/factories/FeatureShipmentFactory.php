<?php

namespace Database\Factories;

use App\Models\FeatureShipment;
use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class FeatureShipmentFactory extends Factory
{
    protected $model = FeatureShipment::class;

    public function definition(): array
    {
        $sizes = ['S' => 1, 'M' => 2, 'L' => 3, 'XL' => 5, 'XXL' => 7, 'XXXL' => 8];
        $size = $this->faker->randomElement(array_keys($sizes));

        return [
            'feature_id' => $this->faker->randomNumber(4),
            'name' => $this->faker->sentence(3),
            'description' => $this->faker->paragraph(),
            'shipped_date' => $this->faker->date(),
            't_shirt_size' => $size,
            'points' => $sizes[$size],
            'approver_id' => User::factory(),
            'developer_id' => \App\Models\Developer::factory(),
            'project_id' => Project::factory(),
        ];
    }
}
