<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Insight;

class InsightController extends Controller
{
    /**
     * Retorna os 5 últimos insights registrados.
     * GET /insights/latest
     */
    public function latestInsights()
    {
        $insights = Insight::orderByDesc('timestamp')
            ->limit(5)
            ->get();

        return response()->json($insights);
    }
}
