# Validar jornadas e saídas contextualizadas

Type: task
Status: resolved
Blocked by: 04

## Objetivo

Validar as jornadas de modalidade direta e categoria alternativa, a seleção de perfil e as saídas contextualizadas de tela e PDF, incluindo controles touch em viewport móvel.

## Critérios de aceite

- A Q11 pode desempatar ou alterar a ordem de perfis sustentados pelas perguntas fixas, mas não escolhe um perfil sozinha.
- Todo resultado pertence ao catálogo original de oito perfis; baixa evidência fixa é comunicada como retrato parcial, não como nono perfil.
- Quando a alternativa contextual tem `flag`, tela e PDF incluem seu convite de observação, além do gancho, do bloco da alternativa e da frase de situação.
- O harness Playwright verifica os controles mobile e gera screenshots auditáveis em `artifacts/ui/`.

## Answer

Os testes de regressão confirmam que a Q11 participa de `scores` e `evidenceMax` usados por `selectProfile`, sem ultrapassar a exigência de evidência fixa. O fallback continua escolhendo um dos perfis oficiais e usa apenas a marcação `partial` para explicar baixa evidência.

O trecho contextual agora renderiza `flagInvitation` na tela e no PDF para as flags de resultado/compensação e afastamento da informação. A validação visual e de toque é registrada pelo harness local de Playwright; os artefatos são gerados fora do Git em `artifacts/ui/`.

## Comments

- Ticket migrado do antigo registro em `.scratch/questionario-atleta-11/issues/05-validar-jornadas-e-saidas-contextualizadas.md`, que foi removido para manter uma única fonte de descoberta.
