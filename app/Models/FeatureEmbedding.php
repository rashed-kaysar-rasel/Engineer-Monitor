<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FeatureEmbedding extends Model
{
    protected $fillable = [
        'feature_shipment_id',
        'feature_description',
        'embedding',
    ];

    protected function casts(): array
    {
        return [
            'embedding' => 'array',
        ];
    }

    public function featureShipment(): BelongsTo
    {
        return $this->belongsTo(FeatureShipment::class);
    }
}
