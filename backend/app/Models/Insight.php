<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Insight extends Model
{
    protected $table = 'insights';

    protected $casts = [
        'payload' => 'array',
        'timestamp' => 'datetime',
    ];

    protected $fillable = [
        'type',
        'severity',
        'payload',
        'timestamp',
    ];
}
