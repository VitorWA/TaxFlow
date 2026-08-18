---
name: mashure-review
description: Revisar uma implementação contra sua change OpenSpec e os padrões do repositório, gerando achados rastreáveis e um veredito. Usar para review pré-PR, auditoria de uma change ou verificação independente. Não usar para corrigir automaticamente ou arquivar.
---

# Revisar uma change

1. Identificar change, base correta do diff, branch e SHA. Começar por instruções do repositório, `git status`, `git diff --stat`, arquivos alterados, status/validação OpenSpec, `proposal.md`, `tasks.md` e títulos dos requirements/cenários. Ler PRD, design, specs completas e código não alterado somente para esclarecer contratos ou riscos concretos.
2. Ler cada hunk uma vez em um passe central, relacionando-o ao requirement aplicável e avaliando conformidade, corretude, padrões da stack, simplificação, segurança e testes. Não repetir o diff inteiro em passes separados.
3. Abrir análise especializada de SQL, performance, frontend, acessibilidade, autenticação, autorização ou migrations somente quando arquivos ou riscos do diff acionarem o tema. Fornecer apenas hunks, contratos e requirements relevantes; resumir o restante.
4. Usar agentes independentes somente por pedido explícito ou em mudança de alto risco. Não enviar o diff bruto inteiro a cada agente; dividir por risco ou subsistema e evitar análises sobrepostas.
5. Executar lint, testes e build proporcionais ao risco. Registrar comando, exit code e resumo; incluir apenas trechos relevantes de falhas, nunca logs completos sem necessidade.
6. Para cada achado comprovado, registrar severidade, arquivo/linha, requirement quando houver, impacto, evidência reproduzível e correção recomendada. Não inventar problema sem evidência.
7. Gravar por padrão somente `openspec/changes/<slug>/review/_resumo.md`, com change, base, SHA, data, comandos, achados e veredito `PASS`, `CHANGES-REQUESTED` ou `BLOCKED`. Criar relatórios adicionais apenas por pedido explícito ou quando a profundidade da auditoria justificar.
8. Adicionar a `tasks.md` apenas referências curtas para achados acionáveis, sem duplicar o relatório. Blocker/high dentro do escopo impede entrega; achado fora do escopo permanece alerta separado.
9. Não alterar código durante review salvo pedido explícito. Indicar `/mashure-apply` para correções ou `/mashure-archive` quando todos os gates estiverem verdes.
