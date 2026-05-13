<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        try {
            Schema::ensureVectorExtensionExists();
        } catch (\Exception $e) {
            // Ignore error so sqlite or postgres without pgvector installed
            // don't completely crash if Laravel handles it gracefully.
        }

        Schema::create('feature_embeddings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('feature_shipment_id')->constrained('feature_shipments')->cascadeOnDelete();
            $table->text('feature_description');
            $table->vector('embedding', dimensions: 3072)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('feature_embeddings');
    }
};
