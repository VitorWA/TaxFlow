---
name: mashure-propose
description: Criar uma change OpenSpec completa com proposal, design, delta specs e tasks a partir de requisitos e decisões técnicas suficientes. Usar quando o operador pedir proposta, especificação ou planejamento pronto para implementação. Não usar para implementar, revisar ou arquivar.
---

# Propor uma change

1. Ler instruções do repositório, `openspec/config.yaml`, PRD, decisões técnicas, specs vivas e changes relacionadas.
2. Confirmar pré-voo: objetivo, escopo e não escopo, restrições e critério de pronto. Pausar somente se uma lacuna mudar materialmente o resultado.
3. Derivar slug curto em kebab-case e confirmar que não colide com change ativa ou arquivada.
4. Executar `openspec new change <slug>` e depois `openspec status --change <slug> --json`.
5. Para cada artefato pronto, executar `openspec instructions <id> --change <slug> --json`, ler suas dependências e seguir template, contexto e regras retornados pelo CLI.
6. Escrever apenas deltas em `openspec/changes/<slug>/specs/`; não promover specs vivas nesta etapa.
7. Tornar tasks pequenas, ordenadas por dependência e verificáveis. Incluir testes, validação, review e rollback compatíveis com o risco.
8. Executar `openspec validate <slug> --type change --strict --no-interactive` e confirmar que todos os requisitos para apply estão completos.
9. Não implementar código. Entregar paths, decisões, validação e pendências; indicar `/mashure-apply` quando estiver pronto.
