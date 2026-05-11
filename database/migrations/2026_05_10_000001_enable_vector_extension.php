<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Vector extension skipped. Using JSON column for embeddings via Laravel SDK fallback.
    }

    public function down(): void
    {
        // Do nothing
    }
};
