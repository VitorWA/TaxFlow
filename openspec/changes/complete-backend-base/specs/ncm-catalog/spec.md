## Purpose

Definir comportamento verificável para ncm-catalog no backend Laravel do TaxFlow, mantendo autorização e evidências de teste.

## ADDED Requirements

### Requirement: Carga oficial
O comando ncm:import SHALL importar JSON oficial local, validar antes de gravar e manter código, descrição, vigência, ato, fonte e data da carga; importar duas vezes não duplica.

#### Scenario: Importação repetida
- **WHEN** o mesmo arquivo é importado duas vezes
- **THEN** o catálogo mantém uma linha por código e a carga é atômica

### Requirement: Pesquisa e vigência
GET /api/v1/ncms e /ncms/{code} SHALL exigir autenticação, buscar por prefixo ou descrição com paginação e indicar vigência conforme datas e presença no último snapshot.

#### Scenario: Código expirado
- **WHEN** um código tem vigência encerrada
- **THEN** o detalhe sinaliza is_current=false e preserva a fonte
