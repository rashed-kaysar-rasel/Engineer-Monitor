<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\DB;
use Laravel\Fortify\TwoFactorAuthenticatable;

#[Fillable(['name', 'email', 'password'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    /**
     * Get all role assignments for the user.
     */
    public function roleAssignments(): HasMany
    {
        return $this->hasMany(RoleAssignment::class);
    }

    /**
     * Get the active role assignment for the user.
     */
    public function activeRoleAssignment(): HasOne
    {
        return $this->hasOne(RoleAssignment::class)
            ->where('is_active', true)
            ->whereNull('revoked_at')
            ->latestOfMany('assigned_at');
    }

    /**
     * Assign a role to the user as the active role.
     */
    public function assignRole(Role|string $role): RoleAssignment
    {
        $resolvedRole = $role instanceof Role
            ? $role
            : Role::query()->firstWhere('slug', $role);

        if (! $resolvedRole) {
            throw new \InvalidArgumentException('Role could not be resolved.');
        }

        return DB::transaction(function () use ($resolvedRole): RoleAssignment {
            $this->activeRoleAssignment()?->update([
                'is_active' => false,
                'revoked_at' => now(),
            ]);

            return $this->roleAssignments()->create([
                'role_id' => $resolvedRole->getKey(),
                'is_active' => true,
                'assigned_at' => now(),
            ]);
        });
    }

    /**
     * Revoke the user's active role assignment.
     */
    public function revokeActiveRole(): void
    {
        $this->activeRoleAssignment()?->update([
            'is_active' => false,
            'revoked_at' => now(),
        ]);
    }

    /**
     * Determine whether the user has an approved role.
     */
    public function hasApprovedAccess(): bool
    {
        return $this->activeRole() !== null;
    }

    /**
     * Determine whether the user has the given role.
     */
    public function hasRole(string $slug): bool
    {
        return $this->activeRole()?->slug === $slug;
    }

    /**
     * Get the active role for the user.
     */
    public function activeRole(): ?Role
    {
        $this->loadMissing('activeRoleAssignment.role');

        return $this->activeRoleAssignment?->role;
    }

    /**
     * Get the projects where the user is the project lead.
     */
    public function leadProjects(): HasMany
    {
        return $this->hasMany(Project::class, 'project_lead_id');
    }

    /**
     * Get the projects created by the user.
     */
    public function createdProjects(): HasMany
    {
        return $this->hasMany(Project::class, 'creator_id');
    }
}
