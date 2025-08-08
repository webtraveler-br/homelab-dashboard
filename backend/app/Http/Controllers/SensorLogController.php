<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\SensorLog;

class SensorLogController extends Controller
{
    /**
     * Retorna o status de presença do gato na mesa, baseado no último log.
     * GET /status/table-presence
     */
    public function latestPresence()
    {
        $log = SensorLog::where('topic', 'sensors/nodes/table_presence')
            ->orderByDesc('timestamp')
            ->first();

        $presence = $log && isset($log->payload['presence']) ? $log->payload['presence'] : false;

        return response()->json([
            'status' => $presence ? 'Gato Detectado!' : 'Sem gato',
            'presence' => (bool) $presence,
            'timestamp' => $log ? $log->timestamp : null,
        ]);
    }

    /**
     * Retorna os logs de toxicidade (air_quality) entre dois períodos.
     * GET /logs/air-quality?start=YYYY-MM-DDTHH:MM:SS&end=YYYY-MM-DDTHH:MM:SS
     */
    public function airQualityLogs(Request $request)
    {
        $validated = $request->validate([
            'start' => ['required', 'date_format:Y-m-d\TH:i:s'],
            'end' => ['required', 'date_format:Y-m-d\TH:i:s'],
        ]);

        $start = $validated['start'];
        $end = $validated['end'];

        $logs = SensorLog::where('topic', 'sensors/nodes/air_quality')
            ->whereBetween('timestamp', [$start, $end])
            ->orderBy('timestamp')
            ->get();

        return response()->json($logs);
    }

    /**
     * Retorna os logs de nível de água (distância em cm) entre dois períodos.
     * GET /logs/water-level?start=YYYY-MM-DDTHH:MM:SS&end=YYYY-MM-DDTHH:MM:SS
     */
    public function waterLevelLogs(Request $request)
    {
        $validated = $request->validate([
            'start' => ['required', 'date_format:Y-m-d\TH:i:s'],
            'end' => ['required', 'date_format:Y-m-d\TH:i:s'],
        ]);

        $start = $validated['start'];
        $end = $validated['end'];

        $logs = SensorLog::where('topic', 'sensors/nodes/water_level')
            ->whereBetween('timestamp', [$start, $end])
            ->orderBy('timestamp')
            ->get();

        return response()->json($logs);
    }
}
