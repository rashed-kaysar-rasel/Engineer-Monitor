<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectCreationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->adminRole = Role::factory()->create(['slug' => 'admin']);
        $this->techleadRole = Role::factory()->create(['slug' => 'tech-lead']);
        $this->userRole = Role::factory()->create(['slug' => 'user']);
    }

    public function test_admin_can_view_project_creation_page(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole($this->adminRole);

        $response = $this->actingAs($admin)->get('/projects');

        $response->assertStatus(200);
    }

    public function test_techlead_can_view_project_creation_page(): void
    {
        $techlead = User::factory()->create();
        $techlead->assignRole($this->techleadRole);

        $response = $this->actingAs($techlead)->get('/projects');

        $response->assertStatus(200);
    }

    public function test_regular_user_cannot_view_project_creation_page(): void
    {
        $user = User::factory()->create();
        $user->assignRole($this->userRole);

        $response = $this->actingAs($user)->get('/projects');

        $response->assertStatus(403);
    }

    public function test_techlead_can_create_project(): void
    {
        $techlead = User::factory()->create();
        $techlead->assignRole($this->techleadRole);
        $leadUser = User::factory()->create();

        $response = $this->actingAs($techlead)->post('/projects', [
            'title' => 'New Project',
            'description' => 'Project Description',
            'status' => 'active',
            'project_lead_id' => $leadUser->id,
        ]);

        $response->assertRedirect('/projects');
        $this->assertDatabaseHas('projects', [
            'title' => 'New Project',
            'creator_id' => $techlead->id,
            'project_lead_id' => $leadUser->id,
        ]);
    }
}
