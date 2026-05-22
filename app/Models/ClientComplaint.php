<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class ClientComplaint extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'client_name',
        'description',
        'impact_level',
        'status',
        'reported_date',
    ];

    protected $casts = [
        'reported_date' => 'date',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function embedding(): HasOne
    {
        return $this->hasOne(ClientComplaintEmbedding::class);
    }
}
