<?php

namespace Tests\Feature\Developers;

use App\Models\Developer;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class DeveloperManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_login_when_visiting_the_developers_page(): void
    {
        $this->get(route('developers.index'))
            ->assertRedirect(route('login'));
    }

    public function test_users_without_an_active_role_are_redirected_to_login_for_developer_management(): void
    {
        $user = User::factory()->withoutApprovedRole()->create();

        $this->actingAs($user)
            ->get(route('developers.index'))
            ->assertRedirect(route('login'))
            ->assertSessionHasErrors([
                'email' => 'Your access has been revoked. Please contact an administrator.',
            ]);
    }

    public function test_tech_leads_can_view_the_developer_management_page_with_empty_state_data(): void
    {
        $user = User::factory()->techLead()->create();

        $this->actingAs($user)
            ->get(route('developers.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('developers/index')
                ->where('can.create', true)
                ->where('can.update', true)
                ->where('can.delete', true)
                ->has('developers.data', 0)
                ->where('developers.meta.total', 0),
            );
    }

    public function test_tech_leads_can_create_developers_with_trimmed_and_normalized_values(): void
    {
        $user = User::factory()->techLead()->create();

        $this->actingAs($user)
            ->post(route('developers.store'), [
                'name' => '  Ada Lovelace  ',
                'email' => '  ADA@example.com  ',
                'specialization' => 'Frontend',
            ])
            ->assertRedirect(route('developers.index'))
            ->assertSessionHasNoErrors();

        $this->assertDatabaseHas('developers', [
            'name' => 'Ada Lovelace',
            'email' => 'ada@example.com',
            'specialization' => 'frontend',
        ]);
    }

    public function test_duplicate_email_addresses_are_rejected_when_creating_developers(): void
    {
        $user = User::factory()->techLead()->create();
        Developer::factory()->create([
            'email' => 'grace@example.com',
        ]);

        $this->actingAs($user)
            ->from(route('developers.index'))
            ->post(route('developers.store'), [
                'name' => 'Grace Hopper',
                'email' => 'grace@example.com',
                'specialization' => 'backend',
            ])
            ->assertRedirect(route('developers.index'))
            ->assertSessionHasErrors('email');
    }

    public function test_invalid_specialization_is_rejected_when_creating_a_developer(): void
    {
        $user = User::factory()->techLead()->create();

        $this->actingAs($user)
            ->from(route('developers.index'))
            ->post(route('developers.store'), [
                'name' => 'Invalid Specialist',
                'email' => 'invalid@example.com',
                'specialization' => 'mobile',
            ])
            ->assertRedirect(route('developers.index'))
            ->assertSessionHasErrors('specialization');
    }

    public function test_admins_inherit_create_update_and_delete_access(): void
    {
        $user = User::factory()->admin()->create();
        $existing = Developer::factory()->create([
            'name' => 'Existing Developer',
            'email' => 'existing@example.com',
            'specialization' => 'frontend',
        ]);

        $this->actingAs($user)
            ->post(route('developers.store'), [
                'name' => 'Admin Created',
                'email' => 'admin-created@example.com',
                'specialization' => 'backend',
            ])
            ->assertRedirect(route('developers.index'));

        $this->actingAs($user)
            ->patch(route('developers.update', $existing), [
                'name' => 'Existing Updated',
                'email' => 'existing-updated@example.com',
                'specialization' => 'fullstack',
            ])
            ->assertRedirect();

        $created = Developer::query()->where('email', 'admin-created@example.com')->firstOrFail();

        $this->actingAs($user)
            ->delete(route('developers.destroy', $created))
            ->assertRedirect();

        $this->assertDatabaseHas('developers', [
            'id' => $existing->id,
            'name' => 'Existing Updated',
            'email' => 'existing-updated@example.com',
            'specialization' => 'fullstack',
        ]);
        $this->assertDatabaseMissing('developers', [
            'id' => $created->id,
        ]);
    }

    public function test_index_returns_paginated_developer_directory_data(): void
    {
        $user = User::factory()->techLead()->create();
        Developer::factory()->count(12)->create();

        $this->actingAs($user)
            ->get(route('developers.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('developers/index')
                ->has('developers.data', 10)
                ->where('developers.meta.current_page', 1)
                ->where('developers.meta.last_page', 2)
                ->where('developers.meta.total', 12)
                ->where('developers.meta.per_page', 10),
            );
    }

    public function test_tech_leads_can_update_existing_developers(): void
    {
        $user = User::factory()->techLead()->create();
        $developer = Developer::factory()->create([
            'email' => 'before@example.com',
            'specialization' => 'frontend',
        ]);

        $this->actingAs($user)
            ->patch(route('developers.update', $developer), [
                'name' => 'Updated Developer',
                'email' => 'After@example.com',
                'specialization' => 'backend',
            ])
            ->assertSessionHasNoErrors()
            ->assertRedirect();

        $this->assertDatabaseHas('developers', [
            'id' => $developer->id,
            'name' => 'Updated Developer',
            'email' => 'after@example.com',
            'specialization' => 'backend',
        ]);
    }

    public function test_duplicate_email_addresses_are_rejected_when_updating_developers(): void
    {
        $user = User::factory()->techLead()->create();
        $target = Developer::factory()->create([
            'email' => 'target@example.com',
        ]);
        Developer::factory()->create([
            'email' => 'taken@example.com',
        ]);

        $this->actingAs($user)
            ->from(route('developers.index'))
            ->patch(route('developers.update', $target), [
                'name' => 'Target Developer',
                'email' => 'taken@example.com',
                'specialization' => 'backend',
            ])
            ->assertRedirect(route('developers.index'))
            ->assertSessionHasErrors('email');
    }

    public function test_tech_leads_can_delete_developers(): void
    {
        $user = User::factory()->techLead()->create();
        $developer = Developer::factory()->create();

        $this->actingAs($user)
            ->delete(route('developers.destroy', $developer))
            ->assertRedirect();

        $this->assertDatabaseMissing('developers', [
            'id' => $developer->id,
        ]);
    }

    public function test_missing_developer_records_return_not_found_for_delete_requests(): void
    {
        $user = User::factory()->techLead()->create();

        $this->actingAs($user)
            ->delete(route('developers.destroy', 999999))
            ->assertNotFound();
    }
}
