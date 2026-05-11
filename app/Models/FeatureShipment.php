<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class FeatureShipment extends Model
{
    use HasFactory;

    protected $fillable = [
        'feature_id',
        'name',
        'description',
        'shipped_date',
        't_shirt_size',
        'points',
        'approver_id',
        'developer_id',
        'project_id',
    ];

    protected function casts(): array
    {
        return [
            'shipped_date' => 'date',
            'feature_id' => 'integer',
            'points' => 'integer',
        ];
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approver_id');
    }

    public function developer(): BelongsTo
    {
        return $this->belongsTo(Developer::class, 'developer_id');
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function featureEmbedding(): HasOne
    {
        return $this->hasOne(FeatureEmbedding::class);
    }
}
