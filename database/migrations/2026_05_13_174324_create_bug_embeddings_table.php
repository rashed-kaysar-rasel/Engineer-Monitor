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
        Schema::create('bug_embeddings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bug_id')->unique()->constrained()->cascadeOnDelete();
            $table->vector('embedding', dimensions: 3072)->nullable();
            $table->timestamp('created_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bug_embeddings', function (Blueprint $table) {
            //
        });
    }
};
