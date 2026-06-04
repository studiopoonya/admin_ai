<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_databases', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('type', 20)->default('grid');
            $table->timestamps();
        });

        Schema::create('db_columns', function (Blueprint $table) {
            $table->id();
            $table->foreignId('database_id')->constrained('user_databases')->cascadeOnDelete();
            $table->string('col_key', 50);   // used as JSON key in db_rows.data
            $table->string('label');
            $table->string('type', 30)->default('text');
            $table->json('options')->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('db_rows', function (Blueprint $table) {
            $table->id();
            $table->foreignId('database_id')->constrained('user_databases')->cascadeOnDelete();
            $table->json('data')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('db_rows');
        Schema::dropIfExists('db_columns');
        Schema::dropIfExists('user_databases');
    }
};
