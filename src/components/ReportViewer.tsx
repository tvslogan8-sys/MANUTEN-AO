import React, { useState } from 'react';
import {
  FileText,
  Download,
  Share2,
  Check,
  AlertOctagon,
  AlertTriangle,
  Info,
  ShieldAlert,
  Zap,
  Activity,
  Gauge,
  Sliders,
  CheckCircle2,
  Printer,
  Copy,
  PenTool,
  Clock,
  Layers,
  Thermometer,
  Wrench,
  Cpu,
  Network,
} from 'lucide-react';
import { TechnicalReport } from '../types/diagnosis';
import { generateReportPDF } from '../utils/pdfGenerator';
import { ConnectionDiagram } from './ConnectionDiagram';

interface ReportViewerProps {
  report: TechnicalReport;
  onSaveToHistory?: (report: TechnicalReport) => void;
  onNewSearch?: () => void;
}

export const ReportViewer: React.FC<ReportViewerProps> = ({
  report,
  onSaveToHistory,
  onNewSearch,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<'all' | 'rootCause' | 'actions' | 'safety' | 'params' | 'diagram'>('all');
  const [technicianName, setTechnicianName] = useState<string>(report.technicianData?.name || '');
  const [technicianRegister, setTechnicianRegister] = useState<string>(report.technicianData?.register || '');
  const [companyName, setCompanyName] = useState<string>(report.technicianData?.company || '');
  const [isSigned, setIsSigned] = useState<boolean>(Boolean(report.technicianData?.name));

  const isCritical = report.criticality.includes('Crítico');
  const isMedium = report.criticality.includes('Médio');

  const handleExportPDF = () => {
    // Inject any updated technician info
    const updatedReport: TechnicalReport = {
      ...report,
      technicianData: {
        name: technicianName,
        register: technicianRegister,
        company: companyName,
        signedAt: new Date().toISOString(),
      },
    };
    generateReportPDF(updatedReport);
  };

  const handleCopyMarkdown = () => {
    const text = `
# LAUDO TÉCNICO PERICIAL - DRIVEMASTER AI
Protocolo: ${report.reportCode}
Data: ${new Date(report.createdAt).toLocaleString('pt-BR')}
Equipamento: ${report.manufacturer} - ${report.model}
Consulta: ${report.queryCode} (${report.queryType})
Nomenclatura Oficial: ${report.officialNomenclature}
Criticidade: ${report.criticality} (Nota: ${report.criticalityScore}/10)

## Resumo Técnico:
${report.shortSummary}

## Segurança NR-10 & Link CC:
- Tempo mínimo de descarga: ${report.nr10Safety.dcBusDischargeTimeMinutes} minutos
- Limiar de tensão segura: ${report.nr10Safety.dcBusSafeVoltageThreshold}
- Bloqueio LOTO obrigatório: Desligamento geral + cadeado + verificação nos bornes DC+/DC-

## Ações Corretivas:
${report.actionPlan.map((s) => `${s.step}. [${s.phase}] ${s.action}`).join('\n')}

## Parâmetros Críticos:
${report.relatedParameters.map((p) => `- ${p.code} (${p.name}): ${p.suggestedCheck}`).join('\n')}

Responsável Técnico: ${technicianName || 'Não preenchido'} - ${technicianRegister || ''}
Emitido por DriveMaster AI Engine (T=0.15)
`.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Ribbon */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider">
                {report.reportCode}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-300">
                {new Date(report.createdAt).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Laudo Pericial: {report.manufacturer} {report.model} [{report.queryCode}]
            </h2>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={handleExportPDF}
            className="flex-1 md:flex-initial px-4 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold text-xs tracking-wide shadow-md shadow-sky-500/20 flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Exportar PDF (A4 Técnico)</span>
          </button>

          <button
            onClick={handleCopyMarkdown}
            className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs flex items-center space-x-1.5 border border-slate-700 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
            <span>{copied ? 'Copiado!' : 'Copiar Texto'}</span>
          </button>

          {onNewSearch && (
            <button
              onClick={onNewSearch}
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-xs border border-slate-700 transition-colors"
            >
              Nova Consulta
            </button>
          )}
        </div>
      </div>

      {/* Official Diagnostic Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-5 sm:p-6 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-1 rounded bg-slate-800 text-sky-400 text-xs font-mono font-semibold border border-slate-700">
                  {report.manufacturer}
                </span>
                <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-200 text-xs font-mono border border-slate-700">
                  Série: {report.model}
                </span>
                <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 text-xs font-mono border border-slate-700">
                  Código: <strong className="text-white">{report.queryCode}</strong>
                </span>
                <span className="text-xs text-slate-400">
                  ({report.queryType === 'fault' ? 'Falha de Trip' : report.queryType === 'alarm' ? 'Advertência' : 'Parâmetro'})
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-extrabold text-white font-mono tracking-tight flex items-center gap-2">
                <Zap className="w-6 h-6 text-sky-400" />
                <span>{report.officialNomenclature}</span>
              </h1>
            </div>

            {/* Criticality Rating Pill */}
            <div className="shrink-0 flex items-center space-x-3">
              <div
                className={`px-4 py-2.5 rounded-xl border flex items-center space-x-2.5 ${
                  isCritical
                    ? 'bg-red-950/60 border-red-700/80 text-red-300 shadow-lg shadow-red-950/40'
                    : isMedium
                      ? 'bg-amber-950/60 border-amber-700/80 text-amber-300'
                      : 'bg-emerald-950/60 border-emerald-700/80 text-emerald-300'
                }`}
              >
                {isCritical ? (
                  <AlertOctagon className="w-5 h-5 text-red-400 animate-pulse" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                )}
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-wider opacity-80">
                    Nível de Criticidade
                  </div>
                  <div className="text-xs sm:text-sm font-bold font-mono">
                    {report.criticality.toUpperCase()} (Gravidade {report.criticalityScore}/10)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Short Executive Summary */}
          <div className="pt-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center space-x-1.5">
              <Info className="w-3.5 h-3.5 text-sky-400" />
              <span>Síntese Técnica do Evento</span>
            </h3>
            <p className="text-sm text-slate-200 leading-relaxed font-sans">
              {report.shortSummary}
            </p>

            {/* Operational Context tags */}
            {report.operationalContext && (
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                {report.operationalContext.voltage && (
                  <span className="px-2.5 py-1 rounded bg-slate-950 text-slate-300 border border-slate-800">
                    Linha: <strong className="text-sky-300">{report.operationalContext.voltage}</strong>
                  </span>
                )}
                {report.operationalContext.loadType && (
                  <span className="px-2.5 py-1 rounded bg-slate-950 text-slate-300 border border-slate-800">
                    Carga: <strong className="text-sky-300">{report.operationalContext.loadType}</strong>
                  </span>
                )}
                {report.operationalContext.faultMoment && (
                  <span className="px-2.5 py-1 rounded bg-slate-950 text-slate-300 border border-slate-800">
                    Momento: <strong className="text-sky-300">{report.operationalContext.faultMoment}</strong>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* NR-10 Safety Callout (High Priority) */}
      <div className="bg-red-950/40 border-2 border-red-700/60 rounded-xl p-5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-red-600" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-red-800/40 pb-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-[11px] font-mono font-bold tracking-widest text-red-400 uppercase">
                PROTOCOLO OBRIGATÓRIO DE SEGURANÇA ELÉTRICA • NR-10
              </span>
              <h3 className="text-base font-bold text-white">
                Descarga dos Capacitores do Barramento CC (Link DC)
              </h3>
            </div>
          </div>

          <div className="flex items-center space-x-4 bg-slate-950/80 px-4 py-2.5 rounded-lg border border-red-800/50">
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-mono">Tempo Mínimo de Espera</div>
              <div className="text-lg font-bold text-red-400 font-mono flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{report.nr10Safety.dcBusDischargeTimeMinutes} Minutos</span>
              </div>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-mono">Tensão Máxima Segura</div>
              <div className="text-sm font-bold text-amber-400 font-mono">
                {report.nr10Safety.dcBusSafeVoltageThreshold}
              </div>
            </div>
          </div>
        </div>

        {/* Cautions and LOTO */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
          {/* LOTO Procedure */}
          <div className="bg-slate-950/60 p-3.5 rounded-lg border border-red-900/40">
            <h4 className="font-bold text-slate-200 mb-2 flex items-center gap-1.5 text-red-300">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Sequência LOTO (Bloqueio & Etiquetagem):</span>
            </h4>
            <ol className="space-y-1.5 text-slate-300 pl-4 list-decimal">
              {report.nr10Safety.lotoProcedure.map((step, idx) => (
                <li key={idx} className="leading-snug">
                  {step}
                </li>
              ))}
            </ol>
          </div>

          {/* Mandatory PPE & Alerts */}
          <div className="bg-slate-950/60 p-3.5 rounded-lg border border-red-900/40 space-y-3">
            <div>
              <h4 className="font-bold text-slate-200 mb-1.5 text-amber-300">
                EPIs Obrigatórios para Intervenção:
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {report.nr10Safety.mandatoryPPE.map((ppe, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700 text-[11px]"
                  >
                    ✓ {ppe}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-red-400 mb-1">Alertas Críticos:</h4>
              <ul className="space-y-1 text-slate-300 text-[11px]">
                {report.nr10Safety.criticalCautions.map((caution, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 text-red-200">
                    <span className="text-red-400 font-bold shrink-0">⚠</span>
                    <span>{caution}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Section Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveSection('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeSection === 'all'
              ? 'bg-sky-500 text-white shadow'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          Visão Geral Completa
        </button>
        <button
          onClick={() => setActiveSection('rootCause')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeSection === 'rootCause'
              ? 'bg-sky-500 text-white shadow'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          Causas Raiz (4 Origens)
        </button>
        <button
          onClick={() => setActiveSection('actions')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeSection === 'actions'
              ? 'bg-sky-500 text-white shadow'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          Plano de Ação & Medições
        </button>
        <button
          onClick={() => setActiveSection('params')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeSection === 'params'
              ? 'bg-sky-500 text-white shadow'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          Parâmetros do Modelo
        </button>
        <button
          onClick={() => setActiveSection('diagram')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
            activeSection === 'diagram'
              ? 'bg-sky-500 text-white shadow'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Network className="w-3.5 h-3.5 text-sky-400" />
          <span>Diagrama Elétrico ({report.model})</span>
        </button>
      </div>

      {/* BLOCO DE DIAGRAMA DE CONEXÃO SIMPLIFICADO */}
      {(activeSection === 'all' || activeSection === 'diagram') && (
        <ConnectionDiagram
          manufacturer={report.manufacturer}
          model={report.model}
          activeFaultCode={report.queryCode}
        />
      )}

      {/* BLOCO 1: CAUSA RAIZ DETALHADA (4 QUADRANTES) */}
      {(activeSection === 'all' || activeSection === 'rootCause') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2 font-mono">
              <Layers className="w-5 h-5 text-sky-400" />
              <span>Matriz Analítica de Causas Raiz por Origem</span>
            </h3>
            <span className="text-xs text-slate-400">
              Classificação investigativa de probabilidades
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Origem Elétrica / Rede */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-sky-400 uppercase flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-sky-400" />
                    Origem Elétrica / Rede
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800">
                    Alimentação
                  </span>
                </div>
                <p className="text-xs text-slate-300 mb-3 italic">
                  "{report.rootCauses.electricalGrid.summary}"
                </p>
                <div className="space-y-2.5">
                  {report.rootCauses.electricalGrid.items.map((item, idx) => (
                    <div key={idx} className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <strong className="text-white font-medium">{item.title}</strong>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                            item.probability === 'Alta'
                              ? 'bg-red-950 text-red-300'
                              : item.probability === 'Média'
                                ? 'bg-amber-950 text-amber-300'
                                : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          Probabilidade {item.probability}
                        </span>
                      </div>
                      <p className="text-slate-400 text-[11px] mb-1.5 leading-relaxed">{item.description}</p>
                      <div className="text-[11px] text-sky-400 bg-slate-900/60 p-1.5 rounded font-mono">
                        🔬 Teste: {item.testMethod}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Origem Mecânica / Carga */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-amber-400 uppercase flex items-center gap-1.5">
                    <Wrench className="w-4 h-4 text-amber-400" />
                    Origem Mecânica / Carga
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                    Eixo & Inércia
                  </span>
                </div>
                <p className="text-xs text-slate-300 mb-3 italic">
                  "{report.rootCauses.mechanicalLoad.summary}"
                </p>
                <div className="space-y-2.5">
                  {report.rootCauses.mechanicalLoad.items.map((item, idx) => (
                    <div key={idx} className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <strong className="text-white font-medium">{item.title}</strong>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                            item.probability === 'Alta'
                              ? 'bg-red-950 text-red-300'
                              : item.probability === 'Média'
                                ? 'bg-amber-950 text-amber-300'
                                : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          Probabilidade {item.probability}
                        </span>
                      </div>
                      <p className="text-slate-400 text-[11px] mb-1.5 leading-relaxed">{item.description}</p>
                      <div className="text-[11px] text-amber-400 bg-slate-900/60 p-1.5 rounded font-mono">
                        🔬 Teste: {item.testMethod}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Origem Cabeamento / Motor */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                    <Gauge className="w-4 h-4 text-emerald-400" />
                    Origem Cabeamento / Motor
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    Dielétrico & Bobinas
                  </span>
                </div>
                <p className="text-xs text-slate-300 mb-3 italic">
                  "{report.rootCauses.motorCabling.summary}"
                </p>
                <div className="space-y-2.5">
                  {report.rootCauses.motorCabling.items.map((item, idx) => (
                    <div key={idx} className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <strong className="text-white font-medium">{item.title}</strong>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                            item.probability === 'Alta'
                              ? 'bg-red-950 text-red-300'
                              : item.probability === 'Média'
                                ? 'bg-amber-950 text-amber-300'
                                : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          Probabilidade {item.probability}
                        </span>
                      </div>
                      <p className="text-slate-400 text-[11px] mb-1.5 leading-relaxed">{item.description}</p>
                      <div className="text-[11px] text-emerald-400 bg-slate-900/60 p-1.5 rounded font-mono">
                        🔬 Teste: {item.testMethod}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 4. Origem Interna do Inversor */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-indigo-400 uppercase flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-indigo-400" />
                    Origem Interna do Inversor
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                    IGBT, Link CC & Hall
                  </span>
                </div>
                <p className="text-xs text-slate-300 mb-3 italic">
                  "{report.rootCauses.internalDrive.summary}"
                </p>
                <div className="space-y-2.5">
                  {report.rootCauses.internalDrive.items.map((item, idx) => (
                    <div key={idx} className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <strong className="text-white font-medium">{item.title}</strong>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                            item.probability === 'Alta'
                              ? 'bg-red-950 text-red-300'
                              : item.probability === 'Média'
                                ? 'bg-amber-950 text-amber-300'
                                : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          Probabilidade {item.probability}
                        </span>
                      </div>
                      <p className="text-slate-400 text-[11px] mb-1.5 leading-relaxed">{item.description}</p>
                      <div className="text-[11px] text-indigo-400 bg-slate-900/60 p-1.5 rounded font-mono">
                        🔬 Teste: {item.testMethod}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BLOCO 2: PLANO DE AÇÃO CORRETIVA (PASSO A PASSO COM INSTRUMENTOS) */}
      {(activeSection === 'all' || activeSection === 'actions') && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2 font-mono">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Plano de Ação Corretiva (Sequência Lógica de Intervenção)</span>
              </h3>
              <p className="text-xs text-slate-400">
                Prioriza verificações não invasivas antes de desmontagens ou substituição de componentes.
              </p>
            </div>
            <span className="text-[11px] px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-mono">
              Total de Passos: {report.actionPlan.length}
            </span>
          </div>

          <div className="space-y-3">
            {report.actionPlan.map((step) => (
              <div
                key={step.step}
                className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 text-xs font-mono font-bold flex items-center justify-center border border-sky-500/40">
                      {step.step}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold uppercase ${
                        step.phase === 'Não Invasiva'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : step.phase === 'Medição com Instrumento'
                            ? 'bg-sky-950 text-sky-300 border border-sky-800'
                            : step.phase === 'Parametrização'
                              ? 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                              : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {step.phase}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-200 font-medium pl-8 mb-2">
                  {step.action}
                </p>

                {step.measurementGuide && (
                  <div className="ml-8 mt-2.5 p-3 rounded-lg bg-slate-900 border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">
                        Instrumento Recomendado:
                      </span>
                      <span className="font-semibold text-sky-300">
                        {step.measurementGuide.instrument}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">
                        Faixa / Valor Esperado:
                      </span>
                      <span className="font-semibold text-emerald-400 font-mono">
                        {step.measurementGuide.expectedRange}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">
                        Procedimento de Teste:
                      </span>
                      <span className="text-slate-300 text-[11px]">
                        {step.measurementGuide.procedure}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BLOCO 4: PARÂMETROS RELACIONADOS PARA CHECAGEM */}
      {(activeSection === 'all' || activeSection === 'params') && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2 font-mono">
                <Sliders className="w-5 h-5 text-sky-400" />
                <span>Parâmetros Específicos do Modelo ({report.manufacturer} {report.model})</span>
              </h3>
              <p className="text-xs text-slate-400">
                Parâmetros oficiais extraídos do manual para inspeção, calibração ou alívio de trip.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Parâmetro</th>
                  <th className="py-2.5 px-3">Nome / Função</th>
                  <th className="py-2.5 px-3">Ação Recomendada</th>
                  <th className="py-2.5 px-3">Relevância</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {report.relatedParameters.map((param, idx) => (
                  <tr key={idx} className="hover:bg-slate-950/50 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-sky-400">
                      {param.code}
                    </td>
                    <td className="py-3 px-3 font-medium text-white">
                      {param.name}
                      {param.defaultValue && (
                        <span className="block text-[10px] text-slate-400 font-mono">
                          Padrão: {param.defaultValue}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-300 text-[11px] leading-relaxed">
                      {param.suggestedCheck}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-sky-300 border border-slate-700">
                        {param.relevance}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* BLOCO 5: RECOMENDAÇÕES PREVENTIVAS */}
      {activeSection === 'all' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2 font-mono">
            <Thermometer className="w-5 h-5 text-amber-400" />
            <span>Recomendações e Diretrizes Preventivas para Eliminar Reincidência</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {report.preventiveRecommendations.map((rec, idx) => (
              <div
                key={idx}
                className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 text-slate-300 flex items-start space-x-2"
              >
                <span className="text-sky-400 font-bold shrink-0">✔</span>
                <span className="leading-relaxed">{rec}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BLOCO 6: TERMO DE RESPONSABILIDADE & ASSINATURA TÉCNICA */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <PenTool className="w-4 h-4 text-sky-400" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Homologação e Assinatura do Responsável Técnico
            </h4>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            Conforme Art. 2º da Resolução CONFEA / CFT
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Nome do Engenheiro / Técnico
            </label>
            <input
              type="text"
              value={technicianName}
              onChange={(e) => setTechnicianName(e.target.value)}
              placeholder="Ex: Carlos Eduardo de Oliveira"
              className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Registro Profissional (CREA / CFT)
            </label>
            <input
              type="text"
              value={technicianRegister}
              onChange={(e) => setTechnicianRegister(e.target.value)}
              placeholder="Ex: CREA-SP 5069824410 / CFT-BR"
              className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Empresa / Usina / Planta
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Ex: Linha de Extrusão 03 - Polo Industrial"
              className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>
        </div>

        {/* Digital Signature Badge Card */}
        <div className="mt-3 p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-mono font-bold text-sm">
              ✓
            </div>
            <div>
              <div className="text-xs font-bold text-white font-mono">
                {technicianName || 'Técnico Especialista em Acionamentos'}
              </div>
              <div className="text-[11px] text-slate-400">
                {technicianRegister ? `Registro: ${technicianRegister}` : 'CREA / CFT pendente de validação'} • {companyName || 'Instalação Industrial'}
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 block font-mono">Certificação Digital</span>
            <span className="text-xs font-bold text-sky-400 font-mono">
              DRIVEMASTER-HASH-{report.reportCode.slice(-6)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
