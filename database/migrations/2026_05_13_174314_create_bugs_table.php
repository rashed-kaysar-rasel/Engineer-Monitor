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
        Schema::create('bugs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->enum('impact', ['high', 'medium', 'low']);
            $table->enum('status', ['pending', 'resolved'])->default('pending');
            $table->text('description');
            $table->foreignId('developer_id')->nullable()->constrained('developers')->nullOnDelete();
            $table->date('reported_at');
            $table->date('resolved_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bugs', function (Blueprint $table) {
            //
        });
    }
};
