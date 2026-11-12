<?php

namespace App\Domain\ValueObjects;

use InvalidArgumentException;
use Stringable;

final readonly class NcmCode implements Stringable
{
    public function __construct(public string $value)
    {
        // Structural validation only; existence and validity dates belong to the NCM catalog.
        if (! preg_match('/^[0-9]{8}$/D', $value)) {
            throw new InvalidArgumentException('NCM deve conter exatamente oito dígitos.');
        }
    }

    public function __toString(): string
    {
        return $this->value;
    }
}
