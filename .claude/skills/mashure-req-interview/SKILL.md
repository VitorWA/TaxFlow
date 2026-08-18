---
name: mashure-req-interview
description: Transformar material de negócio ou uma demanda inicial em PRD rastreável antes da criação de uma change OpenSpec. Usar para entrevista de requisitos, refinamento funcional, ata, BRD ou ideia ainda incompleta. Não usar para decidir implementação técnica ou escrever código.
---

# Entrevistar requisitos

1. Ler as instruções do repositório e o material fornecido. Separar fatos, pedidos explícitos, hipóteses e lacunas.
2. Identificar objetivo, usuários afetados, problema atual, resultado esperado, escopo, não objetivos, restrições, dependências e rastreabilidade externa.
3. Auditar o código somente quando necessário para descrever o estado atual. Citar `arquivo:linha -> informação` e não transformar implementação acidental em requisito.
4. Perguntar apenas sobre lacunas que mudam comportamento ou critério de aceite. Fazer perguntas curtas, uma decisão por vez.
5. Escrever critérios verificáveis com cenários de sucesso, erro, borda e preservação do comportamento existente.
6. Criar ou atualizar `docs/prds/<slug>/PRD.md`. Usar kebab-case e preservar o texto original da demanda em uma seção de rastreabilidade.
7. Registrar perguntas exclusivamente técnicas para `/mashure-tech-interview`; não respondê-las por suposição.
8. Não criar change nem alterar código. Encerrar com decisões fechadas, pendências e próximo passo.

O PRD deve conter: objetivo, contexto, usuários, escopo, não objetivos, requisitos, critérios de aceite, riscos/dependências, estado encontrado, perguntas abertas e rastreabilidade.
