<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RoleAssignment extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'role_id',
        'is_active',
        'assigned_at',
        'revoked_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'assigned_at' => 'datetime',
            'revoked_at' => 'datetime',
        ];
    }

    /**
     * Boot the model.
     */
    protected static function booted(): void
    {
        static::saving(function (self $assignment): void {
            if (! $assignment->assigned_at) {
                $assignment->assigned_at = now();
            }

            if (! $assignment->is_active && ! $assignment->revoked_at) {
                $assignment->revoked_at = now();
            }

            if ($assignment->is_active) {
                $assignment->revoked_at = null;
            }
        });

        static::saved(function (self $assignment): void {
            if (! $assignment->is_active || $assignment->revoked_at !== null) {
                return;
            }

            static::query()
                ->where('user_id', $assignment->user_id)
                ->whereKeyNot($assignment->getKey())
                ->where('is_active', true)
                ->whereNull('revoked_at')
                ->update([
                    'is_active' => false,
                    'revoked_at' => $assignment->assigned_at ?? now(),
                    'updated_at' => now(),
                ]);
        });
    }

    /**
     * Get the user that owns the role assignment.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the assigned role.
     */
    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }
}
