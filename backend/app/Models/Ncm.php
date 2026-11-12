<?php

namespace App\Models;

use Database\Factories\NcmFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/** @property Carbon $valid_from
 * @property Carbon $valid_until
 * @property Carbon $imported_at */
class Ncm extends Model
{
    /** @use HasFactory<NcmFactory> */
    use HasFactory;

    protected $primaryKey = 'code';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $guarded = [];

    protected function casts(): array
    {
        return ['valid_from' => 'date', 'valid_until' => 'date', 'imported_at' => 'datetime', 'in_current_table' => 'boolean'];
    }

    public function isCurrent(): bool
    {
        $today = today();

        return $this->in_current_table && $this->valid_from->lte($today) && $this->valid_until->gte($today);
    }
}
