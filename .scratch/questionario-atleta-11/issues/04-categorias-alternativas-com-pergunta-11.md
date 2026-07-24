# 04 — Atender categorias alternativas com pergunta 11

**What to build:** Uma pessoa que escolher uma categoria alternativa em “Outros esportes” recebe a pergunta 11 da categoria escolhida — não uma pergunta genérica — e um PDF com o respectivo ponto de atenção da modalidade.

Type: task
Status: resolved
Blocked by: 02


- [x] Esportes Coletivos, Esporte de Resistência, Esportes de Luta, Esportes de Raquete, Esportes de Habilidades e Mira e E-sports possuem uma Q11 única aprovada para a categoria.
- [x] A seleção de uma categoria alternativa mantém a área de toque e o estado selecionado corretos, sem competir com as modalidades diretas.
- [x] A pergunta contextual e o trecho do PDF correspondem à categoria escolhida, inclusive flags e regras de evidência específicas.
- [x] Nenhuma categoria utiliza fallback genérico ou acrescenta mais de uma pergunta após as dez fixas.

## Answer

As seis categorias de “Outros esportes” já estavam ligadas, em `index.html`, às suas
respectivas Q11 aprovadas. A seleção limpa o estado selecionado nos dois sentidos entre
modalidade direta e categoria alternativa, fecha o menu e compõe exatamente as dez perguntas fixas com a Q11
da categoria. As matrizes seguem `reg: 2/0/—/1`, com `sup: 1` na alternativa de alinhamento
somente em Esportes Coletivos e Esportes de Luta.

Foi adicionada a cobertura `tests/contextual-other-categories.test.js`: ela verifica as seis
matrizes, as jornadas isoladas de onze perguntas, a ausência de fallback genérico, o trecho do
PDF e a independência estrutural do seletor em relação às modalidades diretas. `node --test`,
a sintaxe do JavaScript, `git diff --check` e a inspeção do guard único de `:hover` passaram.

Não foi possível concluir a inspeção visual interativa em viewport mobile porque nenhum navegador
controlável estava disponível nesta sessão; a verificação estrutural do controle de toque foi
coberta pelos testes automatizados.
