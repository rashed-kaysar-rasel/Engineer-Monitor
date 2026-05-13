<?php

namespace Tests\Feature;

use App\Models\Bug;
use App\Models\BugEmbedding;
use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BugTrackingTest extends TestCase
{
    use RefreshDatabase;

    protected User $techlead;
    protected Project $project;

    protected function setUp(): void
    {
        parent::setUp();
        $this->techlead = User::factory()->create();
        $this->techlead->assignRole('tech-lead');
        $this->project = Project::factory()->create();
    }

    public function test_techlead_can_view_bugs_index()
    {
        $this->actingAs($this->techlead)
            ->get(route('bugs.index'))
            ->assertStatus(200)
            ->assertInertia(fn ($page) => $page->component('bugs/index'));
    }

    public function test_techlead_can_record_a_bug()
    {
        $data = [
            'project_id' => $this->project->id,
            'impact' => 'high',
            'description' => 'This is a test bug description with more than ten characters.',
            'reported_at' => now()->format('Y-m-d'),
        ];

        $response = $this->actingAs($this->techlead)
            ->post(route('bugs.store'), $data);

        $response->assertRedirect(route('bugs.index'));
        $this->assertDatabaseHas('bugs', [
            'project_id' => $this->project->id,
            'impact' => 'high',
            'status' => 'pending',
        ]);

        $bug = Bug::first();
        $this->assertDatabaseHas('bug_embeddings', [
            'bug_id' => $bug->id,
        ]);
    }

    public function test_techlead_can_resolve_a_bug()
    {
        $bug = Bug::factory()->create([
            'project_id' => $this->project->id,
            'status' => 'pending',
        ]);

        $developer = User::factory()->create();
        $resolvedAt = now()->format('Y-m-d');

        $data = [
            'project_id' => $this->project->id,
            'impact' => $bug->impact,
            'description' => $bug->description,
            'reported_at' => $bug->reported_at->format('Y-m-d'),
            'status' => 'resolved',
            'developer_id' => $developer->id,
            'resolved_at' => $resolvedAt,
        ];

        $response = $this->actingAs($this->techlead)
            ->put(route('bugs.update', $bug), $data);

        $response->assertRedirect(route('bugs.index'));
        $this->assertDatabaseHas('bugs', [
            'id' => $bug->id,
            'status' => 'resolved',
            'developer_id' => $developer->id,
            'resolved_at' => $resolvedAt,
        ]);
    }

    public function test_developer_cannot_manage_bugs()
    {
        $developer = User::factory()->create();
        $developer->assignRole('developer');

        $this->actingAs($developer)
            ->get(route('bugs.index'))
            ->assertStatus(403);

        $this->actingAs($developer)
            ->post(route('bugs.store'), [])
            ->assertStatus(403);
    }
}
