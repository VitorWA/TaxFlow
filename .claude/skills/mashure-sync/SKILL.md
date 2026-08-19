---
name: mashure-sync
description: Promover semanticamente delta specs aprovadas de uma change para as specs vivas sem arquivar a change. Usar apenas quando o operador pedir sincronização antecipada ou outra change depender do novo contrato. Não usar como fechamento normal.
---

# Sincronizar specs vivas

1. Exigir nome da change e autorização explícita para modificar `openspec/specs/` sem arquivar.
2. Ler instruções, configuração, specs vivas e todos os deltas. Validar a change antes da promoção.
3. Interpretar ADDED, MODIFIED, REMOVED e RENAMED semanticamente; não copiar cabeçalhos de delta para a spec final.
4. Preservar requisitos e cenários não tocados. Para MODIFIED, substituir o requisito completo; para remoção ou conflito, confirmar impacto antes de continuar.
5. Não mover nem declarar a change arquivada. Registrar a sincronização e sua evidência em `tasks.md`.
6. Validar specs vivas e a change, revisar o diff e confirmar que somente capabilities declaradas mudaram.
7. Em conflito semântico, interromper e restaurar apenas edições feitas nesta execução quando isso puder ser feito com segurança.
8. Entregar specs alteradas, comandos, riscos e indicar `/mashure-archive` para o fechamento normal.
