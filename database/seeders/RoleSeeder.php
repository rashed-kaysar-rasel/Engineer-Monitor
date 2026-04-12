<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach ($this->roles() as $role) {
            Role::query()->updateOrCreate(
                ['slug' => $role['slug']],
                $role,
            );
        }
    }

    /**
     * Get the approved roles for the application.
     *
     * @return list<array{name: string, slug: string, description: string, is_active: bool}>
     */
    private function roles(): array
    {
        return [
            [
                'name' => 'Admin',
                'slug' => 'admin',
                'description' => 'Full internal administration access.',
                'is_active' => true,
            ],
            [
                'name' => 'Tech Lead',
                'slug' => 'tech-lead',
                'description' => 'Technical leadership access for approved internal users.',
                'is_active' => true,
            ],
        ];
    }
}
