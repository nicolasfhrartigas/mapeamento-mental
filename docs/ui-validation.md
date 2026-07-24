# Validação visual e mobile

Instale as dependências e o navegador Chromium do Playwright:

```sh
npm install
npx playwright install chromium
```

Execute a validação das jornadas sem gravar imagens com:

```sh
npm run test:ui
```

Para executar as mesmas jornadas e gerar screenshots auditáveis:

```sh
npm run screenshots
```

O harness sobe e encerra seu próprio servidor HTTP local. Ele usa Chromium nos viewports mobile (390 × 844, touch) e desktop (1440 × 900), exercita modalidade direta, “Outros esportes”, as 11 perguntas, troca de resposta via voltar e resultado.

Os arquivos gerados ficam fora do Git em `artifacts/ui/`: `report.json` registra data, navegador, jornadas, assertions e caminhos; as imagens ficam em `artifacts/ui/mobile/` e `artifacts/ui/desktop/`. Uma falha de assertion encerra o comando com código diferente de zero; leia a entrada correspondente no relatório para identificar viewport, jornada e controle afetado.

Antes de declarar a validação mobile concluída, um agente deve executar `npm run screenshots`, inspecionar visualmente os PNGs mobile e citar no handoff `artifacts/ui/report.json` e os screenshots relevantes (inicial, outros esportes aberto, pergunta intermediária, pergunta 11 e resultado).
