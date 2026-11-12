## Purpose

Definir comportamento verificável para runtime-infrastructure no backend Laravel do TaxFlow, mantendo autorização e evidências de teste.

## ADDED Requirements

### Requirement: Ambiente reproduzível
Compose SHALL oferecer frontend, API, MySQL, Redis, worker e scheduler; preservar dados existentes e aguardar readiness da API antes de iniciar consumidores.

#### Scenario: Inicialização
- **WHEN** um desenvolvedor segue o README
- **THEN** os serviços sobem e worker processa job de smoke em fila exclusiva

### Requirement: Qualidade e build
CI SHALL executar Pint, Larastan, testes SQLite e MySQL/Redis isolados e build frontend em PRs para develop/main; Dockerfile deve ter alvo production sem ferramentas de dev.

#### Scenario: Teste de integração
- **WHEN** a suíte usa configuração MySQL de teste
- **THEN** migrations e limpeza não atingem o banco de desenvolvimento

### Requirement: Limites externos
A documentação SHALL registrar critérios pendentes de hospedagem, backups, DNS, secrets, supervisão, monitoramento e proteção de branch sem afirmar implantação remota.

#### Scenario: Sem hospedagem escolhida
- **WHEN** o código local é entregue
- **THEN** critérios externos da #42 continuam pendentes
