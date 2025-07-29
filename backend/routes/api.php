<?php

use Illuminate\Support\Facades\Route;

// Rota para status de presença do gato na mesa (API)
Route::get('/status/table-presence', [App\Http\Controllers\SensorLogController::class, 'latestPresence']);
