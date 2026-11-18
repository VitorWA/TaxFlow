---
name: mashure-review
description: Revisar uma implementação contra sua change OpenSpec e os padrões do repositório, gerando achados rastreáveis e um veredito. Usar para review pré-PR, auditoria de uma change ou verificação independente. Não usar para corrigir automaticamente ou arquivar.
---

# Revisar uma change

1. Identificar change, base correta do diff, branch e SHA. Ler instruções, proposal, design, specs, tasks e PRD.
2. Executar status e validação OpenSpec antes do review. Coletar lint, testes e build existentes como evidência, sem executar comandos perigosos.
3. Revisar em passes independentes: conformidade com spec, corretude geral, stack, simplificação, segurança e qualidade dos testes. Adicionar SQL, performance, frontend ou acessibilidade quando o diff justificar.
4. Usar agentes paralelos somente quando disponíveis, permitidos e úteis; fornecer a cada passe o diff bruto e contexto mínimo. Caso contrário, manter passes sequenciais separados.
5. Para cada achado, registrar severidade, arquivo/linha, impacto, evidência reproduzível e correção recomendada. Não inventar problema sem evidência.
6. Gravar relatórios em `openspec/changes/<slug>/review/` e consolidar `_resumo.md` com change, base, SHA, data, comandos e veredito `PASS`, `CHANGES-REQUESTED` ou `BLOCKED`.
7. Adicionar achados acionáveis a `tasks.md`. Blocker/high dentro do escopo impede entrega; achado fora do escopo permanece alerta separado.
8. Não alterar código durante review salvo pedido explícito. Indicar `/mashure-apply` para correções ou `/mashure-archive` quando todos os gates estiverem verdes.
