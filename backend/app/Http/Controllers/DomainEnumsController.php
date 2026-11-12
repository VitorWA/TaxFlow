<?php

namespace App\Http\Controllers;

use App\Domain\Enums\OperationType;
use App\Domain\Enums\Purpose;
use App\Domain\Enums\RecipientType;
use App\Domain\Enums\State;
use App\Domain\Enums\TaxpayerStatus;
use App\Domain\Enums\TaxRegime;
use Illuminate\Http\Resources\Json\JsonResource;

class DomainEnumsController extends Controller
{
    /**
     * Consultar opções do domínio fiscal.
     *
     * @group Domínio
     *
     * @responseFile 200 docs/examples/enums.json
     *
     * @response 401 {"error":{"code":"unauthenticated","message":"Credenciais inválidas ou autenticação necessária.","details":{}},"request_id":"example"}
     */
    public function __invoke(): JsonResource
    {
        return new JsonResource([
            'tax_regimes' => $this->options(TaxRegime::cases()),
            'states' => $this->options(State::cases()),
            'operation_types' => $this->options(OperationType::cases()),
            'purposes' => $this->options(Purpose::cases()),
            'recipient_types' => $this->options(RecipientType::cases()),
            'taxpayer_statuses' => $this->options(TaxpayerStatus::cases()),
        ]);
    }

    /**
     * @param  array<TaxRegime|State|OperationType|Purpose|RecipientType|TaxpayerStatus>  $cases
     * @return list<array{value: string, label: string}>
     */
    private function options(array $cases): array
    {
        return array_values(array_map(
            fn ($case): array => ['value' => $case->value, 'label' => $case->label()],
            $cases,
        ));
    }
}
