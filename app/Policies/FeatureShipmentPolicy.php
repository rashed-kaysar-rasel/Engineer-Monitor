<?php

namespace App\Policies;

use App\Models\FeatureShipment;
use App\Models\User;

class FeatureShipmentPolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->activeRole()?->slug, ['admin', 'tech-lead']);
    }

    public function view(User $user, FeatureShipment $featureShipment): bool
    {
        return in_array($user->activeRole()?->slug, ['admin', 'tech-lead']);
    }

    public function create(User $user): bool
    {
        return in_array($user->activeRole()?->slug, ['admin', 'tech-lead']);
    }

    public function update(User $user, FeatureShipment $featureShipment): bool
    {
        return in_array($user->activeRole()?->slug, ['admin', 'tech-lead']);
    }

    public function delete(User $user, FeatureShipment $featureShipment): bool
    {
        return in_array($user->activeRole()?->slug, ['admin', 'tech-lead']);
    }
}
