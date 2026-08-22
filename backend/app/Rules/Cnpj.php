<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class Cnpj implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $cnpj = self::normalize((string) $value);

        if (!preg_match('/^[A-Z0-9]{12}[0-9]{2}$/', $cnpj)) {
            $fail('Informe um CNPJ válido.');
            return;
        }

        $base = substr($cnpj, 0, 12);
        if (count(array_unique(str_split($base))) === 1) {
            $fail('Informe um CNPJ válido.');
            return;
        }

        $firstDigit = $this->calculateDigit($base);
        $secondDigit = $this->calculateDigit($base.$firstDigit);

        if (!str_ends_with($cnpj, (string) $firstDigit.$secondDigit)) {
            $fail('Informe um CNPJ válido.');
        }
    }

    public static function normalize(string $value): string
    {
        return substr((string) preg_replace('/[^A-Z0-9]/', '', strtoupper($value)), 0, 14);
    }

    private function calculateDigit(string $base): int
    {
        $weight = strlen($base) - 7;
        $sum = 0;

        foreach (str_split($base) as $character) {
            $sum += (ord($character) - 48) * $weight;
            $weight--;
            if ($weight === 1) {
                $weight = 9;
            }
        }

        $remainder = $sum % 11;
        return $remainder < 2 ? 0 : 11 - $remainder;
    }
}
