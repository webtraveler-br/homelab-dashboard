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
        $log = SensorLog::where('topic', 'sensores/nodes/table_presence')
            ->orderByDesc('timestamp')
            ->first();

        $presence = $log && isset($log->payload['presence']) ? $log->payload['presence'] : false;

        return response()->json([
            'status' => $presence ? 'Gato Detectado!' : 'Sem gato',
            'timestamp' => $log ? $log->timestamp : null,
        ]);
    }
}
