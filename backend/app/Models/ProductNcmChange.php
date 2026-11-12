<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductNcmChange extends Model
{
    public $timestamps = false;

    protected $guarded = [];

    protected function casts(): array
    {
        return ['created_at' => 'datetime'];
    }
}
