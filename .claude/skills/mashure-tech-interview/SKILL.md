---
name: mashure-tech-interview
description: Auditar o repositório e fechar decisões técnicas a partir de um PRD ou escopo funcional definido, preparando a entrada para uma proposta OpenSpec. Usar para refinamento técnico, arquitetura, contratos, testes, risco e fatiamento. Não usar para implementar ou revisar código pronto.
---

# Entrevistar decisões técnicas

1. Ler instruções, `openspec/config.yaml`, PRD, specs vivas e changes relacionadas. Revisar `git status` antes de qualquer escrita.
2. Investigar com `rg`, leitura direcionada, testes e histórico. Localizar precedentes e abstrações existentes antes de propor novas.
3. Mapear camadas afetadas, contratos públicos, persistência, segurança, observabilidade, compatibilidade e rollback.
4. Identificar decisões que alteram design, risco ou critério de aceite. Para cada uma, apresentar alternativas, evidências e trade-offs; perguntar uma decisão por vez.
5. Definir estratégia de teste segura e comandos de lint/build/test do projeto. Não presumir que bancos ou serviços externos são descartáveis.
6. Fatiar a implementação conforme limites do repositório e definir pronto verificável para cada fatia.
7. Atualizar no PRD apenas as decisões e a rastreabilidade técnica. Sem PRD, devolver um resumo estruturado consumível por `/mashure-propose`.
8. Não escrever implementação. Se restar decisão material, mantê-la explicitamente aberta; quando o pré-voo estiver completo, invocar ou indicar `/mashure-propose`.
