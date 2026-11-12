<?php

namespace App\Domain\ValueObjects;

use InvalidArgumentException;
use Stringable;

final readonly class Ean implements Stringable
{
    public function __construct(public string $value)
    {
        if (! preg_match('/^(?:[0-9]{8}|[0-9]{12}|[0-9]{13}|[0-9]{14})$/D', $value)
            || trim($value, '0') === '') {
            throw new InvalidArgumentException('EAN/GTIN inválido.');
        }

        $sum = 0;
        $weight = 3;
        for ($index = strlen($value) - 2; $index >= 0; $index--) {
            $sum += (int) $value[$index] * $weight;
            $weight = $weight === 3 ? 1 : 3;
        }

        if ((10 - ($sum % 10)) % 10 !== (int) substr($value, -1)) {
            throw new InvalidArgumentException('EAN/GTIN inválido.');
        }
    }

    public function __toString(): string
    {
        return $this->value;
    }
}
