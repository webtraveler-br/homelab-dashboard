<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('sensor_logs', function (Blueprint $table) {
            $table->id();
            $table->timestampTz('timestamp')->useCurrent();
            $table->string('topic', 255);
            $table->json('payload');
            $table->index(['timestamp'], 'idx_sensor_logs_timestamp');
        });

        \DB::statement('CREATE INDEX IF NOT EXISTS idx_sensor_logs_payload ON sensor_logs USING GIN (payload);');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sensor_logs');
    }
};
