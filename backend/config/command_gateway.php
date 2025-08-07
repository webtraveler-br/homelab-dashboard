<?php

return [
    'host' => env('COMMAND_GATEWAY_HOST', 'command_gateway'),
    'port' => env('COMMAND_GATEWAY_PORT', '5000'),
    'url'  => 'http://' . env('COMMAND_GATEWAY_HOST', 'command_gateway') . ':' . env('COMMAND_GATEWAY_PORT', '5000'),
];
