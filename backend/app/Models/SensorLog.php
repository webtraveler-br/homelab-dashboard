<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SensorLog extends Model
{
    protected $table = 'sensor_logs';

    protected $casts = [
        'payload' => 'array',
        'timestamp' => 'datetime',
    ];

    protected $fillable = [
        'topic',
        'payload',
        'timestamp',
    ];
}
