<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('establishments', function (Blueprint $t) {
            $t->id();
            $t->foreignId('company_id')->constrained()->cascadeOnDelete();
            $t->string('type', 10);
            $t->string('cnpj', 14)->unique();
            $t->string('state', 2);
            $t->string('municipality')->nullable();
            $t->string('state_registration', 30)->nullable();
            $t->string('taxpayer_status', 30);
            $t->timestamps();
        });
        Schema::create('products', function (Blueprint $t) {
            $t->id();
            $t->foreignId('company_id')->constrained()->restrictOnDelete();
            $t->string('description');
            $t->string('ean', 14)->nullable()->index();
            $t->string('internal_code', 100)->nullable();
            $t->string('ncm_code', 8);
            $t->foreign('ncm_code')->references('code')->on('ncms')->restrictOnDelete();
            $t->string('classification_status', 10)->default('sugerida');
            $t->foreignId('confirmed_by')->nullable()->constrained('users')->restrictOnDelete();
            $t->timestamp('confirmed_at')->nullable();
            $t->timestamps();
            $t->index(['company_id', 'ncm_code']);
        });
        Schema::create('product_ncm_changes', function (Blueprint $t) {
            $t->id();
            $t->foreignId('product_id')->constrained()->restrictOnDelete();
            $t->string('old_ncm_code', 8)->nullable();
            $t->string('new_ncm_code', 8);
            $t->foreignId('changed_by')->constrained('users')->restrictOnDelete();
            $t->timestamp('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_ncm_changes');
        Schema::dropIfExists('products');
        Schema::dropIfExists('establishments');
    }
};
