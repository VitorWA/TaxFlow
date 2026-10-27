---
name: mashure-explore
description: Investigar uma questão de produto ou engenharia de forma somente leitura, produzindo evidências para PRD, design, spec ou decisão. Usar quando o operador pedir explorar, mapear, comparar, localizar causa ou entender impacto sem solicitar implementação.
---

# Explorar sem implementar

1. Declarar a pergunta, limites e evidência necessária. Se ampla demais para uma conclusão confiável, negociar um recorte.
2. Ler instruções, contexto do projeto e artefatos OpenSpec relacionados. Revisar `git status` para distinguir baseline de alterações locais.
3. Usar primeiro `rg` e `rg --files`, depois leitura direcionada, histórico e comandos read-only.
4. Cruzar código, testes, documentação, specs vivas e changes. Separar fato, inferência e hipótese.
5. Citar conclusões como `arquivo:linha -> informação` ou `comando -> resultado`. Marcar itens não verificados.
6. Mapear contratos, segurança, regressões, dependências e alternativas com trade-offs reais.
7. Não modificar arquivos, dependências, banco ou estado externo. Artefatos de planejamento só podem ser escritos quando o operador pedir explicitamente.
8. Entregar resposta direta, evidências críticas, lacunas e recomendação de próximo passo: `/mashure-req-interview`, `/mashure-tech-interview` ou `/mashure-propose`.
