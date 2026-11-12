<?php

namespace App\Domain\Enums;

/** Initial vocabulary; additions require an explicit API contract change. */
enum RecipientType: string
{
    case PessoaFisica = 'pessoa_fisica';
    case PessoaJuridica = 'pessoa_juridica';

    public function label(): string
    {
        return match ($this) {
            self::PessoaFisica => 'Pessoa física',
            self::PessoaJuridica => 'Pessoa jurídica',
        };
    }
}
