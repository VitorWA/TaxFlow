---
name: mashure-archive
description: Validar, sincronizar e arquivar uma change OpenSpec concluída após os gates de implementação e review. Usar quando o operador pedir fechar ou arquivar uma change. Não usar com tasks obrigatórias, critérios ou achados bloqueadores pendentes.
---

# Arquivar uma change

1. Ler instruções, configuração, PRD, artefatos da change, review consolidado e checklist final.
2. Confirmar tasks obrigatórias, critérios de aceite, testes, lint/build aplicáveis, rollback e ausência de blocker/high aberto.
3. Executar status e validação estrita da change. Revisar o diff de specs que será promovido.
4. Confirmar que a política do repositório permite arquivar neste momento; se exigir merge prévio, verificar a evidência do merge.
5. Se houver conflito semântico, mudança inesperada de contrato ou autorização pendente, não arquivar.
6. Executar `openspec archive <slug>` sem desabilitar validação. Usar opção para não sincronizar specs somente quando a change comprovadamente não possuir capability ou quando o operador autorizar exceção documentada.
7. Validar todas as specs e confirmar o destino em `openspec/changes/archive/`.
8. Não criar commit, tag, push, release ou PR sem solicitação. Entregar arquivos promovidos, validações, pendências e rollback.
