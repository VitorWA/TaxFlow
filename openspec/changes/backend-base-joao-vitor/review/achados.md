# Achados

## R1 — [P2] Email em array provoca 500 antes da validação (#10/#11)

- Arquivo: `backend/app/Providers/AppServiceProvider.php:28`.
- Evidência: requisição ao kernel HTTP com `POST /api/v1/auth/login`, Content-Type JSON e corpo `{"email":[],"password":"x"}` retornou **500**, `error.code=server_error`.
- Causa: o throttle converte o email diretamente para string antes de executar LoginRequest; PHP emite `Array to string conversion`, convertido em exceção pelo Laravel.
- Impacto: entrada inválida comum quebra o contrato de validação 422 e gera ruído de erro no endpoint público. A suíte atual não cobre tipos compostos no login.
- Correção recomendada: construir a chave do limiter apenas com email escalar/string validável, mantendo o limite por IP para entradas inválidas; adicionar teste de regressão com array/objeto.

## R2 — [P2] Documentar como autenticar e executar os checks (#9/#11)

- Arquivos: `README.md` e `docs/backend-base-issues.md`.
- Evidência: README mantém apenas os comandos do skeleton; não descreve seed, usuário local, login Bearer ou os comandos de Pint/Larastan. O documento da entrega cita os recursos sem explicar seu uso.
- Impacto: a spec `user-auth` exige seeder documentado, e task 1.4 exige comandos de qualidade. Um clone novo não dispõe das instruções para obter credenciais e usar os endpoints protegidos.
- Correção recomendada: documentar migrations, seed exclusivamente local (`test@example.com` / `password`), login/me/logout, cabeçalho Bearer e comandos de testes/Pint/Larastan; informar paginação/filtros/CORS configurável e formatos de identificadores.

## Alertas separados e limites de conclusão

- `composer audit --format=json --no-interaction` retornou 7 avisos em `symfony/http-foundation`, `symfony/http-kernel`, `symfony/mime` e `symfony/routing`. Os pacotes já pertencem à base; não atribuo esses avisos à adição de Sanctum/Larastan nem afirmo exploração no TaxFlow. Atualização/triagem precisa ser tratada antes da publicação de produção.
- #14: as policies subordinadas têm testes com model de teste e não estão integradas a endpoints reais de Establishment/Product/TaxConsultation, inexistentes. É uma dependência explícita do design; não é conclusão integral do card.
- #9: workflow revisado localmente; execução remota e meta de duração aguardam publicação autorizada.
- Tasks permanecem abertas apesar de evidências parciais. Registrar conclusão individual somente após conferir todos os critérios; não considerar `openspec status isComplete` prova de implementação concluída (ele indica artefatos de planejamento prontos).
- Não executado: frontend, smoke de migrations em MySQL descartável, CI remoto. Testes usam SQLite/mocks; nenhuma migration foi aplicada no banco de desenvolvimento durante este review.
