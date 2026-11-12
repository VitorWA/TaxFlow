# Tasks

## 1. Base e qualidade (#8/#9)

- [ ] 1.1 Conferir o setup existente e executar a suíte de healthcheck pelo Docker; registrar resultado, versões e qualquer limitação do ambiente.
- [ ] 1.2 Configurar PHPUnit com banco isolado, Pint e Larastan nível 5; validar os três comandos localmente sem acessar banco de desenvolvimento.
- [ ] 1.3 Criar workflow para PRs em `develop` e `main`, com cache de dependências e etapas de lint, análise e testes; revisar sintaxe, comandos e filtros do workflow.
- [ ] 1.4 Documentar comandos de qualidade e separação do banco de testes; conferir que os comandos documentados correspondem aos executados.

## 2. Contratos transversais (#10)

- [ ] 2.1 Introduzir prefixo `/api/v1`, Resources e FormRequests; verificar lista de rotas e compatibilidade do healthcheck nos testes.
- [ ] 2.2 Implementar envelope uniforme de erro e proteção contra vazamento em 5xx; testar 422, 401, 403, 404, 429 e exceção inesperada fora de local.
- [ ] 2.3 Configurar request ID e logs estruturados sem senhas/tokens; testar correlação entre header, corpo de erro e log.
- [ ] 2.4 Configurar CORS de desenvolvimento e parâmetros de paginação/filtro/ordenação; testar preflight, limites e parâmetros inválidos e documentar o contrato.

## 3. Autenticação (#11)

- [ ] 3.1 Instalar Sanctum e adicionar migration de tokens; validar instalação e migrations em banco isolado.
- [ ] 3.2 Implementar login, logout, me e rate limit; testar credenciais válidas/inválidas, perfil, excesso de tentativas e reutilização de token revogado.
- [ ] 3.3 Proteger rotas de domínio e criar seeder local idempotente; testar anonimato, ausência de senha na resposta e proteção do seeder em produção; documentar uso local.

## 4. Domínio fiscal (#12)

- [ ] 4.1 Implementar enums e catálogo protegido; testar as 27 UFs e valores/rótulos das categorias e registrar os catálogos provisórios.
- [ ] 4.2 Implementar CNPJ, NCM e EAN como value objects; testar valores válidos, inválidos, dígitos verificadores, normalização e zeros iniciais e documentar formatos aceitos.
- [ ] 4.3 Usar casts de enum nos models existentes pertinentes; testar round-trip do regime tributário em Company.

## 5. Empresas e acesso (#13/#14)

- [ ] 5.1 Adicionar migrations de empresas e company_user com índices únicos, factory e seeder; executar migrations e verificar dados válidos em banco isolado.
- [ ] 5.2 Implementar criação transacional e vínculo owner automático; testar cadastro válido, CNPJ inválido/duplicado e integridade da vinculação.
- [ ] 5.3 Implementar listagem, detalhe e atualização com validação, Resources e filtros; testar paginação, persistência do regime e rejeição de campos inválidos; documentar endpoints.
- [ ] 5.4 Implementar policies e escopo por vínculo; testar usuário A versus B, leitura por member e atualização restrita a owner, inclusive acesso direto por ID.
- [ ] 5.5 Preparar regra/policies de acesso para Establishment, Product e TaxConsultation; testar a regra por empresa e documentar a integração pendente com models e rotas futuros.

## 6. Integração e revisão

Evidências parciais em 12/11/2026: `docker compose exec -T api php artisan test --compact` passou com 68 testes e 262 assertions em SQLite em memória; `vendor/bin/pint --test` passou em 68 arquivos; `vendor/bin/phpstan analyse --no-progress --memory-limit=512M` passou; `composer validate --strict` passou. `composer audit` identificou 7 avisos em 4 pacotes; tratar e repetir as verificações antes da conclusão. A integração das policies de recursos ainda não implementados permanece pendente.

- [ ] 6.1 Rodar suíte completa, Pint, Larastan e validação estrita desta change; registrar comandos, contagens e falhas sem marcar check incompleto como concluído.
- [ ] 6.2 Revisar diff e rastreabilidade de cada card, incluindo dependências futuras da #14, rollback documentado e limitações da evidência; solicitar review independente antes de concluir a change.

## Workflow follow-up

## Achados do review (12/11/2026)

- [x] R1 [P2] Tratar email em array/objeto na chave do throttle sem 500 e adicionar regressão de validação 422. Antes da correção, o teste retornou 500 com `Array to string conversion`; após a correção, arrays/objetos retornam 422. Teste adicional confirma limite por IP (31ª tentativa: 429). Suíte Docker: 70 passed, 309 assertions; Pint e Larastan passaram; validação estrita OpenSpec passou em 12/11/2026.
- [ ] R2 [P2] Documentar seed/credenciais locais, Bearer e comandos de qualidade, conforme specs/tasks #9/#11.
- [ ] A1 Triar os 7 avisos do Composer em dependências Symfony da base antes de publicação de produção; registrar atualização ou justificativa aplicável.

## Workflow follow-up (continuação)

- Pedir autorização explícita do operador antes de qualquer commit, push ou PR.
- Após publicação autorizada, executar o CI no GitHub e registrar duração real para avaliar a meta aproximada de cinco minutos da #9. Validação local não substitui essa evidência.
- Integrar e testar as policies dos recursos subordinados quando suas changes criarem os respectivos models e endpoints; não declarar essa integração concluída antecipadamente.
- Não sincronizar specs vivas nem arquivar sem solicitação e gates de revisão concluídos.
