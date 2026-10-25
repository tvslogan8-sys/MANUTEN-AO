import React from 'react';
import {
  Activity,
  ShieldAlert,
  History,
  Code2,
  Zap,
  Cpu,
  BookOpen,
  Network,
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'diagnose' | 'history' | 'edge-function' | 'nr10' | 'diagram';
  setActiveTab: (tab: 'diagnose' | 'history' | 'edge-function' | 'nr10' | 'diagram') => void;
  historyCount: number;
  engineStatus: {
    online: boolean;
    name: string;
    temperature: number;
  };
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  historyCount,
  engineStatus,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Subtitle */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('diagnose')}>
            <div className="relative flex items-center justify-center w-11 h-11 rounded-lg bg-gradient-to-br from-sky-500 to-blue-700 shadow-lg shadow-sky-500/20 border border-sky-400/40">
              <Zap className="w-6 h-6 text-white animate-pulse" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-950 ring-2 ring-emerald-500/30" />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight text-white font-mono">
                  Drive<span className="text-sky-400">Master</span>
                  <span className="text-xs ml-1.5 px-1.5 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800/80 uppercase font-semibold">
                    AI PRO
                  </span>
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium tracking-wide">
                Sistema Especialista Pericial em Inversores de Frequência
              </p>
            </div>
          </div>

          {/* Engine Status & Badges */}
          <div className="hidden lg:flex items-center space-x-3">
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-slate-300 font-mono">
                {engineStatus.name} • T={engineStatus.temperature}
              </span>
            </div>

            <div className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-full bg-amber-950/40 border border-amber-800/50 text-amber-400 text-xs font-medium">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>NR-10 & LOTO Conforme</span>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('diagnose')}
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center space-x-1.5 ${
                activeTab === 'diagnose'
                  ? 'bg-sky-600/20 text-sky-400 border border-sky-500/40 shadow-sm shadow-sky-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>Diagnóstico & Parâmetros</span>
            </button>

            <button
              onClick={() => setActiveTab('diagram')}
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center space-x-1.5 ${
                activeTab === 'diagram'
                  ? 'bg-sky-600/20 text-sky-400 border border-sky-500/40 shadow-sm shadow-sky-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
              }`}
              title="Diagrama Elétrico Simplificado do Inversor"
            >
              <Network className="w-4 h-4 text-sky-400" />
              <span>Diagrama Elétrico</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center space-x-1.5 ${
                activeTab === 'history'
                  ? 'bg-sky-600/20 text-sky-400 border border-sky-500/40 shadow-sm shadow-sky-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Histórico</span>
              {historyCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-slate-800 text-sky-400 text-xs font-mono">
                  {historyCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('nr10')}
              className={`px-2.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center space-x-1.5 ${
                activeTab === 'nr10'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-sm shadow-amber-500/10'
                  : 'text-slate-400 hover:text-amber-300 hover:bg-slate-900 border border-transparent'
              }`}
              title="Guia de Segurança NR-10 e Barramento CC"
            >
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Guia NR-10</span>
            </button>

            <button
              onClick={() => setActiveTab('edge-function')}
              className={`px-2.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center space-x-1.5 ${
                activeTab === 'edge-function'
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/40'
                  : 'text-slate-400 hover:text-indigo-300 hover:bg-slate-900 border border-transparent'
              }`}
              title="Ver Código da Edge Function com validação Zod"
            >
              <Code2 className="w-4 h-4 text-indigo-400" />
              <span className="hidden md:inline">Edge Function (Zod)</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
