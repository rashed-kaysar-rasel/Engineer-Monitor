<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        try {
            DB::statement('CREATE EXTENSION IF NOT EXISTS vector');
        } catch (\Exception $e) {
            // Ignore exception for SQLite or drivers without vector support
        }
    }

    public function down(): void
    {
        // Do nothing
    }
};
