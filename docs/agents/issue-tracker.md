# Issue tracker: Markdown local

Issues, PRDs e mapas deste repositório vivem como Markdown versionado em `docs/wayfinder/`.

## Convenções

- Um esforço por diretório: `docs/wayfinder/<slug-do-esforco>/`.
- O mapa é `map.md`.
- Os tickets são arquivos individuais em `issues/<NN>-<slug>.md`, numerados a partir de `01`.
- Cada ticket tem as linhas `Type:`, `Status:` e, quando aplicável, `Blocked by:` perto do início.
- Comentários e histórico são acrescentados ao final, em `## Comments`.

## Operações de Wayfinder

- **Mapa:** `docs/wayfinder/<esforco>/map.md`, contendo destino, notas, decisões e neblina.
- **Ticket filho:** `docs/wayfinder/<esforco>/issues/NN-<slug>.md`; `Type:` pode ser `research`, `prototype`, `grilling` ou `task`.
- **Bloqueio:** `Blocked by: NN, NN`; um ticket fica disponível quando todos os listados estiverem `resolved`.
- **Fronteira:** tickets abertos, sem bloqueadores pendentes e sem `Status: claimed`; o primeiro por número é escolhido.
- **Reivindicar:** mudar para `Status: claimed` antes do trabalho.
- **Resolver:** acrescentar `## Answer`, mudar para `Status: resolved` e inserir no mapa um ponteiro conciso para a decisão.
