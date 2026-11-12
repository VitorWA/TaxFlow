<?php

namespace Tests\Unit\Domain;

use App\Domain\ValueObjects\Cnpj;
use App\Domain\ValueObjects\Ean;
use App\Domain\ValueObjects\NcmCode;
use InvalidArgumentException;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

class ValueObjectsTest extends TestCase
{
    #[DataProvider('validCnpjs')]
    public function test_cnpj_preserves_canonical_value(string $input, string $expected): void
    {
        $cnpj = new Cnpj($input);
        $this->assertSame($expected, $cnpj->value);
        $this->assertSame($expected, (string) $cnpj);
    }

    /** @return iterable<string, array{string, string}> */
    public static function validCnpjs(): iterable
    {
        yield 'numeric' => ['11222333000181', '11222333000181'];
        yield 'formatted' => ['11.222.333/0001-81', '11222333000181'];
        yield 'leading zeroes' => ['00.000.000/0001-91', '00000000000191'];
        // Official Receita Federal calculation example.
        yield 'alphanumeric' => ['12.ABC.345/01DE-35', '12ABC34501DE35'];
        yield 'lowercase' => [' 12.abc.345/01de-35 ', '12ABC34501DE35'];
        yield 'first issued alphanumeric branch' => ['00.000.000/E08G-12', '00000000E08G12'];
    }

    #[DataProvider('invalidCnpjs')]
    public function test_cnpj_rejects_bad_format_or_check_digits(string $input): void
    {
        $this->expectException(InvalidArgumentException::class);
        new Cnpj($input);
    }

    /** @return iterable<array{string}> */
    public static function invalidCnpjs(): iterable
    {
        foreach (['', '00000000000000', '11111111111111', '11222333000180', '12ABC34501DE36',
            '12ABC34501DE3A', '1122233300018', '112223330001811', '11!222333000181',
            '11..222333000181', '11 222333000181', 'é2ABC34501DE35'] as $value) {
            yield [$value];
        }
    }

    public function test_ncm_keeps_leading_zeroes(): void
    {
        $code = new NcmCode('01012100');
        $this->assertSame('01012100', $code->value);
        $this->assertSame('01012100', (string) $code);
    }

    #[DataProvider('invalidNcms')]
    public function test_ncm_rejects_noncanonical_format(string $input): void
    {
        $this->expectException(InvalidArgumentException::class);
        new NcmCode($input);
    }

    /** @return iterable<array{string}> */
    public static function invalidNcms(): iterable
    {
        foreach (['', '1012100', '001012100', '0101.21.00', '01012A00', '01012100 ', "01012100\n"] as $value) {
            yield [$value];
        }
    }

    #[DataProvider('validEans')]
    public function test_ean_accepts_supported_gtin_formats(string $input): void
    {
        $ean = new Ean($input);
        $this->assertSame($input, $ean->value);
        $this->assertSame($input, (string) $ean);
    }

    /** @return iterable<string, array{string}> */
    public static function validEans(): iterable
    {
        yield 'GTIN-8' => ['96385074'];
        yield 'GTIN-12' => ['036000291452'];
        yield 'GTIN-13' => ['4006381333931'];
        yield 'GTIN-14' => ['10012345000017'];
    }

    #[DataProvider('invalidEans')]
    public function test_ean_rejects_invalid_format_and_check_digits(string $input): void
    {
        $this->expectException(InvalidArgumentException::class);
        new Ean($input);
    }

    /** @return iterable<array{string}> */
    public static function invalidEans(): iterable
    {
        foreach (['', '00000000', '0000000000000', '96385075', '036000291453', '4006381333932',
            '10012345000018', '123456789', '400638133393A', '4006381333931 ', "4006381333931\n"] as $value) {
            yield [$value];
        }
    }
}
