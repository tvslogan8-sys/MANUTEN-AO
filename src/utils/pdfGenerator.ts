import { jsPDF } from 'jspdf';
import { TechnicalReport } from '../types/diagnosis';

export function generateReportPDF(report: TechnicalReport): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  function checkPageBreak(spaceNeeded: number) {
    if (y + spaceNeeded > pageHeight - 16) {
      doc.addPage();
      y = margin;
      drawPageHeaderMini();
    }
  }

  function drawPageHeaderMini() {
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(margin, y, contentWidth, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(56, 189, 248); // sky-400
    doc.text(`DRIVEMASTER AI | LAUDO TÉCNICO PERICIAL - ${report.reportCode}`, margin + 3, y + 5.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text(`Equipamento: ${report.manufacturer} ${report.model}`, pageWidth - margin - 3, y + 5.5, { align: 'right' });
    y += 12;
  }

  // --- HEADER / TIMBRE TÉCNICO ---
  doc.setFillColor(15, 23, 42); // #0f172a
  doc.rect(margin, y, contentWidth, 24, 'F');

  // Cyan brand accent bar
  doc.setFillColor(14, 165, 233); // #0ea5e9
  doc.rect(margin, y, 4, 24, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text('DRIVEMASTER AI', margin + 8, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(56, 189, 248);
  doc.text('SISTEMA ESPECIALISTA PERICIAL EM INVERSORES DE FREQUÊNCIA', margin + 8, y + 13);

  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Fidelidade aos Manuais Oficiais • Conformidade com NR-10 • Análise de Falhas Elétricas', margin + 8, y + 18);

  // Report code & emission date
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text(report.reportCode, pageWidth - margin - 6, y + 8, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  const formattedDate = new Date(report.createdAt).toLocaleString('pt-BR');
  doc.text(`Emissão: ${formattedDate}`, pageWidth - margin - 6, y + 13, { align: 'right' });
  doc.text(`Motor IA: ${report.engineMeta.source} (T=0.15)`, pageWidth - margin - 6, y + 18, { align: 'right' });

  y += 28;

  // --- IDENTIFICAÇÃO DO EQUIPAMENTO E CLASSIFICAÇÃO ---
  doc.setFillColor(241, 245, 249); // slate-100
  doc.setDrawColor(203, 213, 225); // slate-300
  doc.roundedRect(margin, y, contentWidth, 22, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text('FABRICANTE / MODELO:', margin + 4, y + 6);
  doc.text('CÓDIGO CONSULTADO:', margin + 70, y + 6);
  doc.text('CRITICIDADE OPERACIONAL:', margin + 125, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(`${report.manufacturer} - ${report.model}`, margin + 4, y + 12);
  doc.text(`${report.queryCode} (${report.queryType})`, margin + 70, y + 12);

  // Criticality badge
  const isCrit = report.criticality.includes('Crítico');
  if (isCrit) {
    doc.setFillColor(239, 68, 68); // red-500
    doc.setTextColor(255, 255, 255);
  } else {
    doc.setFillColor(245, 158, 11); // amber-500
    doc.setTextColor(0, 0, 0);
  }
  doc.roundedRect(margin + 125, y + 8, 45, 6, 1, 1, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text(report.criticality.toUpperCase(), margin + 127, y + 12.5);

  // Official nomenclature line
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(14, 165, 233);
  doc.text(`Nomenclatura Oficial: ${report.officialNomenclature}`, margin + 4, y + 18);

  y += 26;

  // --- RESUMO EXECUTIVO ---
  checkPageBreak(25);
  doc.setFillColor(15, 23, 42);
  doc.rect(margin, y, contentWidth, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text('1. SÍNTESE DO DIAGNÓSTICO E IMPACTO TÉCNICO', margin + 3, y + 4.2);
  y += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  const summaryLines = doc.splitTextToSize(report.shortSummary, contentWidth - 4);
  doc.text(summaryLines, margin + 2, y);
  y += summaryLines.length * 4 + 4;

  // Context tags if present
  if (report.operationalContext && (report.operationalContext.voltage || report.operationalContext.loadType || report.operationalContext.faultMoment)) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    let ctxText = 'Condições Informadas: ';
    if (report.operationalContext.voltage) ctxText += `[Tensão: ${report.operationalContext.voltage}] `;
    if (report.operationalContext.loadType) ctxText += `[Carga: ${report.operationalContext.loadType}] `;
    if (report.operationalContext.faultMoment) ctxText += `[Momento: ${report.operationalContext.faultMoment}] `;
    doc.text(ctxText, margin + 2, y);
    y += 6;
  }

  // --- SEÇÃO NR-10 E SEGURANÇA OBRIGATÓRIA ---
  checkPageBreak(38);
  doc.setFillColor(254, 242, 242); // red-50
  doc.setDrawColor(248, 113, 113); // red-400
  doc.roundedRect(margin, y, contentWidth, 34, 1.5, 1.5, 'FD');

  doc.setFillColor(220, 38, 38); // red-600
  doc.rect(margin, y, 4, 34, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(185, 28, 28);
  doc.text(`AVISOS CRUCIAIS DE SEGURANÇA (NR-10) • DESCARGA DO BARRAMENTO CC: ${report.nr10Safety.dcBusDischargeTimeMinutes} MINUTOS`, margin + 8, y + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(127, 29, 29);
  doc.text(`Limite seguro de tensão antes de toque: ${report.nr10Safety.dcBusSafeVoltageThreshold}`, margin + 8, y + 10);

  // Cautions
  let cautionY = y + 15;
  report.nr10Safety.criticalCautions.slice(0, 2).forEach((c) => {
    const cLines = doc.splitTextToSize(`• ${c}`, contentWidth - 14);
    doc.text(cLines, margin + 8, cautionY);
    cautionY += cLines.length * 3.5;
  });

  // LOTO summary
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.2);
  doc.setTextColor(153, 27, 27);
  doc.text(`Procedimento LOTO Obrigatório: Desenergização total, travamento com cadeado e medição em bornes DC+/DC-.`, margin + 8, y + 30);

  y += 38;

  // --- CAUSAS RAIZ ANALÍTICAS (4 QUADRANTES) ---
  checkPageBreak(40);
  doc.setFillColor(15, 23, 42);
  doc.rect(margin, y, contentWidth, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text('2. ANÁLISE DETALHADA DA CAUSA RAIZ POR ORIGEM', margin + 3, y + 4.2);
  y += 8;

  const quadrants = [
    { title: 'A. ORIGEM ELÉTRICA / REDE', data: report.rootCauses.electricalGrid },
    { title: 'B. ORIGEM MECÂNICA / CARGA', data: report.rootCauses.mechanicalLoad },
    { title: 'C. ORIGEM CABEAMENTO / MOTOR', data: report.rootCauses.motorCabling },
    { title: 'D. ORIGEM INTERNA DO INVERSOR', data: report.rootCauses.internalDrive },
  ];

  quadrants.forEach((q) => {
    checkPageBreak(20);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(14, 165, 233);
    doc.text(q.title, margin + 2, y);
    y += 4;

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    const sumLines = doc.splitTextToSize(q.data.summary, contentWidth - 4);
    doc.text(sumLines, margin + 2, y);
    y += sumLines.length * 3.5 + 1.5;

    q.data.items.slice(0, 2).forEach((item) => {
      checkPageBreak(12);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.2);
      doc.setTextColor(30, 41, 59);
      doc.text(`- ${item.title} [Probabilidade: ${item.probability}]`, margin + 4, y);
      y += 3.5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(51, 65, 85);
      const descLines = doc.splitTextToSize(`  Método de Teste: ${item.testMethod}`, contentWidth - 8);
      doc.text(descLines, margin + 4, y);
      y += descLines.length * 3.2 + 2;
    });
    y += 1.5;
  });

  // --- PLANO DE AÇÃO OPERACIONAL E MEDIÇÕES ---
  checkPageBreak(40);
  doc.setFillColor(15, 23, 42);
  doc.rect(margin, y, contentWidth, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text('3. PLANO DE AÇÃO CORRETIVA E MEDIÇÕES OPERACIONAIS', margin + 3, y + 4.2);
  y += 8;

  report.actionPlan.forEach((step) => {
    checkPageBreak(18);
    doc.setFillColor(248, 250, 252); // slate-50
    doc.setDrawColor(226, 232, 240);
    const boxHeight = step.measurementGuide ? 16 : 9;
    doc.roundedRect(margin, y, contentWidth, boxHeight, 1, 1, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(14, 165, 233);
    doc.text(`PASSO ${step.step} [${step.phase.toUpperCase()}]:`, margin + 3, y + 4);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.2);
    doc.setTextColor(30, 41, 59);
    const actionLines = doc.splitTextToSize(step.action, contentWidth - 6);
    doc.text(actionLines, margin + 3, y + 7.5);

    if (step.measurementGuide) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.8);
      doc.setTextColor(15, 118, 110);
      const measText = `Instrumento: ${step.measurementGuide.instrument} | Faixa Esperada: ${step.measurementGuide.expectedRange}`;
      doc.text(measText, margin + 3, y + 11.5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(71, 85, 105);
      const procLines = doc.splitTextToSize(`Procedimento: ${step.measurementGuide.procedure}`, contentWidth - 6);
      doc.text(procLines[0] || '', margin + 3, y + 14.5);
    }

    y += boxHeight + 2.5;
  });

  // --- PARÂMETROS RELACIONADOS PARA CHECAGEM ---
  checkPageBreak(35);
  doc.setFillColor(15, 23, 42);
  doc.rect(margin, y, contentWidth, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text('4. PARÂMETROS ESPECÍFICOS DO MANUAL PARA AJUSTE OU CHECAGEM', margin + 3, y + 4.2);
  y += 8;

  // Table header
  doc.setFillColor(226, 232, 240); // slate-200
  doc.rect(margin, y, contentWidth, 5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(30, 41, 59);
  doc.text('CÓDIGO', margin + 3, y + 3.5);
  doc.text('PARÂMETRO / FUNÇÃO', margin + 25, y + 3.5);
  doc.text('AÇÃO RECOMENDADA', margin + 85, y + 3.5);
  doc.text('RELEVÂNCIA', margin + 145, y + 3.5);
  y += 6;

  report.relatedParameters.slice(0, 5).forEach((p) => {
    checkPageBreak(9);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(14, 165, 233);
    doc.text(p.code, margin + 3, y + 3);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(30, 41, 59);
    doc.text(p.name.slice(0, 35), margin + 25, y + 3);

    const actionText = p.suggestedCheck.slice(0, 42);
    doc.text(actionText, margin + 85, y + 3);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text(p.relevance.slice(0, 20), margin + 145, y + 3);

    // separator line
    doc.setDrawColor(241, 245, 249);
    doc.line(margin, y + 4.5, margin + contentWidth, y + 4.5);
    y += 5.5;
  });

  // --- RECOMENDAÇÕES PREVENTIVAS ---
  checkPageBreak(25);
  doc.setFillColor(15, 23, 42);
  doc.rect(margin, y, contentWidth, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text('5. RECOMENDAÇÕES E DIRETRIZES PREVENTIVAS', margin + 3, y + 4.2);
  y += 8;

  report.preventiveRecommendations.slice(0, 4).forEach((rec) => {
    checkPageBreak(8);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.2);
    doc.setTextColor(51, 65, 85);
    const recLines = doc.splitTextToSize(`• ${rec}`, contentWidth - 4);
    doc.text(recLines, margin + 2, y);
    y += recLines.length * 3.5 + 1;
  });

  // --- ASSINATURA DO RESPONSÁVEL TÉCNICO ---
  checkPageBreak(35);
  y += 4;
  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, y, contentWidth, 26, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(30, 41, 59);
  doc.text('TERMO DE RESPONSABILIDADE TÉCNICA E HOMOLOGAÇÃO:', margin + 4, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  const techName = report.technicianData?.name || 'Técnico / Engenheiro Eletricista';
  const techReg = report.technicianData?.register || 'Registro CREA / CFT pendente';
  const comp = report.technicianData?.company || 'Planta Industrial';

  doc.text(`Responsável: ${techName}`, margin + 4, y + 10);
  doc.text(`Registro: ${techReg}`, margin + 4, y + 14);
  doc.text(`Unidade / Empresa: ${comp}`, margin + 4, y + 18);
  doc.text(`Autenticidade: Certificado emitido via DriveMaster AI Motor Industrial`, margin + 4, y + 22);

  // Signature line
  doc.setDrawColor(100, 116, 139);
  doc.line(pageWidth - margin - 65, y + 17, pageWidth - margin - 5, y + 17);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(71, 85, 105);
  doc.text('Assinatura do Responsável Técnico', pageWidth - margin - 35, y + 21, { align: 'center' });

  // Save PDF
  const filename = `${report.reportCode}_${report.manufacturer}_${report.model}_Diagnostico.pdf`.replace(/\s+/g, '_');
  doc.save(filename);
}
