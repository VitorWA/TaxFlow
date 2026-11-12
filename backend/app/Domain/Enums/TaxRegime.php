<?php

namespace App\Domain\Enums;

enum TaxRegime: string
{
    case SimplesNacional = 'simples_nacional';
    case LucroPresumido = 'lucro_presumido';
    case LucroReal = 'lucro_real';
    case Mei = 'mei';

    public function label(): string
    {
        return match ($this) {
            self::SimplesNacional => 'Simples Nacional',
            self::LucroPresumido => 'Lucro Presumido',
            self::LucroReal => 'Lucro Real',
            self::Mei => 'MEI',
        };
    }
}
