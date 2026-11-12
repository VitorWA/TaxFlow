<?php

namespace Tests\Unit\Domain;

use App\Domain\Enums\OperationType;
use App\Domain\Enums\Purpose;
use App\Domain\Enums\RecipientType;
use App\Domain\Enums\State;
use App\Domain\Enums\TaxpayerStatus;
use App\Domain\Enums\TaxRegime;
use PHPUnit\Framework\TestCase;

class DomainEnumsTest extends TestCase
{
    public function test_all_brazilian_states_have_unique_abbreviations(): void
    {
        $expected = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
            'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];

        $this->assertSame($expected, array_column(State::cases(), 'value'));
        $this->assertNull(State::tryFrom('XX'));
    }

    public function test_supported_tax_regimes_are_explicit(): void
    {
        $this->assertSame(['simples_nacional', 'lucro_presumido', 'lucro_real', 'mei'], array_column(TaxRegime::cases(), 'value'));
        $this->assertNull(TaxRegime::tryFrom('unknown'));
    }

    public function test_each_domain_option_has_a_human_label(): void
    {
        foreach ([TaxRegime::cases(), State::cases(), OperationType::cases(), Purpose::cases(),
            RecipientType::cases(), TaxpayerStatus::cases()] as $cases) {
            foreach ($cases as $case) {
                $this->assertNotEmpty($case->label());
            }
        }
    }
}
