## Purpose

Representar tipos fiscais e identificadores de maneira consistente entre validação, persistência e opções exibidas pelo frontend.

## ADDED Requirements

### Requirement: Catálogo de enums
O domínio MUST representar regimes tributários, as 27 UFs, tipos de operação, finalidades, tipos de destinatário e condição de contribuinte. `GET /api/v1/domain/enums` MUST expor valores estáveis e rótulos para selects.

#### Scenario: Catálogo autenticado
- **WHEN** um usuário autenticado consulta os enums
- **THEN** recebe todas as categorias, incluindo Simples Nacional, Lucro Presumido, Lucro Real e MEI

### Requirement: CNPJ válido e canônico
O domínio MUST validar estrutura e dígitos verificadores de CNPJ e produzir uma representação canônica para comparação e persistência.

#### Scenario: CNPJ inválido
- **WHEN** um CNPJ tem tamanho, caracteres ou dígitos verificadores inválidos
- **THEN** a criação do valor falha e o cadastro retorna erro de validação

#### Scenario: CNPJ formatado
- **WHEN** um CNPJ válido é informado com a formatação de exibição aceita
- **THEN** seu valor canônico coincide com o mesmo identificador sem formatação

### Requirement: NCM com oito dígitos
O domínio MUST aceitar somente códigos de NCM com exatamente oito dígitos, preservando zeros iniciais. A existência e vigência na tabela oficial são responsabilidade da futura integração #16.

#### Scenario: Código com zero inicial
- **WHEN** um código válido de oito dígitos começa com zero
- **THEN** sua representação preserva os oito dígitos

### Requirement: EAN validado
O domínio MUST validar o formato e o dígito verificador dos formatos de GTIN suportados e preservar zeros iniciais.

#### Scenario: Dígito verificador incorreto
- **WHEN** um identificador possui comprimento aceito e dígito verificador incorreto
- **THEN** a criação do valor é rejeitada

### Requirement: Persistência com tipos fiscais
Campos fiscais dos models implementados nesta change MUST usar os tipos de domínio correspondentes e rejeitar valores não pertencentes ao catálogo.

#### Scenario: Regime desconhecido
- **WHEN** o cadastro de empresa recebe regime fora do catálogo
- **THEN** a API retorna 422 sem persistir a empresa
