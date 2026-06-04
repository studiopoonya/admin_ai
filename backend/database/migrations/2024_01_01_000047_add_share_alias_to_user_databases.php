<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('user_databases', function (Blueprint $table) {
            $table->string('share_alias', 80)->unique()->nullable()->after('share_token');
        });
    }
    public function down(): void {
        Schema::table('user_databases', function (Blueprint $table) {
            $table->dropColumn('share_alias');
        });
    }
};
