<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(RoleSeeder::class);

        // Create Admin User
        $admin = User::query()->updateOrCreate(
            ['email' => 'admin@dstudio.asia'],
            [
                'name' => 'System Admin',
                'password' => '45625899',
            ]
        );
        $admin->assignRole('admin');

        // Create Tech Lead User
        $techLead = User::query()->updateOrCreate(
            ['email' => 'rashedkaysar321@gmail.com'],
            [
                'name' => 'Rashed Kaysar',
                'password' => '45625899',
            ]
        );
        $techLead->assignRole('tech-lead');

        // Create 10 Developers
        \App\Models\Developer::factory(10)->create();

        // Create 10 Bugs (will also create 10 Projects)
        \App\Models\Bug::factory(10)->create();
    }
}
