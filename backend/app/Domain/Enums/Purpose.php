<?php

namespace App\Domain\Enums;

enum Purpose: string
{
    case Revenda = 'revenda';
    case ConsumoFinal = 'consumo_final';
    case Industrializacao = 'industrializacao';
    case UsoConsumo = 'uso_consumo';
    case AtivoImobilizado = 'ativo_imobilizado';

    public function label(): string
    {
        return match ($this) {
            self::Revenda => 'Revenda',
            self::ConsumoFinal => 'Consumo final',
            self::Industrializacao => 'Industrialização',
            self::UsoConsumo => 'Uso e consumo',
            self::AtivoImobilizado => 'Ativo imobilizado',
        };
    }
}
