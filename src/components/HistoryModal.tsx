import React, { useState } from 'react';
import {
  History,
  Search,
  Download,
  Trash2,
  ExternalLink,
  Calendar,
  AlertOctagon,
  AlertTriangle,
  Zap,
  Filter,
  FileText,
} from 'lucide-react';
import { TechnicalReport } from '../types/diagnosis';
import { generateReportPDF } from '../utils/pdfGenerator';

interface HistoryModalProps {
  history: TechnicalReport[];
  onSelectReport: (report: TechnicalReport) => void;
  onDeleteReport: (id: string) => void;
  onClearAll: () => void;
  onBackToDiagnose: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  history,
  onSelectReport,
  onDeleteReport,
  onClearAll,
  onBackToDiagnose,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedCrit, setSelectedCrit] = useState<string>('all');

  const filteredHistory = history.filter((rep) => {
    const matchesSearch =
      rep.reportCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rep.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rep.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rep.queryCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rep.officialNomenclature.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBrand = selectedBrand === 'all' || rep.manufacturer === selectedBrand;
    const matchesCrit =
      selectedCrit === 'all' ||
      (selectedCrit === 'critical' && rep.criticality.includes('Crítico')) ||
      (selectedCrit === 'medium' && rep.criticality.includes('Médio')) ||
      (selectedCrit === 'low' && rep.criticality.includes('Baixo'));

    return matchesSearch && matchesBrand && matchesCrit;
  });

  const uniqueBrands = Array.from(new Set(history.map((h) => h.manufacturer)));

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Histórico de Laudos Periciais ({history.length}/20)
            </h2>
            <p className="text-xs text-slate-400">
              Registros locais persistidos para consulta rápida offline/online e reemissão de PDF.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {history.length > 0 && (
            <button
              onClick={onClearAll}
              className="px-3 py-1.5 rounded-lg bg-red-950/40 text-red-400 hover:bg-red-900/60 border border-red-800/50 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpar Histórico</span>
            </button>
          )}

          <button
            onClick={onBackToDiagnose}
            className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition-colors"
          >
            Novo Diagnóstico
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por código, modelo, fabricante..."
            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
        </div>

        {/* Brand filter */}
        <div className="relative">
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            <option value="all">Todos os Fabricantes</option>
            {uniqueBrands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        {/* Criticality filter */}
        <div className="relative">
          <select
            value={selectedCrit}
            onChange={(e) => setSelectedCrit(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            <option value="all">Todas as Criticidades</option>
            <option value="critical">🔴 Apenas Críticos</option>
            <option value="medium">🟡 Apenas Médios</option>
            <option value="low">🟢 Apenas Baixos</option>
          </select>
        </div>
      </div>

      {/* History Items List */}
      {filteredHistory.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center space-y-3">
          <FileText className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-semibold text-slate-300">Nenhum laudo encontrado</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {history.length === 0
              ? 'Você ainda não emitiu laudos nesta sessão. Utilize o formulário para diagnosticar qualquer inversor e salvá-lo automaticamente.'
              : 'Nenhum resultado corresponde aos filtros aplicados.'}
          </p>
          {history.length === 0 && (
            <button
              onClick={onBackToDiagnose}
              className="mt-3 px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold font-mono transition-colors"
            >
              Criar Primeiro Laudo
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filteredHistory.map((item) => {
            const isCrit = item.criticality.includes('Crítico');
            return (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg group"
              >
                <div className="flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold text-sky-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {item.reportCode}
                    </span>
                    <span className="text-xs font-bold text-white font-mono">
                      {item.manufacturer} {item.model}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded font-mono font-semibold bg-slate-800 text-sky-300 border border-slate-700">
                      Código: {item.queryCode}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                        isCrit
                          ? 'bg-red-950 text-red-300 border border-red-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {item.criticality.toUpperCase()}
                    </span>
                  </div>

                  <h4 className="text-sm font-semibold text-slate-200">
                    {item.officialNomenclature}
                  </h4>

                  <div className="flex items-center space-x-3 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {new Date(item.createdAt).toLocaleString('pt-BR')}
                    </span>
                    <span>•</span>
                    <span>{item.actionPlan.length} passos de intervenção</span>
                    <span>•</span>
                    <span>Motor: {item.engineMeta.source}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 shrink-0 w-full md:w-auto justify-end">
                  <button
                    onClick={() => generateReportPDF(item)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                    title="Baixar PDF A4"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onSelectReport(item)}
                    className="px-3 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Abrir Laudo</span>
                  </button>

                  <button
                    onClick={() => onDeleteReport(item.id)}
                    className="p-2 rounded-lg bg-slate-950 hover:bg-red-950 text-slate-500 hover:text-red-400 border border-slate-800 transition-colors"
                    title="Excluir Registro"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
