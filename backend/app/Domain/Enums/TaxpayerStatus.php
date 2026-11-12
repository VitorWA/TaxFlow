<?php

namespace App\Domain\Enums;

enum TaxpayerStatus: string
{
    case Contribuinte = 'contribuinte';
    case NaoContribuinte = 'nao_contribuinte';
    case Isento = 'isento';

    public function label(): string
    {
        return match ($this) {
            self::Contribuinte => 'Contribuinte',
            self::NaoContribuinte => 'Não contribuinte',
            self::Isento => 'Isento',
        };
    }
}
