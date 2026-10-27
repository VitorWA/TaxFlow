---
name: mashure-apply
description: Implementar ou continuar tasks aprovadas de uma change OpenSpec em incrementos verificáveis, atualizando evidências no checklist. Usar quando o operador pedir aplicar, implementar ou continuar uma change. Não usar para inventar requisitos, fazer review independente ou arquivar.
---

# Aplicar uma change

1. Resolver a change pelo nome informado ou pelo contexto inequívoco. Se houver mais de uma candidata, pedir seleção.
2. Ler instruções do repositório, todos os artefatos da change e executar `openspec status --change <slug> --json` e `openspec instructions apply --change <slug> --json`.
3. Revisar `git status` e preservar trabalho preexistente. Confirmar escopo, contratos, riscos e autorizações necessárias.
4. Selecionar a próxima fatia aprovada em `tasks.md`. Se exceder limites locais ou envolver ação destrutiva/externa não autorizada, apresentar o recorte e pausar.
5. Implementar na ordem das tasks. Usar teste antes do código quando previsto e reutilizar padrões existentes.
6. Executar validação proporcional ao risco, sem usar credenciais, banco ou produção sem comprovação e autorização.
7. Marcar `[x]` somente após evidência real, anotando comando e resultado. Manter `[ ]` para pendências e registrar achados fora do escopo sem corrigi-los de carona.
8. Revalidar a change com o comando estrito suportado pela versão do OpenSpec.
9. Não promover `openspec/specs/`, arquivar, commitar, publicar ou abrir PR sem solicitação. Quando a implementação terminar, indicar `/mashure-review`.
