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
        try {
            Schema::ensureVectorExtensionExists();
        } catch (\Exception $e) {
            // Ignore extension check errors for database drivers (like sqlite)
            // that do not support vector features natively.
        }

        Schema::create('client_complaint_embeddings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_complaint_id')->unique()->constrained()->cascadeOnDelete();
            if (DB::connection()->getDriverName() === 'pgsql') {
                $table->vector('embedding', dimensions: 3072)->nullable();
            } else {
                $table->text('embedding')->nullable();
            }
            $table->timestamp('created_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('client_complaint_embeddings');
    }
};
