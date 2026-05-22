<?php

namespace App\Policies;

use App\Models\ClientComplaint;
use App\Models\User;

class ClientComplaintPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasRole('admin') || $user->hasRole('tech-lead') || $user->hasRole('developer');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, ClientComplaint $clientComplaint): bool
    {
        return $user->hasRole('admin') || $user->hasRole('tech-lead') || $user->hasRole('developer');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasRole('admin') || $user->hasRole('tech-lead');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, ClientComplaint $clientComplaint): bool
    {
        return $user->hasRole('admin') || $user->hasRole('tech-lead');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, ClientComplaint $clientComplaint): bool
    {
        return $user->hasRole('admin') || $user->hasRole('tech-lead');
    }
}
