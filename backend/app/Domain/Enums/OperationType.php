<?php

namespace App\Domain\Enums;

/** Initial vocabulary; additions require an explicit API contract change. */
enum OperationType: string
{
    case Venda = 'venda';
    case Transferencia = 'transferencia';
    case Devolucao = 'devolucao';

    public function label(): string
    {
        return match ($this) {
            self::Venda => 'Venda',
            self::Transferencia => 'Transferência',
            self::Devolucao => 'Devolução',
        };
    }
}
