// Formatação do relatório em PDF — desenho manual com jsPDF.
// Recebe apenas dados já resolvidos (ver `buildReportData` em quiz-engine.js);
// não conhece perguntas, pontuação ou perfis. Trocar o layout aqui não deve
// exigir tocar no motor do quiz, e vice-versa.

export function generatePdfReport(data) {
  if (!window.jspdf || !window.jspdf.jsPDF) { alert('Aguarde o carregamento e tente novamente.'); return; }

  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const W = doc.internal.pageSize.getWidth();
    const H = doc.internal.pageSize.getHeight();
    const M = 50; const CW = W - M * 2;
    let y = M;

    const C_TEAL = [110, 140, 58]; const C_DARK = [15, 18, 10]; const C_GRAY = [110, 118, 100];
    const C_LGRAY = [231, 235, 222]; const C_ORANGE = [220, 95, 40]; const C_GREEN = [168, 185, 145];
    const C_T2 = [80, 88, 70]; const C_TEXT = [237, 240, 228];

    const ensureSp = (n) => { if (y + n > H - M) { doc.addPage(); y = M; } };
    const sf = (style, size, color) => { doc.setFont('helvetica', style); doc.setFontSize(size); doc.setTextColor(...(color || C_DARK)); };
    const div = (color) => { doc.setDrawColor(...(color || C_LGRAY)); doc.setLineWidth(.5); doc.line(M, y, W - M, y); y += 14; };
    const sec = (label) => { ensureSp(28); sf('bold', 8, C_TEAL); doc.text(label.toUpperCase(), M, y); y += 5; div(C_TEAL); };
    const factorBar = (percent) => {
      const height = 6;
      const width = Math.max(0, Math.min(1, percent / 100)) * CW;
      doc.setFillColor(...C_LGRAY); doc.roundedRect(M, y, CW, height, 3, 3, 'F');
      if (width > 0) {
        const startColor = C_ORANGE;
        const endColor = C_GREEN;
        doc.setFillColor(...startColor); doc.roundedRect(M, y, width, height, 3, 3, 'F');
        // jsPDF não oferece degradê nativo: desenhamos faixas finas. Um mínimo
        // alto mantém a transição visível até na barra mínima de 4%.
        const steps = Math.max(16, Math.ceil(width / 2));
        for (let step = 0; step < steps; step++) {
          const ratio = step / Math.max(steps - 1, 1);
          const color = startColor.map((channel, index) => Math.round(channel + (endColor[index] - channel) * ratio));
          doc.setFillColor(...color);
          doc.rect(M + (width * step / steps), y, (width / steps) + .5, height, 'F');
        }
        if (width > height) {
          doc.setFillColor(...endColor); doc.roundedRect(M + width - height, y, height, height, 3, 3, 'F');
        }
      }
      y += 14;
    };

    const { prof, profileFields, athleteName, dateStr, sportLabel, levelLabel, goalLabel, contextual, factors, observations, answers, filenameSlug } = data;

    // Header bar
    doc.setFillColor(...C_TEAL); doc.rect(0, 0, W, 5, 'F');
    y = M + 10;
    sf('bold', 10, C_TEAL); doc.text('MAPA MENTAL DO ATLETA  ·  RELATÓRIO EDUCATIVO', M, y); y += 14;
    sf('normal', 8, C_GRAY); doc.text(`Gerado em ${dateStr}  ·  Nicolas Artigas · Psicólogo do Esporte · CRP 08/45704`, M, y); y += 6; div();

    // Perfil mental: primeiro elemento do relatório.
    if (prof) {
      ensureSp(82);
      doc.setFillColor(16, 19, 10); doc.roundedRect(M, y, CW, 72, 4, 4, 'F');
      doc.setFillColor(...C_TEAL); doc.roundedRect(M, y, CW, 3, 2, 2, 'F');
      sf('bold', 8, [143, 174, 78]); doc.text(prof.type, M + 14, y + 16);
      sf('bold', 16, C_TEXT); doc.text(prof.name, M + 14, y + 33);
      sf('italic', 9, [140, 155, 148]);
      const eLines = doc.splitTextToSize(prof.essence, CW - 28); doc.text(eLines, M + 14, y + 46);
      y += 82;
      if (prof.partial) {
        sf('normal', 8, C_GRAY);
        const partialLines = doc.splitTextToSize(prof.partialReason, CW);
        ensureSp(partialLines.length * 11 + 8); doc.text(partialLines, M, y); y += partialLines.length * 11 + 8;
      }
    }

    // Atleta e escolhas: cada escolha fica em uma linha para evitar estouro visual.
    ensureSp(52);
    sf('bold', 8, C_TEAL); doc.text('ATLETA', M, y); y += 18;
    sf('bold', 18, C_DARK); doc.text(athleteName, M, y); y += 22;

    sec('Suas escolhas');
    [
      ['Modalidade', sportLabel],
      ['Nível', levelLabel],
      ['Objetivo', goalLabel],
    ].forEach(([label, value]) => {
      const valueLines = doc.splitTextToSize(value || '—', CW - 78);
      const rowHeight = Math.max(valueLines.length * 12, 14);
      ensureSp(rowHeight + 6);
      sf('bold', 8, C_GRAY); doc.text(`${label}:`, M, y);
      sf('normal', 9, C_DARK);
      doc.text(valueLines, M + 78, y); y += rowHeight;
    });
    // Respiro visual entre as escolhas do atleta e a leitura da modalidade.
    y += 28;

    // Pergunta contextual: vem depois do perfil e antes dos fatores.
    if (contextual) {
      sec('Ponto de atenção da sua modalidade');
      y += 6;
      const contextualText = [contextual.hook, contextual.text, contextual.flagInvitation, contextual.safeguard]
        .filter(Boolean)
        .join(' ');
      sf('normal', 9, C_T2);
      const lines = doc.splitTextToSize(contextualText, CW);
      ensureSp(lines.length * 12 + 7);
      doc.text(lines, M, y);
      // Separa a leitura contextual dos fatores mentais que vêm a seguir.
      y += lines.length * 12 + 27;
    }

    // Fatores: a barra traduz a mesma proporção exibida na tela de resultado.
    sec('Fatores mentais acompanhados');
    const factorAvailableHeight = H - M - y;
    let factorTitleSize = 9;
    let factorTitleHeight = 10;
    let factorInsightSize = 8;
    let factorInsightLineHeight = 11;
    let factorInsightPadding = 8;
    const makeFactorRows = () => factors.map(factor => {
      sf('normal', factorInsightSize, C_GRAY);
      const insightLines = doc.splitTextToSize(factor.insight, CW);
      return { ...factor, insightLines, height: factorTitleHeight + 14 + insightLines.length * factorInsightLineHeight + factorInsightPadding };
    });
    let factorRows = makeFactorRows();
    let factorsHeight = factorRows.reduce((total, item) => total + item.height, 0);
    // Em leituras contextuais excepcionalmente longas, compacta só esta seção
    // para preservar os seis fatores na primeira página.
    if (factorsHeight > factorAvailableHeight) {
      factorTitleSize = 8;
      factorTitleHeight = 9;
      factorInsightSize = 6.5;
      factorInsightLineHeight = 8;
      factorInsightPadding = 5;
      factorRows = makeFactorRows();
      factorsHeight = factorRows.reduce((total, item) => total + item.height, 0);
    }
    const factorExtraSpacing = Math.max(0, (H - M - y - factorsHeight) / Math.max(factorRows.length - 1, 1));
    factorRows.forEach(({ name, known, percent, insightLines, height }, index) => {
      ensureSp(height);
      sf('bold', factorTitleSize, C_DARK); doc.text(name, M, y);
      y += factorTitleHeight;
      if (known) factorBar(percent);
      else {
        sf('italic', 8, C_GRAY);
        doc.text('Sem evidência direta nesta dimensão.', M, y);
        y += 14;
      }
      sf('normal', factorInsightSize, C_GRAY);
      doc.text(insightLines, M, y); y += insightLines.length * factorInsightLineHeight + factorInsightPadding;
      if (index < factorRows.length - 1) y += factorExtraSpacing;
    });

    // Forces
    if (profileFields) {
      // Esta seção abre a segunda página para que seus cartões não sejam divididos.
      if (doc.getNumberOfPages() === 1) { doc.addPage(); y = M; }
      sec('O que joga a seu favor');
      profileFields.forces.forEach(f => {
        ensureSp(36); sf('bold', 9, [34, 150, 80]); doc.text(f.title, M, y); y += 12;
        sf('normal', 9, C_T2); const lines = doc.splitTextToSize(f.text, CW - 10); ensureSp(lines.length * 12 + 6); doc.text(lines, M + 10, y); y += lines.length * 12 + 8;
      });
    }

    // Vulnerabilities
    if (profileFields) {
      sec('O que merece atenção');
      profileFields.vulns.forEach(v => {
        ensureSp(36); sf('bold', 9, [200, 80, 80]); doc.text(v.title, M, y); y += 12;
        sf('normal', 9, C_T2); const lines = doc.splitTextToSize(v.text, CW - 10); ensureSp(lines.length * 12 + 6); doc.text(lines, M + 10, y); y += lines.length * 12 + 8;
      });
    }

    // Observações presentes, sem projeção de futuro.
    if (prof) {
      sec('O que pode valer observar agora');
      observations.forEach((item, index) => {
        sf('normal', 9, C_T2);
        const lines = doc.splitTextToSize(`${index + 1}. ${item}`, CW);
        ensureSp(lines.length * 12 + 7);
        doc.text(lines, M, y);
        y += lines.length * 12 + 7;
      });
    }

    // Anexo — registro das respostas
    sec('Anexo · Registro das suas respostas');
    sf('normal', 7, C_GRAY);
    const axIntro = 'Registro compacto para retomar as respostas em uma conversa.';
    const axL = doc.splitTextToSize(axIntro, CW); ensureSp(axL.length * 8 + 6); doc.text(axL, M, y); y += axL.length * 8 + 6;
    const answerColumnWidth = (CW - 10) / 2;
    const answerFontSize = 7;
    const answerLineHeight = 8;
    const answerRows = answers.map(({ question, response }) => {
      sf('bold', answerFontSize, C_DARK);
      const questionLines = doc.splitTextToSize(question, answerColumnWidth);
      sf('normal', answerFontSize, C_T2);
      const responseLines = doc.splitTextToSize(response, answerColumnWidth);
      return { questionLines, responseLines, height: (questionLines.length + responseLines.length) * answerLineHeight + 8 };
    });
    const answerGroupCount = Math.ceil(answerRows.length / 2);
    const answerRowsHeight = answerRows.reduce((total, item, index) => {
      return total + (index % 2 === 0 ? Math.max(item.height, answerRows[index + 1]?.height || 0) : 0);
    }, 0);
    // Aproveita o espaço que ficaria vazio sem invadir o CTA e o rodapé.
    const answerExtraSpacing = Math.max(0, (H - M - y - answerRowsHeight - 4 - 90 - 65) / answerGroupCount);
    for (let i = 0; i < answerRows.length; i += 2) {
      const left = answerRows[i];
      const right = answerRows[i + 1];
      const rowHeight = Math.max(left.height, right?.height || 0) + answerExtraSpacing;
      ensureSp(rowHeight);
      [left, right].filter(Boolean).forEach((item, column) => {
        const x = M + column * (answerColumnWidth + 10);
        sf('bold', answerFontSize, C_DARK); doc.text(item.questionLines, x, y);
        sf('normal', answerFontSize, C_T2); doc.text(item.responseLines, x, y + item.questionLines.length * answerLineHeight);
      });
      y += rowHeight;
    }
    y += 4;

    // CTA
    ensureSp(90);
    doc.setFillColor(16, 19, 10); doc.roundedRect(M, y, CW, 78, 4, 4, 'F');
    doc.setFillColor(...C_TEAL); doc.roundedRect(M, y, CW, 3, 2, 2, 'F');
    sf('bold', 13, C_TEXT); doc.text('O próximo passo é uma conversa.', M + 14, y + 20);
    sf('normal', 9, [140, 155, 148]);
    const ctaTxt = (prof ? prof.cta : 'Fala comigo pelo WhatsApp para uma análise aprofundada do seu perfil.');
    const ctaLines = doc.splitTextToSize(ctaTxt, CW - 28); doc.text(ctaLines, M + 14, y + 35);
    sf('bold', 9, C_TEAL); doc.text('wa.me/5544988433895  ·  @nicolasartigas.psico', M + 14, y + 66);
    y += 90;

    // Footer
    ensureSp(40); y += 10; div();
    sf('normal', 7.5, C_GRAY);
    const ftLines = doc.splitTextToSize('Este documento é uma ferramenta educativa de autoconhecimento sobre fatores mentais no esporte e não constitui diagnóstico clínico, avaliação psicológica formal ou prescrição de tratamento. Os padrões descritos refletem o momento da aplicação e não são rótulo fixo nem traço permanente. Se alguma situação estiver causando sofrimento importante ou prejudicando sua vida, procure apoio profissional. Em risco imediato, procure um serviço local de urgência. Desenvolvido por Nicolas Artigas, Psicólogo do Esporte (CRP 08/45704), com fins educativos e de orientação.', CW);
    doc.text(ftLines, M, y);

    // Page numbers
    const tp = doc.internal.getNumberOfPages();
    for (let i = 1; i <= tp; i++) {
      doc.setPage(i); doc.setFillColor(...C_TEAL); doc.rect(0, H - 3, W, 3, 'F');
      sf('normal', 7.5, C_GRAY);
      doc.text(`Mapa Mental do Atleta · ${athleteName} · ${dateStr}`, M, H - 10);
      doc.text(`${i} / ${tp}`, W - M, H - 10, { align: 'right' });
    }

    doc.save(`tipo-mental-atleta-${filenameSlug}.pdf`);
  } catch (e) { console.error(e); alert('Erro ao gerar PDF. Tente novamente.'); }
}
