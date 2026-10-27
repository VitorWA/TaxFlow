---
name: mashure-capture
description: Reconstruir uma change OpenSpec a partir de trabalho já implementado fora do Mashure, usando diff, commits e contexto disponível. Usar quando uma branch, commit ou pull request manual precisa entrar na rastreabilidade spec-driven. Não usar como substituto do planejamento normal.
---

# Capturar trabalho preexistente

1. Exigir uma referência local ou remota inequívoca e confirmar autorização antes de checkout ou acesso externo.
2. Ler instruções do repositório, estado Git, diff completo, commits, testes e descrição da entrega. Não modificar a implementação capturada.
3. Inferir somente comportamento demonstrável. Perguntar por motivação, não objetivos, decisões e casos de borda que o código não evidencia.
4. Derivar slug sem colidir com changes existentes e executar `/mashure-propose` com o contexto coletado.
5. Marcar proposal e design como reconstruídos de trabalho preexistente. Identificar claramente fatos do diff e inferências que exigem revisão humana.
6. Ajustar tasks para refletir o que já está comprovadamente concluído e deixar review/validações pendentes. Não marcar critérios não testados.
7. Vincular a referência da branch, commit ou PR nos artefatos, sem inventar número ou URL.
8. Não sincronizar nem arquivar. Próximo passo obrigatório: `/mashure-review`; somente depois dos gates, `/mashure-archive`.
