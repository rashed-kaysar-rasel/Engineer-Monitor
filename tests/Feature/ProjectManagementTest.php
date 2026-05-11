<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->adminRole = Role::factory()->create(['slug' => 'admin']);
        $this->techleadRole = Role::factory()->create(['slug' => 'tech-lead']);
        $this->userRole = Role::factory()->create(['slug' => 'user']);
    }

    public function test_admin_can_update_project(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole($this->adminRole);

        $project = Project::factory()->create([
            'creator_id' => $admin->id,
            'project_lead_id' => $admin->id,
        ]);

        $response = $this->actingAs($admin)->put("/projects/{$project->id}", [
            'title' => 'Updated Title',
            'description' => 'Updated Description',
            'status' => 'completed',
            'project_lead_id' => $admin->id,
        ]);

        $response->assertRedirect('/projects');
        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'title' => 'Updated Title',
            'status' => 'completed',
        ]);
    }

    public function test_techlead_can_delete_project(): void
    {
        $techlead = User::factory()->create();
        $techlead->assignRole($this->techleadRole);

        $project = Project::factory()->create([
            'creator_id' => $techlead->id,
            'project_lead_id' => $techlead->id,
        ]);

        $response = $this->actingAs($techlead)->delete("/projects/{$project->id}");

        $response->assertRedirect('/projects');
        $this->assertDatabaseMissing('projects', [
            'id' => $project->id,
        ]);
    }
}
