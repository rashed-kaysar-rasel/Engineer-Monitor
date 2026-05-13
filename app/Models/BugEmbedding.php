<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BugEmbedding extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'bug_id',
        'embedding',
    ];

    protected $casts = [
        'embedding' => 'array',
        'created_at' => 'datetime',
    ];

    public function bug(): BelongsTo
    {
        return $this->belongsTo(Bug::class);
    }
}
