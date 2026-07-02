<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('admin','staff_logistic','staff_design','staff_operasional') NOT NULL DEFAULT 'admin'");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('admin','staff_logistic','staff_design') NOT NULL DEFAULT 'admin'");
    }
};
