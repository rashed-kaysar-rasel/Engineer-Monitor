<?php

namespace App\Policies;

use App\Models\Developer;
use App\Models\User;

class DeveloperPolicy
{
    /**
     * Determine whether the user can view any developers.
     */
    public function viewAny(User $user): bool
    {
        return $this->canManageDevelopers($user);
    }

    /**
     * Determine whether the user can create developers.
     */
    public function create(User $user): bool
    {
        return $this->canManageDevelopers($user);
    }

    /**
     * Determine whether the user can update the developer.
     */
    public function update(User $user, Developer $developer): bool
    {
        return $this->canManageDevelopers($user);
    }

    /**
     * Determine whether the user can delete the developer.
     */
    public function delete(User $user, Developer $developer): bool
    {
        return $this->canManageDevelopers($user);
    }

    /**
     * Determine whether the user can manage developer records.
     */
    protected function canManageDevelopers(User $user): bool
    {
        return $user->hasRole('admin') || $user->hasRole('tech-lead');
    }
}
