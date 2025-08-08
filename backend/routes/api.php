<?php

use Illuminate\Support\Facades\Route;

// Rota para status de presença do gato na mesa (API)
Route::get('/status/table-presence', [App\Http\Controllers\SensorLogController::class, 'latestPresence']);

// Rota para os últimos insights
Route::get('/insights/latest', [App\Http\Controllers\InsightController::class, 'latestInsights']);

// Rota para comando buzzer
Route::post('/commands/buzzer', [App\Http\Controllers\CommandController::class, 'buzzer']);

// Rota para logs de toxicidade (air_quality)
Route::get('/logs/air-quality', [App\Http\Controllers\SensorLogController::class, 'airQualityLogs']);

// Rota para logs de nível de água
Route::get('/logs/water-level', [App\Http\Controllers\SensorLogController::class, 'waterLevelLogs']);