<?php

namespace Tests\Feature;

use App\Models\ClientComplaint;
use App\Models\ClientComplaintEmbedding;
use App\Models\Project;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ClientComplaintTrackingTest extends TestCase
{
    use RefreshDatabase;

    protected User $techlead;
    protected User $developer;
    protected Project $project;

    protected function setUp(): void
    {
        parent::setUp();

        // Fake AI Embeddings API
        \Laravel\Ai\Embeddings::fake([
            [array_fill(0, 3072, 0.1)]
        ]);

        Role::factory()->create(['slug' => 'tech-lead']);
        Role::factory()->create(['slug' => 'developer']);

        $this->techlead = User::factory()->create();
        $this->techlead->assignRole('tech-lead');

        $this->developer = User::factory()->create();
        $this->developer->assignRole('developer');

        $this->project = Project::factory()->create();
    }

    public function test_techlead_can_view_complaints_index()
    {
        $this->actingAs($this->techlead)
            ->get(route('client-complaints.index'))
            ->assertStatus(200)
            ->assertInertia(fn ($page) => $page->component('client-complaints/index'));
    }

    public function test_developer_can_view_complaints_index()
    {
        $this->actingAs($this->developer)
            ->get(route('client-complaints.index'))
            ->assertStatus(200)
            ->assertInertia(fn ($page) => $page->component('client-complaints/index'));
    }

    public function test_techlead_can_record_a_complaint()
    {
        $data = [
            'project_id' => $this->project->id,
            'client_name' => 'Acme Corp',
            'impact_level' => 'high',
            'status' => 'pending',
            'description' => 'This is a test client complaint description with more than ten characters.',
            'reported_date' => now()->format('Y-m-d'),
        ];

        $response = $this->actingAs($this->techlead)
            ->post(route('client-complaints.store'), $data);

        $response->assertRedirect(route('client-complaints.index'));
        $this->assertDatabaseHas('client_complaints', [
            'project_id' => $this->project->id,
            'client_name' => 'Acme Corp',
            'impact_level' => 'high',
            'status' => 'pending',
        ]);

        $complaint = ClientComplaint::first();
        $this->assertDatabaseHas('client_complaint_embeddings', [
            'client_complaint_id' => $complaint->id,
        ]);

        $this->assertNotNull($complaint->embedding->embedding);
        $this->assertCount(3072, $complaint->embedding->embedding);
    }

    public function test_developer_cannot_record_a_complaint()
    {
        $data = [
            'project_id' => $this->project->id,
            'client_name' => 'Acme Corp',
            'impact_level' => 'high',
            'status' => 'pending',
            'description' => 'This is a test client complaint description with more than ten characters.',
            'reported_date' => now()->format('Y-m-d'),
        ];

        $response = $this->actingAs($this->developer)
            ->post(route('client-complaints.store'), $data);

        $response->assertStatus(403);
        $this->assertDatabaseMissing('client_complaints', [
            'client_name' => 'Acme Corp',
        ]);
    }

    public function test_techlead_can_update_a_complaint()
    {
        $complaint = ClientComplaint::create([
            'project_id' => $this->project->id,
            'client_name' => 'Acme Corp',
            'impact_level' => 'medium',
            'status' => 'pending',
            'description' => 'Original description for testing update methods.',
            'reported_date' => now()->format('Y-m-d'),
        ]);

        $data = [
            'project_id' => $this->project->id,
            'client_name' => 'Acme Corp Updated',
            'impact_level' => 'high',
            'status' => 'resolved',
            'description' => 'Updated description that is longer than ten characters.',
            'reported_date' => now()->format('Y-m-d'),
        ];

        $response = $this->actingAs($this->techlead)
            ->put(route('client-complaints.update', $complaint), $data);

        $response->assertRedirect(route('client-complaints.index'));
        $this->assertDatabaseHas('client_complaints', [
            'id' => $complaint->id,
            'client_name' => 'Acme Corp Updated',
            'impact_level' => 'high',
            'status' => 'resolved',
            'description' => 'Updated description that is longer than ten characters.',
        ]);
    }

    public function test_developer_cannot_update_a_complaint()
    {
        $complaint = ClientComplaint::create([
            'project_id' => $this->project->id,
            'client_name' => 'Acme Corp',
            'impact_level' => 'medium',
            'status' => 'pending',
            'description' => 'Original description for testing update methods.',
            'reported_date' => now()->format('Y-m-d'),
        ]);

        $data = [
            'project_id' => $this->project->id,
            'client_name' => 'Acme Corp Updated',
            'impact_level' => 'high',
            'status' => 'resolved',
            'description' => 'Updated description that is longer than ten characters.',
            'reported_date' => now()->format('Y-m-d'),
        ];

        $response = $this->actingAs($this->developer)
            ->put(route('client-complaints.update', $complaint), $data);

        $response->assertStatus(403);
    }

    public function test_techlead_can_delete_a_complaint()
    {
        $complaint = ClientComplaint::create([
            'project_id' => $this->project->id,
            'client_name' => 'Acme Corp To Delete',
            'impact_level' => 'medium',
            'status' => 'pending',
            'description' => 'This description is for testing delete methods.',
            'reported_date' => now()->format('Y-m-d'),
        ]);

        // Create associated embedding
        ClientComplaintEmbedding::create([
            'client_complaint_id' => $complaint->id,
            'embedding' => array_fill(0, 3072, 0.1),
        ]);

        $response = $this->actingAs($this->techlead)
            ->delete(route('client-complaints.destroy', $complaint));

        $response->assertRedirect(route('client-complaints.index'));
        $this->assertDatabaseMissing('client_complaints', [
            'id' => $complaint->id,
        ]);
        $this->assertDatabaseMissing('client_complaint_embeddings', [
            'client_complaint_id' => $complaint->id,
        ]);
    }

    public function test_developer_cannot_delete_a_complaint()
    {
        $complaint = ClientComplaint::create([
            'project_id' => $this->project->id,
            'client_name' => 'Acme Corp',
            'impact_level' => 'medium',
            'status' => 'pending',
            'description' => 'This description is for testing delete methods.',
            'reported_date' => now()->format('Y-m-d'),
        ]);

        $response = $this->actingAs($this->developer)
            ->delete(route('client-complaints.destroy', $complaint));

        $response->assertStatus(403);
        $this->assertDatabaseHas('client_complaints', [
            'id' => $complaint->id,
        ]);
    }
}
