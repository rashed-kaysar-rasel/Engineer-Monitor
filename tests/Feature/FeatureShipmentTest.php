<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FeatureShipmentTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected User $techLead;

    protected User $user;

    protected Role $adminRole;

    protected Role $techleadRole;

    protected Role $userRole;

    protected function setUp(): void
    {
        parent::setUp();

        $this->adminRole = Role::factory()->create(['slug' => 'admin']);
        $this->techleadRole = Role::factory()->create(['slug' => 'tech-lead']);
        $this->userRole = Role::factory()->create(['slug' => 'user']);

        $this->admin = User::factory()->create();
        $this->admin->assignRole($this->adminRole);

        $this->techLead = User::factory()->create();
        $this->techLead->assignRole($this->techleadRole);

        $this->user = User::factory()->create();
        $this->user->assignRole($this->userRole);
    }

    public function test_admin_can_view_feature_shipments()
    {
        $response = $this->actingAs($this->admin)->get(route('feature-shipments.index'));
        $response->assertStatus(200);
    }

    public function test_tech_lead_can_view_feature_shipments()
    {
        $response = $this->actingAs($this->techLead)->get(route('feature-shipments.index'));
        $response->assertStatus(200);
    }

    public function test_regular_user_cannot_view_feature_shipments()
    {
        $response = $this->actingAs($this->user)->get(route('feature-shipments.index'));
        $response->assertStatus(403);
    }

    public function test_tech_lead_can_store_feature_shipment()
    {
        $project = Project::factory()->create();

        $developer = \App\Models\Developer::factory()->create();

        $payload = [
            'feature_id' => 1234,
            'name' => 'New Awesome Feature',
            'description' => 'A very detailed description of the feature.',
            'shipped_date' => '2026-05-10',
            't_shirt_size' => 'M',
            'approver_id' => $this->admin->id,
            'developer_id' => $developer->id,
            'project_id' => $project->id,
        ];

        $response = $this->actingAs($this->techLead)->post(route('feature-shipments.store'), $payload);

        $response->assertRedirect(route('feature-shipments.index'));

        $this->assertDatabaseHas('feature_shipments', [
            'name' => 'New Awesome Feature',
            't_shirt_size' => 'M',
            'points' => 2,
        ]);
    }

    public function test_tech_lead_can_update_feature_shipment()
    {
        $project = Project::factory()->create();
        $developer = \App\Models\Developer::factory()->create();

        $shipment = \App\Models\FeatureShipment::factory()->create([
            'approver_id' => $this->admin->id,
            'developer_id' => $developer->id,
            'project_id' => $project->id,
            'name' => 'Old Name',
        ]);

        $payload = [
            'feature_id' => $shipment->feature_id,
            'name' => 'Updated Name',
            'description' => $shipment->description,
            'shipped_date' => $shipment->shipped_date->format('Y-m-d'),
            't_shirt_size' => 'XL',
            'approver_id' => $this->admin->id,
            'developer_id' => $developer->id,
            'project_id' => $project->id,
        ];

        $response = $this->actingAs($this->techLead)->put(route('feature-shipments.update', $shipment), $payload);

        $response->assertRedirect(route('feature-shipments.index'));

        $this->assertDatabaseHas('feature_shipments', [
            'id' => $shipment->id,
            'name' => 'Updated Name',
            't_shirt_size' => 'XL',
            'points' => 5,
        ]);
    }

    public function test_tech_lead_can_delete_feature_shipment()
    {
        $project = Project::factory()->create();
        $developer = \App\Models\Developer::factory()->create();

        $shipment = \App\Models\FeatureShipment::factory()->create([
            'approver_id' => $this->admin->id,
            'developer_id' => $developer->id,
            'project_id' => $project->id,
        ]);

        $response = $this->actingAs($this->techLead)->delete(route('feature-shipments.destroy', $shipment));

        $response->assertRedirect(route('feature-shipments.index'));

        $this->assertDatabaseMissing('feature_shipments', [
            'id' => $shipment->id,
        ]);
    }
}
