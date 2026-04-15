<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Developer extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'specialization',
    ];

    /**
     * Normalize the developer name before storage.
     */
    public function setNameAttribute(string $value): void
    {
        $this->attributes['name'] = trim($value);
    }

    /**
     * Normalize the developer email before storage.
     */
    public function setEmailAttribute(string $value): void
    {
        $this->attributes['email'] = Str::lower(trim($value));
    }

    /**
     * Normalize the developer specialization before storage.
     */
    public function setSpecializationAttribute(string $value): void
    {
        $this->attributes['specialization'] = Str::lower(trim($value));
    }
}
