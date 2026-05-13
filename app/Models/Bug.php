<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Bug extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'impact',
        'status',
        'description',
        'developer_id',
        'reported_at',
        'resolved_at',
    ];

    protected $casts = [
        'reported_at' => 'date',
        'resolved_at' => 'date',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function developer(): BelongsTo
    {
        return $this->belongsTo(Developer::class, 'developer_id');
    }

    public function embedding(): HasOne
    {
        return $this->hasOne(BugEmbedding::class);
    }
}
