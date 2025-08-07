<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class CommandController extends Controller
{
    // Envia POST para API flask de comandos (ativa buzzer)
    public function buzzer(Request $request)
    {
        $gatewayUrl = config('command_gateway.url') . '/commands/buzzer';
        try {
            $response = Http::post($gatewayUrl);
            if ($response->successful()) {
                return response()->json(['status' => 'Comando enviado'], 200);
            } else {
                return response()->json(['status' => 'Falha ao enviar comando'], 500);
            }
        } catch (\Exception $e) {
            return response()->json(['status' => 'Erro ao enviar comando', 'error' => $e->getMessage()], 500);
        }
    }
}
