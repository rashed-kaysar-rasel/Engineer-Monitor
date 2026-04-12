<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_the_login_page()
    {
        $response = $this->get(route('dashboard'));
        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_users_can_visit_the_dashboard()
    {
        $user = User::factory()->admin()->create();
        $this->actingAs($user);

        $this->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('dashboard')
                ->where('auth.user.role.slug', 'admin')
                ->where('auth.user.role.name', 'Admin'),
            );
    }

    public function test_unassigned_authenticated_users_are_redirected_back_to_login(): void
    {
        $user = User::factory()->withoutApprovedRole()->create();

        $response = $this->actingAs($user)->get(route('dashboard'));

        $response
            ->assertRedirect(route('login'))
            ->assertSessionHasErrors([
                'email' => 'Your access has been revoked. Please contact an administrator.',
            ]);

        $this->assertGuest();
    }

    public function test_tech_lead_users_receive_their_role_in_shared_dashboard_props(): void
    {
        $user = User::factory()->techLead()->create();

        $this->actingAs($user)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('dashboard')
                ->where('auth.user.role.slug', 'tech-lead')
                ->where('auth.user.role.name', 'Tech Lead'),
            );
    }
}
