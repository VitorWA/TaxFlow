---
name: mashure-setup
description: Configurar ou diagnosticar o workflow Mashure em um repositório que usa OpenSpec. Usar quando o operador pedir setup, adoção, atualização ou verificação inicial do Mashure. Não usar para criar ou implementar uma change de produto.
---

# Configurar Mashure

1. Ler `AGENTS.md`, `CLAUDE.md`, `CODEX.md` e instruções equivalentes existentes. Preservar a hierarquia definida pelo repositório.
2. Revisar `git status` e identificar arquivos já instalados em `.mashure/manifest.json`, `.agents/skills/` e `.claude/skills/`.
3. Executar `mashure check`. Se o CLI OpenSpec estiver ausente, informar o comando oficial de instalação e pedir autorização antes de alterar o ambiente global.
4. Se `openspec/` não existir, inicializar com o CLI oficial usando opções compatíveis com a versão detectada. Não sobrescrever adaptadores ou configuração existentes.
5. Se `openspec/config.yaml` existir, preservá-lo. Caso não exista, oferecer uma configuração mínima com schema `spec-driven`, contexto do projeto e regras verificáveis; só escrever após entender stack, testes e convenções.
6. Confirmar que `openspec status`, `mashure check` e a descoberta das skills estão funcionais. Recomendar reiniciar o agente quando ele carregar skills apenas na inicialização.
7. Entregar ferramentas instaladas, arquivos gerenciados, versão do OpenSpec e pendências. Não criar change, commit ou publicação por iniciativa própria.

Próximo passo: usar `/mashure-req-interview` para uma demanda de produto ou `/mashure-propose` para mudança técnica já definida.
