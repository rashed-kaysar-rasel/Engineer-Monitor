<?php

namespace Tests\Feature;

use App\Jobs\GenerateFeatureEmbeddingJob;
use App\Models\Project;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EmbeddingGenerationTest extends TestCase
{
    use RefreshDatabase;

    public function test_saving_shipment_generates_embeddings_synchronously()
    {
        \Laravel\Ai\Embeddings::fake([
            [array_fill(0, 3072, 0.1)]
        ]);

        $adminRole = Role::factory()->create(['slug' => 'admin']);
        $admin = User::factory()->create();
        $admin->assignRole($adminRole);
        $project = Project::factory()->create();

        $developer = \App\Models\Developer::factory()->create();

        $payload = [
            'feature_id' => 101,
            'name' => 'Vector search',
            'description' => 'Implement vector search capabilities',
            'shipped_date' => '2026-05-10',
            't_shirt_size' => 'L',
            'approver_id' => $admin->id,
            'developer_id' => $developer->id,
            'project_id' => $project->id,
        ];

        $response = $this->actingAs($admin)->post(route('feature-shipments.store'), $payload);
        $response->assertRedirect(route('feature-shipments.index'));

        \Laravel\Ai\Embeddings::assertGenerated(function (\Laravel\Ai\Prompts\EmbeddingsPrompt $prompt) {
            return str_contains($prompt->inputs[0] ?? '', 'Vector search');
        });
        
        $this->assertDatabaseHas('feature_embeddings', [
            'feature_description' => "Feature: Vector search\nDescription: Implement vector search capabilities"
        ]);
    }

    public function test_job_generates_embeddings()
    {
        \Laravel\Ai\Embeddings::fake([
            [array_fill(0, 3072, 0.1)]
        ]);

        $project = Project::factory()->create();
        $adminRole = Role::factory()->create(['slug' => 'admin']);
        $admin = User::factory()->create();
        $admin->assignRole($adminRole);

        $developer = \App\Models\Developer::factory()->create();

        $shipment = \App\Models\FeatureShipment::factory()->create([
            'project_id' => $project->id,
            'approver_id' => $admin->id,
            'developer_id' => $developer->id,
            'name' => 'Test Feature',
            'description' => 'Test Desc'
        ]);

        $job = new GenerateFeatureEmbeddingJob($shipment);
        $job->handle();

        $this->assertDatabaseHas('feature_embeddings', [
            'feature_shipment_id' => $shipment->id,
            'feature_description' => "Feature: Test Feature\nDescription: Test Desc"
        ]);
        
        \Laravel\Ai\Embeddings::assertGenerated(function (\Laravel\Ai\Prompts\EmbeddingsPrompt $prompt) {
            return str_contains($prompt->inputs[0] ?? '', 'Test Feature');
        });
    }
}
