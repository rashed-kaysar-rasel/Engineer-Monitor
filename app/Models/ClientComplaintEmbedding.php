<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ClientComplaintEmbedding extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'client_complaint_id',
        'embedding',
    ];

    protected $casts = [
        'embedding' => 'array',
        'created_at' => 'datetime',
    ];

    public function clientComplaint(): BelongsTo
    {
        return $this->belongsTo(ClientComplaint::class);
    }
}
