<?php

namespace App\Services\Auth;

use App\Models\RoleAssignment;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class RoleAccessService
{
    /**
     * Attempt to authenticate a user and enforce active-role access.
     */
    public function attemptLogin(string $email, string $password): ?User
    {
        $normalizedEmail = Str::lower(trim($email));

        $user = User::query()
            ->with([
                'activeRoleAssignment.role',
            ])
            ->where('email', $normalizedEmail)
            ->first();

        if (! $user || ! Hash::check($password, $user->password)) {
            return null;
        }

        if (! $this->hasActiveApprovedRole($user)) {
            throw ValidationException::withMessages([
                'email' => __('Your account is not authorized for this application.'),
            ]);
        }

        return $user;
    }

    /**
     * Determine whether the user has an active approved role.
     */
    public function hasActiveApprovedRole(?User $user): bool
    {
        if (! $user) {
            return false;
        }

        $assignment = $this->activeAssignment($user);

        return $assignment !== null
            && $assignment->role !== null
            && $assignment->role->is_active;
    }

    /**
     * Get the active role assignment for the user.
     */
    public function activeAssignment(User $user): ?RoleAssignment
    {
        $user->loadMissing('activeRoleAssignment.role');

        return $user->activeRoleAssignment;
    }
}
