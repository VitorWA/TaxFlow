<?php

namespace App\Domain\ValueObjects;

use InvalidArgumentException;
use Stringable;

final readonly class Cnpj implements Stringable
{
    public string $value;

    public function __construct(string $value)
    {
        $value = strtoupper(trim($value));

        if (preg_match('/^[A-Z0-9]{2}\.[A-Z0-9]{3}\.[A-Z0-9]{3}\/[A-Z0-9]{4}-[0-9]{2}$/D', $value)) {
            $value = str_replace(['.', '/', '-'], '', $value);
        }

        if (! preg_match('/^[A-Z0-9]{12}[0-9]{2}$/D', $value)
            || preg_match('/^([0-9])\1{13}$/D', $value)) {
            throw new InvalidArgumentException('CNPJ inválido.');
        }

        // Receita Federal: ASCII minus 48, modulo 11, for both CNPJ formats.
        $base = substr($value, 0, 12);
        $first = self::checkDigit($base, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
        $second = self::checkDigit($base.$first, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);

        if (substr($value, -2) !== $first.$second) {
            throw new InvalidArgumentException('CNPJ inválido.');
        }

        $this->value = $value;
    }

    /** @param list<int> $weights */
    private static function checkDigit(string $base, array $weights): string
    {
        $sum = 0;
        foreach ($weights as $index => $weight) {
            $sum += (ord($base[$index]) - 48) * $weight;
        }

        $remainder = $sum % 11;

        return (string) ($remainder < 2 ? 0 : 11 - $remainder);
    }

    public function __toString(): string
    {
        return $this->value;
    }
}
