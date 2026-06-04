<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('user_databases', function (Blueprint $table) {
            $table->string('form_color', 80)->nullable()->after('share_alias');
            $table->string('form_icon',  20)->nullable()->after('form_color');
        });
    }
    public function down(): void {
        Schema::table('user_databases', function (Blueprint $table) {
            $table->dropColumn(['form_color', 'form_icon']);
        });
    }
};
