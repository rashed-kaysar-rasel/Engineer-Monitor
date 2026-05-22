<?php

namespace Tests\Feature;

use App\Models\Bug;
use App\Models\ClientComplaint;
use App\Models\Developer;
use App\Models\FeatureShipment;
use App\Models\Project;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReportControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;
    protected User $techlead;
    protected User $developerUser;
    protected Developer $developerModel;
    protected Project $project;

    protected function setUp(): void
    {
        parent::setUp();

        Role::factory()->create(['slug' => 'admin']);
        Role::factory()->create(['slug' => 'tech-lead']);
        Role::factory()->create(['slug' => 'developer']);

        $this->admin = User::factory()->create();
        $this->admin->assignRole('admin');

        $this->techlead = User::factory()->create();
        $this->techlead->assignRole('tech-lead');

        $this->developerUser = User::factory()->create();
        $this->developerUser->assignRole('developer');

        $this->developerModel = Developer::factory()->create([
            'name' => 'John Doe',
        ]);

        $this->project = Project::factory()->create(['title' => 'Project Alpha']);
    }

    public function test_admin_can_access_reports()
    {
        $response = $this->actingAs($this->admin)
            ->get(route('reports', ['period' => 'monthly']));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('reports/index'));
    }

    public function test_techlead_can_access_reports()
    {
        $response = $this->actingAs($this->techlead)
            ->get(route('reports', ['period' => 'monthly']));

        $response->assertStatus(200);
    }

    public function test_developer_cannot_access_reports()
    {
        $response = $this->actingAs($this->developerUser)
            ->get(route('reports', ['period' => 'monthly']));

        $response->assertStatus(403);
    }

    public function test_reports_show_correct_aggregates_for_single_period()
    {
        // Setup data in May 2026
        Bug::factory()->create([
            'project_id' => $this->project->id,
            'impact' => 'high',
            'status' => 'pending',
            'reported_at' => '2026-05-10',
        ]);

        ClientComplaint::create([
            'project_id' => $this->project->id,
            'client_name' => 'Acme Corp',
            'impact_level' => 'medium',
            'status' => 'pending',
            'description' => 'Test complaint description for reporting.',
            'reported_date' => '2026-05-15',
        ]);

        FeatureShipment::factory()->create([
            'project_id' => $this->project->id,
            'developer_id' => $this->developerModel->id,
            'approver_id' => $this->admin->id,
            'shipped_date' => '2026-05-20',
            'points' => 5,
        ]);

        $response = $this->actingAs($this->techlead)
            ->get(route('reports', [
                'mode' => 'single',
                'period' => 'custom',
                'start_date' => '2026-05-01',
                'end_date' => '2026-05-31',
            ]));

        $response->assertStatus(200);
        $response->assertInertia(function ($page) {
            $metrics = $page->toArray()['props']['metrics'];
            
            $this->assertEquals(1, $metrics['bugs']['period_b']);
            $this->assertEquals(1, $metrics['features']['period_b']);
            $this->assertEquals(1, $metrics['complaints']['period_b']);
            $this->assertEquals(5, $metrics['velocity']['team']['period_b']);
            
            $devVelocity = collect($metrics['velocity']['developers'])->firstWhere('developer_name', 'John Doe');
            $this->assertNotNull($devVelocity);
            $this->assertEquals(5, $devVelocity['period_b_points']);
        });
    }

    public function test_reports_calculate_correct_deltas_in_comparison_mode()
    {
        // Period A (April 2026): 2 bugs, 3 feature points
        Bug::factory()->create([
            'project_id' => $this->project->id,
            'reported_at' => '2026-04-10',
        ]);
        Bug::factory()->create([
            'project_id' => $this->project->id,
            'reported_at' => '2026-04-15',
        ]);
        FeatureShipment::factory()->create([
            'project_id' => $this->project->id,
            'developer_id' => $this->developerModel->id,
            'approver_id' => $this->admin->id,
            'shipped_date' => '2026-04-20',
            'points' => 3,
        ]);

        // Period B (May 2026): 1 bug, 6 feature points
        Bug::factory()->create([
            'project_id' => $this->project->id,
            'reported_at' => '2026-05-10',
        ]);
        FeatureShipment::factory()->create([
            'project_id' => $this->project->id,
            'developer_id' => $this->developerModel->id,
            'approver_id' => $this->admin->id,
            'shipped_date' => '2026-05-20',
            'points' => 6,
        ]);

        $response = $this->actingAs($this->techlead)
            ->get(route('reports', [
                'mode' => 'compare',
                'period' => 'custom',
                'start_date' => '2026-05-01',
                'end_date' => '2026-05-31',
                'compare_start_date' => '2026-04-01',
                'compare_end_date' => '2026-04-30',
            ]));

        $response->assertStatus(200);
        $response->assertInertia(function ($page) {
            $metrics = $page->toArray()['props']['metrics'];
            
            // Bugs: A=2, B=1. Change = -50%. Improved = true (fewer bugs).
            $this->assertEquals(2, $metrics['bugs']['period_a']);
            $this->assertEquals(1, $metrics['bugs']['period_b']);
            $this->assertEquals(-50, $metrics['bugs']['percentage_change']);
            $this->assertTrue($metrics['bugs']['improved']);

            // Features: A=1 shipment, B=1 shipment. Change = 0%.
            $this->assertEquals(0, $metrics['features']['percentage_change']);

            // Velocity: A=3 points, B=6 points. Change = +100%. Improved = true.
            $this->assertEquals(3, $metrics['velocity']['team']['period_a']);
            $this->assertEquals(6, $metrics['velocity']['team']['period_b']);
            $this->assertEquals(100, $metrics['velocity']['team']['percentage_change']);
            $this->assertTrue($metrics['velocity']['team']['improved']);
        });
    }
}
