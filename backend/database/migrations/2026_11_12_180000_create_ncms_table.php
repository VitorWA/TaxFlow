<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ncm_imports', function (Blueprint $t) {
            $t->unsignedInteger('id')->primary();
            $t->string('checksum', 64);
            $t->text('source');
            $t->string('reference');
            $t->timestamp('imported_at')->nullable();
        });
        Schema::create('ncms', function (Blueprint $t) {
            $t->string('code', 8)->primary();
            $t->text('description');
            $t->date('valid_from');
            $t->date('valid_until');
            $t->text('legal_act');
            $t->text('source');
            $t->timestamp('imported_at');
            $t->boolean('in_current_table')->default(true);
            $t->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ncms');
        Schema::dropIfExists('ncm_imports');
    }
};
