// Formatação do relatório em PDF — desenho manual com jsPDF.
// Recebe apenas dados já resolvidos (ver `buildReportData` em quiz-engine.js);
// não conhece perguntas, pontuação ou perfis. Trocar o layout aqui não deve
// exigir tocar no motor do quiz, e vice-versa.
//
// Tema: papel branco com a paleta do redesign rebaixada para leitura em
// impressão — oliva #657542 como cor estrutural, terracota #C15A2C só em
// acento, tinta #1E2317. Nada de fundo escuro ou saturação alta contra o
// branco.
//
// REGRA DE OURO: o relatório tem no MÁXIMO 2 páginas. O desenho inteiro roda
// dentro de `draw(k)`, onde `k` é um fator de densidade; se o conteúdo
// transbordar a segunda página, redesenhamos mais compacto. Ao mexer em
// qualquer bloco, use as helpers escaladas (`fs`, `sp`) — valores fixos
// escapam do ajuste e quebram a garantia.

export function generatePdfReport(data) {
  if (!window.jspdf || !window.jspdf.jsPDF) { alert('Aguarde o carregamento e tente novamente.'); return; }

  const {
    prof, profileFields, athleteName, dateStr, sportLabel, levelLabel, goalLabel,
    contextual, factors, observations, answers, filenameSlug,
  } = data;

  // ── Paleta (papel branco) ───────────────────────────────────────
  const PAPER = [255, 255, 255];
  const INK = [30, 35, 23];        // títulos
  const BODY = [74, 82, 63];       // corpo de texto
  const MUTED = [122, 131, 109];   // apoio
  const FAINT = [150, 158, 138];   // rodapé legal
  const HAIR = [225, 229, 216];    // filetes
  const TINT = [244, 246, 238];    // fundo de cartão
  const OLIVE = [101, 117, 66];    // #657542
  const OLIVE_D = [79, 92, 52];
  const TERRA = [193, 90, 44];     // #C15A2C — laranja da marca rebaixado
  const PANEL = [47, 56, 26];      // #2F381A — só no bloco de CTA
  const PANEL_TX = [214, 219, 203];

  const MAX_PAGES = 2;

  function draw(k) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const W = doc.internal.pageSize.getWidth();
    const H = doc.internal.pageSize.getHeight();
    const M = 48; const CW = W - M * 2;
    const BOTTOM = H - 52;
    let y = M;
    let overflow = false;

    const fs = (v) => v * k;          // tamanho de fonte escalado
    const sp = (v) => Math.round(v * k * 10) / 10; // espaçamento escalado

    const newPage = () => {
      if (doc.getNumberOfPages() >= MAX_PAGES) { overflow = true; y = BOTTOM; return; }
      doc.addPage(); y = M;
    };
    const ensureSp = (n) => { if (y + n > BOTTOM) newPage(); };
    const sf = (style, size, color, spacing) => {
      doc.setFont('helvetica', style);
      doc.setFontSize(fs(size));
      doc.setTextColor(...(color || BODY));
      doc.setCharSpace(spacing || 0);
    };
    const sec = (label) => {
      ensureSp(sp(30));
      sf('bold', 7.6, OLIVE, 1.6);
      doc.text(label.toUpperCase(), M, y);
      y += sp(7);
      doc.setFillColor(...HAIR); doc.rect(M, y, CW, .7, 'F');
      doc.setFillColor(...TERRA); doc.rect(M, y, sp(38), 1.6, 'F');
      y += sp(15);
    };
    // Barra do fator: oliva → terracota, a mesma leitura da tela mas em
    // tons que não gritam contra o papel.
    const factorBar = (percent) => {
      const height = sp(5);
      const width = Math.max(0, Math.min(1, percent / 100)) * CW;
      doc.setFillColor(...TINT); doc.rect(M, y, CW, height, 'F');
      if (width > 0) {
        const steps = Math.max(16, Math.ceil(width / 2));
        for (let step = 0; step < steps; step++) {
          const ratio = step / Math.max(steps - 1, 1);
          const color = OLIVE.map((c, i) => Math.round(c + (TERRA[i] - c) * ratio));
          doc.setFillColor(...color);
          doc.rect(M + (width * step / steps), y, (width / steps) + .5, height, 'F');
        }
      }
      y += height + sp(7);
    };

    doc.setFillColor(...PAPER); doc.rect(0, 0, W, H, 'F');

    // ── Cabeçalho ────────────────────────────────────────────────
    doc.setFillColor(...OLIVE); doc.rect(0, 0, W, sp(3.5), 'F');
    y = M + sp(14);
    sf('bold', 7.6, OLIVE, 2.2);
    doc.text('MAPA MENTAL DO ATLETA', M, y);
    y += sp(24);
    sf('bold', 21, INK, .4);
    doc.text(String(athleteName || 'Atleta').toUpperCase(), M, y);
    y += sp(10);
    doc.setFillColor(...TERRA); doc.rect(M, y, sp(38), 2, 'F');
    y += sp(16);
    sf('normal', 7.4, MUTED, .15);
    doc.text(`Relatório educativo · ${dateStr} · Nicolas Artigas · Psicólogo do Esporte · CRP 08/45704`, M, y);
    y += sp(12);
    doc.setFillColor(...HAIR); doc.rect(M, y, CW, .7, 'F');
    y += sp(24);

    // ── Perfil mental ────────────────────────────────────────────
    if (prof) {
      sf('italic', 8.6, MUTED);
      const eLines = doc.splitTextToSize(prof.essence, CW - sp(40));
      const cardH = sp(46) + eLines.length * sp(11);
      ensureSp(cardH + sp(12));
      doc.setFillColor(...TINT); doc.rect(M, y, CW, cardH, 'F');
      doc.setFillColor(...OLIVE); doc.rect(M, y, sp(3), cardH, 'F');
      sf('bold', 7, TERRA, 1.4); doc.text(String(prof.type).toUpperCase(), M + sp(20), y + sp(19));
      sf('bold', 15, INK, .2); doc.text(prof.name, M + sp(20), y + sp(37));
      sf('italic', 8.6, MUTED); doc.text(eLines, M + sp(20), y + sp(52));
      y += cardH + sp(14);
      if (prof.partial) {
        sf('normal', 7.6, MUTED);
        const partialLines = doc.splitTextToSize(prof.partialReason, CW);
        ensureSp(partialLines.length * sp(10) + sp(8));
        doc.text(partialLines, M, y); y += partialLines.length * sp(10) + sp(10);
      }
    }

    // ── Suas escolhas: chips em linha, com quebra ────────────────
    sec('Suas escolhas');
    const CHIP_H = sp(30); const CHIP_GAP = sp(7); const CHIP_PAD = sp(11);
    let chipX = M; let chipRowY = y;
    ensureSp(CHIP_H);
    [['Modalidade', sportLabel], ['Nível', levelLabel], ['Objetivo', goalLabel]].forEach(([label, value]) => {
      const text = String(value || '—');
      sf('bold', 6.6, OLIVE, 1.2); const labelW = doc.getTextWidth(label.toUpperCase());
      sf('normal', 9, INK); const valueW = doc.getTextWidth(text);
      const chipW = Math.min(CW, Math.max(labelW, valueW) + CHIP_PAD * 2);
      if (chipX + chipW > M + CW) { chipX = M; chipRowY += CHIP_H + CHIP_GAP; }
      doc.setDrawColor(...HAIR); doc.setLineWidth(.7);
      doc.rect(chipX, chipRowY, chipW, CHIP_H, 'S');
      sf('bold', 6.6, OLIVE, 1.2); doc.text(label.toUpperCase(), chipX + CHIP_PAD, chipRowY + sp(12));
      sf('normal', 9, INK); doc.text(text, chipX + CHIP_PAD, chipRowY + sp(24));
      chipX += chipW + CHIP_GAP;
    });
    y = chipRowY + CHIP_H + sp(24);

    // ── Pergunta contextual ──────────────────────────────────────
    if (contextual) {
      sec('Ponto de atenção da sua modalidade');
      const contextualText = [contextual.hook, contextual.text, contextual.flagInvitation, contextual.safeguard]
        .filter(Boolean).join(' ');
      sf('normal', 8.6, BODY);
      const lines = doc.splitTextToSize(contextualText, CW - sp(16));
      ensureSp(lines.length * sp(11) + sp(14));
      doc.setFillColor(...HAIR); doc.rect(M, y - sp(7), 2, lines.length * sp(11) + sp(4), 'F');
      doc.text(lines, M + sp(16), y);
      y += lines.length * sp(11) + sp(22);
    }

    // ── Fatores mentais ──────────────────────────────────────────
    sec('Fatores mentais acompanhados');
    const factorRows = factors.map(factor => {
      sf('normal', 7.6, MUTED);
      const insightLines = doc.splitTextToSize(factor.insight, CW);
      return {
        ...factor, insightLines,
        height: sp(11) + sp(12) + insightLines.length * sp(9.6) + sp(7),
      };
    });
    const factorsHeight = factorRows.reduce((t, i) => t + i.height, 0);
    // Distribui a sobra da primeira página entre os fatores, com teto —
    // sem esticar o suficiente para empurrar seções para uma 3ª página.
    const factorExtraSpacing = Math.max(0, Math.min(
      sp(12),
      (BOTTOM - y - factorsHeight) / Math.max(factorRows.length - 1, 1),
    ));
    factorRows.forEach(({ name, known, percent, insightLines, height }, index) => {
      ensureSp(height);
      sf('bold', 9, INK, .1); doc.text(name, M, y);
      if (known) {
        sf('bold', 9, OLIVE_D, .3);
        doc.text(`${Math.round(percent)}%`, M + CW, y, { align: 'right' });
      }
      y += sp(11);
      if (known) factorBar(percent);
      else {
        sf('italic', 7.6, MUTED);
        doc.text('Sem evidência direta nesta dimensão.', M, y);
        y += sp(12);
      }
      sf('normal', 7.6, MUTED);
      doc.text(insightLines, M, y);
      y += insightLines.length * sp(9.6) + sp(7);
      if (index < factorRows.length - 1) y += factorExtraSpacing;
    });

    // ── Página 2: leitura do perfil, CTA e anexo ─────────────────
    if (doc.getNumberOfPages() === 1) { doc.addPage(); y = M; }

    const cardList = (items, accent) => {
      items.forEach(item => {
        sf('normal', 8.4, BODY);
        const lines = doc.splitTextToSize(item.text, CW - sp(30));
        const cardH = sp(22) + lines.length * sp(10.4);
        ensureSp(cardH + sp(7));
        doc.setFillColor(...TINT); doc.rect(M, y, CW, cardH, 'F');
        doc.setFillColor(...accent); doc.rect(M, y, sp(2.6), cardH, 'F');
        sf('bold', 8.4, accent === TERRA ? TERRA : OLIVE_D, .2);
        doc.text(item.title, M + sp(17), y + sp(15));
        sf('normal', 8.4, BODY); doc.text(lines, M + sp(17), y + sp(28));
        y += cardH + sp(7);
      });
      y += sp(6);
    };

    if (profileFields) {
      sec('O que joga a seu favor');
      cardList(profileFields.forces, OLIVE);
      sec('O que merece atenção');
      cardList(profileFields.vulns, TERRA);
    }

    if (prof) {
      sec('O que pode valer observar agora');
      observations.forEach((item, index) => {
        sf('normal', 8.4, BODY);
        const lines = doc.splitTextToSize(item, CW - sp(22));
        ensureSp(lines.length * sp(10.4) + sp(8));
        sf('bold', 10, TERRA, .3);
        doc.text(String(index + 1).padStart(2, '0'), M, y);
        sf('normal', 8.4, BODY);
        doc.text(lines, M + sp(22), y);
        y += lines.length * sp(10.4) + sp(9);
      });
      y += sp(8);
    }

    // ── CTA — antes do anexo ─────────────────────────────────────
    const ctaTxt = (prof ? prof.cta : 'Fala comigo pelo WhatsApp para uma análise aprofundada do seu perfil.');
    sf('normal', 8.4, PANEL_TX);
    const ctaLines = doc.splitTextToSize(ctaTxt, CW - sp(40));
    const CTA_BTN_H = sp(28);
    const ctaH = sp(44) + ctaLines.length * sp(10.4) + CTA_BTN_H + sp(18);
    ensureSp(ctaH + sp(16));
    doc.setFillColor(...PANEL); doc.rect(M, y, CW, ctaH, 'F');
    sf('bold', 7, [168, 180, 127], 1.6); doc.text('PRÓXIMO PASSO', M + sp(20), y + sp(20));
    sf('bold', 13, [255, 255, 255], .2); doc.text('O próximo passo é uma conversa.', M + sp(20), y + sp(39));
    sf('normal', 8.4, PANEL_TX); doc.text(ctaLines, M + sp(20), y + sp(55));
    const btnY = y + sp(55) + ctaLines.length * sp(10.4) + sp(8);
    doc.setFillColor(...TERRA); doc.rect(M + sp(20), btnY, CW - sp(40), CTA_BTN_H, 'F');
    sf('bold', 8.4, [255, 255, 255], 1);
    doc.text('wa.me/5544988433895   ·   @nicolasartigas.psico', M + sp(34), btnY + CTA_BTN_H / 2 + sp(3));
    y += ctaH + sp(22);

    // ── Anexo — registro das respostas (depois do CTA) ───────────
    sec('Anexo · Registro das suas respostas');
    sf('normal', 7, MUTED);
    const axL = doc.splitTextToSize('Registro compacto para retomar as respostas em uma conversa.', CW);
    ensureSp(axL.length * sp(8) + sp(8));
    doc.text(axL, M, y); y += axL.length * sp(8) + sp(10);

    const colW = (CW - sp(18)) / 2;
    const aFs = 6.8;
    const aLh = sp(7.8);
    const answerRows = answers.map(({ question, response }) => {
      sf('bold', aFs, INK);
      const questionLines = doc.splitTextToSize(question, colW);
      sf('normal', aFs, MUTED);
      const responseLines = doc.splitTextToSize(response, colW - sp(8));
      return {
        questionLines, responseLines,
        height: (questionLines.length + responseLines.length) * aLh + sp(9),
      };
    });
    for (let i = 0; i < answerRows.length; i += 2) {
      const left = answerRows[i];
      const right = answerRows[i + 1];
      const rowHeight = Math.max(left.height, right?.height || 0);
      ensureSp(rowHeight);
      [left, right].filter(Boolean).forEach((item, column) => {
        const x = M + column * (colW + sp(18));
        sf('bold', aFs, INK);
        doc.text(item.questionLines, x, y);
        const respY = y + item.questionLines.length * aLh + sp(2);
        doc.setFillColor(...HAIR);
        doc.rect(x, respY - sp(5.5), 1.4, item.responseLines.length * aLh, 'F');
        sf('normal', aFs, MUTED);
        doc.text(item.responseLines, x + sp(7), respY);
      });
      y += rowHeight;
    }
    y += sp(8);

    // ── Rodapé legal ─────────────────────────────────────────────
    sf('normal', 6.4, FAINT);
    const ftLines = doc.splitTextToSize('Este documento é uma ferramenta educativa de autoconhecimento sobre fatores mentais no esporte e não constitui diagnóstico clínico, avaliação psicológica formal ou prescrição de tratamento. Os padrões descritos refletem o momento da aplicação e não são rótulo fixo nem traço permanente. Se alguma situação estiver causando sofrimento importante ou prejudicando sua vida, procure apoio profissional. Em risco imediato, procure um serviço local de urgência. Desenvolvido por Nicolas Artigas, Psicólogo do Esporte (CRP 08/45704), com fins educativos e de orientação.', CW);
    ensureSp(ftLines.length * sp(7.4) + sp(14));
    doc.setFillColor(...HAIR); doc.rect(M, y, CW, .7, 'F');
    y += sp(11);
    doc.text(ftLines, M, y);
    y += ftLines.length * sp(7.4);
    if (y > BOTTOM) overflow = true;

    // ── Numeração ────────────────────────────────────────────────
    const tp = doc.getNumberOfPages();
    for (let i = 1; i <= tp; i++) {
      doc.setPage(i);
      doc.setFillColor(...HAIR); doc.rect(M, H - 34, CW, .7, 'F');
      sf('normal', 6.6, FAINT, .2);
      doc.text(`Mapa Mental do Atleta · ${athleteName} · ${dateStr}`, M, H - 22);
      sf('bold', 6.6, OLIVE, .6);
      doc.text(`${i} / ${tp}`, W - M, H - 22, { align: 'right' });
    }

    return { doc, overflow: overflow || tp > MAX_PAGES };
  }

  try {
    // Redesenha mais compacto até caber em 2 páginas. O primeiro passe é o
    // layout "cheio"; os seguintes só apertam tipografia e respiros.
    let result = null;
    for (const k of [1, .94, .88, .82, .76, .7]) {
      result = draw(k);
      if (!result.overflow) break;
    }
    result.doc.save(`tipo-mental-atleta-${filenameSlug}.pdf`);
  } catch (e) { console.error(e); alert('Erro ao gerar PDF. Tente novamente.'); }
}