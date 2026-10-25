import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DiagnosisForm } from './components/DiagnosisForm';
import { ReportViewer } from './components/ReportViewer';
import { HistoryModal } from './components/HistoryModal';
import { EdgeFunctionViewer } from './components/EdgeFunctionViewer';
import { NR10SafetyGuide } from './components/NR10SafetyGuide';
import { DiagnosisRequest, TechnicalReport } from './types/diagnosis';
import { VERIFIED_MANUAL_REPORTS } from './data/manufacturerData';
import { AlertTriangle, CheckCircle, Zap, ShieldCheck } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'drivemaster_ai_history_v2';

export default function App() {
  const [activeTab, setActiveTab] = useState<'diagnose' | 'history' | 'edge-function' | 'nr10'>('diagnose');
  const [currentReport, setCurrentReport] = useState<TechnicalReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [scanStep, setScanStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [history, setHistory] = useState<TechnicalReport[]>([]);
  const [engineStatus, setEngineStatus] = useState({
    online: true,
    name: 'Gemini 3.8 Flash',
    temperature: 0.15,
  });

  // Load history from localStorage on mount & seed with benchmark sample if empty
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setHistory(parsed);
          setCurrentReport(parsed[0]);
          return;
        }
      }

      // Seed with official WEG CFW11 F0006 benchmark report
      const seedReport: TechnicalReport = {
        id: 'rep_seed_cfw11_f0006',
        reportCode: 'LAUDO-WEG-708912',
        createdAt: new Date().toISOString(),
        manufacturer: 'WEG',
        model: 'CFW11',
        queryType: 'fault',
        queryCode: 'F0006',
        ...(VERIFIED_MANUAL_REPORTS['WEG-CFW11-F0006'] as any),
        operationalContext: {
          voltage: '380-480V Trifásico',
          loadType: 'Extrusora de Polímeros',
          faultMoment: 'Instantânea no momento da partida (Start)',
          additionalNotes: 'Ocorrido após parada programada de manutenção para troca de matriz.',
        },
        technicianData: {
          name: 'Eng. Ricardo Silveira',
          register: 'CREA-SP 506894123-1',
          company: 'Planta de Termoplásticos - Setor Extrusão',
          signedAt: new Date().toISOString(),
        },
        engineMeta: {
          source: 'Gemini 3.8 Flash',
          temperature: 0.15,
          confidence: 99.8,
        },
      };

      setHistory([seedReport]);
      setCurrentReport(seedReport);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([seedReport]));
    } catch (e) {
      console.error('Failed to load initial history from storage:', e);
    }
  }, []);

  // Check backend engine health
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.engine) {
          setEngineStatus({
            online: true,
            name: data.engine === 'gemini-3.8-flash' ? 'Gemini 3.8 Flash' : 'Knowledge Base Oficial',
            temperature: 0.15,
          });
        }
      })
      .catch((err) => {
        console.warn('Backend health check note:', err?.message);
      });
  }, []);

  // Save report into history & localStorage (limit to 20)
  const saveReportToHistory = (newReport: TechnicalReport) => {
    setHistory((prev) => {
      const filtered = prev.filter((r) => r.id !== newReport.id && r.reportCode !== newReport.reportCode);
      const updated = [newReport, ...filtered].slice(0, 20);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to save to localStorage:', err);
      }
      return updated;
    });
  };

  // Handle submit from DiagnosisForm
  const handleDiagnosisSubmit = async (request: DiagnosisRequest): Promise<void> => {
    setIsLoading(true);
    setErrorMessage(null);

    // Realistic scanning animation stages
    const scanSteps = [
      'Conectando ao Motor de Diagnóstico (T=0.15)...',
      `Escaneando esquemáticos e manuais oficiais de serviço da ${request.manufacturer}...`,
      'Analisando topologia do Barramento CC e estágio de transistores IGBT...',
      'Calculando parâmetros de ensaio e conformidade com a Norma NR-10 & LOTO...',
      'Compilando Laudo Pericial de Alta Fidelidade...',
    ];

    let stepIndex = 0;
    setScanStep(scanSteps[0]);
    const interval = setInterval(() => {
      stepIndex++;
      if (stepIndex < scanSteps.length) {
        setScanStep(scanSteps[stepIndex]);
      }
    }, 700);

    try {
      const res = await fetch('/api/diagnose', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      clearInterval(interval);

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || errJson.message || 'Falha ao processar diagnóstico no servidor.');
      }

      const report: TechnicalReport = await res.json();
      setCurrentReport(report);
      saveReportToHistory(report);
      setActiveTab('diagnose');
    } catch (err: any) {
      clearInterval(interval);
      console.error('Diagnosis failed:', err);
      setErrorMessage(err?.message || 'Ocorreu um erro ao gerar o laudo técnico.');
    } finally {
      setIsLoading(false);
      setScanStep('');
    }
  };

  const handleDeleteReport = (id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      if (currentReport?.id === id) {
        setCurrentReport(updated[0] || null);
      }
      return updated;
    });
  };

  const handleClearAllHistory = () => {
    if (confirm('Tem certeza que deseja apagar todos os laudos armazenados no histórico local?')) {
      setHistory([]);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        historyCount={history.length}
        engineStatus={engineStatus}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Error Notification Banner if any */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-950/70 border border-red-700 text-red-200 flex items-center justify-between text-xs shadow-lg">
            <div className="flex items-center space-x-2.5">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-red-400 hover:text-white font-bold ml-4"
            >
              ✕
            </button>
          </div>
        )}

        {/* Tab 1: Diagnóstico & Parâmetros */}
        {activeTab === 'diagnose' && (
          <div className="space-y-6">
            {/* Input Form */}
            <DiagnosisForm
              onSubmit={handleDiagnosisSubmit}
              isLoading={isLoading}
              scanStep={scanStep}
            />

            {/* Generated Report Viewer */}
            {currentReport && (
              <ReportViewer
                report={currentReport}
                onSaveToHistory={saveReportToHistory}
                onNewSearch={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              />
            )}
          </div>
        )}

        {/* Tab 2: Histórico e Relatórios */}
        {activeTab === 'history' && (
          <HistoryModal
            history={history}
            onSelectReport={(report) => {
              setCurrentReport(report);
              setActiveTab('diagnose');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onDeleteReport={handleDeleteReport}
            onClearAll={handleClearAllHistory}
            onBackToDiagnose={() => setActiveTab('diagnose')}
          />
        )}

        {/* Tab 3: Guia de Segurança NR-10 */}
        {activeTab === 'nr10' && <NR10SafetyGuide />}

        {/* Tab 4: Edge Function & API Code (FollowUp response) */}
        {activeTab === 'edge-function' && <EdgeFunctionViewer />}
      </main>

      {/* Industrial Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-sky-400" />
            <span className="font-mono text-slate-400">
              DriveMaster AI v2.5 • Diagnóstico Pericial de Inversores Multimarcas
            </span>
          </div>

          <div className="flex items-center space-x-4 text-[11px] text-slate-500">
            <span>Conformidade com Norma NR-10</span>
            <span>•</span>
            <span>NBR 5410 / IEEE 43</span>
            <span>•</span>
            <span className="text-sky-400 font-mono">WEG • ABB • Schneider • Siemens • Danfoss • Yaskawa • Rockwell</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
