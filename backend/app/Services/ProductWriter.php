<?php

namespace App\Services;

use App\Domain\Enums\ClassificationStatus;
use App\Models\Ncm;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ProductWriter
{
    public function write(array $data, User $user, ?Product $product = null): Product
    {
        return DB::transaction(function () use ($data, $user, $product) {
            $current = $product ? Product::whereKey($product->id)->lockForUpdate()->firstOrFail() : new Product;
            $old = $current->ncm_code;
            $code = $data['ncm_code'] ?? $old;
            $this->validNcm($code);
            $current->fill($data);
            if (! $current->exists || $old !== $code) {
                $current->classification_status = ClassificationStatus::Sugerida;
                $current->confirmed_by = null;
                $current->confirmed_at = null;
            }
            $current->save();
            if ($old !== $code) {
                $current->ncmChanges()->create(['old_ncm_code' => $old, 'new_ncm_code' => $code, 'changed_by' => $user->id, 'created_at' => now()]);
            }

            return $current->load('ncm');
        }, 3);
    }

    public function confirm(Product $product, User $user): Product
    {
        return DB::transaction(function () use ($product, $user) {
            $current = Product::whereKey($product->id)->lockForUpdate()->firstOrFail();
            $this->validNcm($current->ncm_code);
            if ($current->classification_status !== ClassificationStatus::Confirmada) {
                $current->classification_status = ClassificationStatus::Confirmada;
                $current->confirmed_by = $user->id;
                $current->confirmed_at = now();
                $current->save();
            }

            return $current->load('ncm');
        }, 3);
    }

    private function validNcm(string $code): void
    {
        $ncm = Ncm::whereKey($code)->lockForUpdate()->first();
        if (! $ncm || ! $ncm->isCurrent()) {
            throw ValidationException::withMessages(['ncm_code' => 'NCM inexistente ou fora da tabela vigente.']);
        }
    }
}
