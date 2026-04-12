<?php

namespace Tests\Unit\Models;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoleAssignmentTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_user_can_only_have_one_active_role_assignment(): void
    {
        $user = User::factory()->create();
        $admin = Role::factory()->create([
            'name' => 'Admin',
            'slug' => 'admin',
        ]);
        $techLead = Role::factory()->create([
            'name' => 'Tech Lead',
            'slug' => 'tech-lead',
        ]);

        $firstAssignment = $user->assignRole($admin);
        $secondAssignment = $user->assignRole($techLead);

        $this->assertFalse($firstAssignment->fresh()->is_active);
        $this->assertNotNull($firstAssignment->fresh()->revoked_at);
        $this->assertTrue($secondAssignment->fresh()->is_active);
        $this->assertSame('tech-lead', $user->fresh()->activeRole()?->slug);
    }

    public function test_revoked_assignments_do_not_grant_access(): void
    {
        $user = User::factory()->create();
        $role = Role::factory()->create([
            'name' => 'Admin',
            'slug' => 'admin',
        ]);

        $assignment = $user->assignRole($role);
        $assignment->update([
            'is_active' => false,
            'revoked_at' => now(),
        ]);

        $this->assertNull($user->fresh()->activeRole());
    }
}
