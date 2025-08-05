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
        if (!Schema::hasTable('insights')) {
            Schema::create('insights', function (Blueprint $table) {
                $table->id();
                $table->timestampTz('timestamp')->useCurrent();
                $table->string('type', 100);
                $table->string('severity', 50)->nullable();
                $table->json('payload');
                $table->index(['timestamp'], 'idx_insights_timestamp');
            });

            \DB::statement('CREATE INDEX IF NOT EXISTS idx_insights_payload ON insights USING GIN (payload);');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('insights');
    }
};
