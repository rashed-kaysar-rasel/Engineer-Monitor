<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('feature_shipments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('feature_id');
            $table->string('name');
            $table->text('description');
            $table->date('shipped_date');
            $table->string('t_shirt_size');
            $table->integer('points');
            $table->foreignId('approver_id')->constrained('users');
            $table->foreignId('developer_id')->constrained('developers');
            $table->foreignId('project_id')->constrained('projects');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('feature_shipments');
    }
};
