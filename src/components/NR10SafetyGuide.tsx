import React from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Clock,
  Zap,
  CheckCircle2,
  Lock,
  Layers,
  Thermometer,
  FileCheck,
} from 'lucide-react';

export const NR10SafetyGuide: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-red-950/40 border-2 border-red-700/60 rounded-xl p-5 shadow-2xl relative overflow-hidden">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest text-red-400 uppercase">
              NORMA REGULAMENTADORA BRASILEIRA • NR-10 & NBR 5410
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Guia Prático de Segurança em Intervenções de Inversores de Frequência
            </h2>
          </div>
        </div>
        <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
          Inversores de frequência operam com barramentos retificados de corrente contínua (DC Link) dotados de grandes bancos de capacitores eletrolíticos. Mesmo após o desligamento da chave geral, os capacitores continuam retendo carga letal com potenciais superiores a 600V a 800V CC.
        </p>
      </div>

      {/* Grid: Barramento CC + Fórmula + LOTO */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 1. Barramento CC e Cálculo */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center space-x-2 text-sky-400 font-mono text-xs font-bold uppercase">
            <Zap className="w-4 h-4" />
            <span>Tensão Típica no Link CC</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs text-slate-300">
            <div className="text-sky-300 font-bold mb-1">Fórmula da Retificação:</div>
            <div className="text-amber-400 font-bold text-sm">
              V_dc ≈ 1.414 × V_rede (RMS)
            </div>
            <div className="mt-2 text-[11px] text-slate-400 space-y-1">
              <div>• Rede 220V ➔ Link CC ≈ 311 V CC</div>
              <div>• Rede 380V ➔ Link CC ≈ 537 V CC</div>
              <div>• Rede 440V ➔ Link CC ≈ 622 V CC</div>
              <div>• Rede 480V ➔ Link CC ≈ 679 V CC</div>
              <div className="text-red-400 font-semibold">• Em Frenagem: pode atingir ~800 V CC!</div>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            A energia armazenada nos capacitores (E = ½ · C · V²) é suficiente para causar fibrilação ventricular instantânea ou arco elétrico explosivo em curto-circuito.
          </p>
        </div>

        {/* 2. Tempo de Descarga e Teste */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center space-x-2 text-amber-400 font-mono text-xs font-bold uppercase">
            <Clock className="w-4 h-4" />
            <span>Regra dos 10 a 15 Minutos</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Tempo Mínimo:</span>
              <strong className="text-amber-300 font-mono">10 a 15 min</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Tensão Segura Limiar:</span>
              <strong className="text-emerald-400 font-mono">&lt; 50 V CC</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Pontos de Medição:</span>
              <strong className="text-sky-300 font-mono">+UD e -UD (DC+ / DC-)</strong>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            Nunca confie apenas no led de "Charge / Carregado" da IHM. Meça sempre a tensão real com multímetro categoria CAT III 1000V ou CAT IV 600V antes de tocar qualquer terminal.
          </p>
        </div>

        {/* 3. LOTO (Bloqueio e Etiquetagem) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs font-bold uppercase">
            <Lock className="w-4 h-4" />
            <span>Passo a Passo LOTO</span>
          </div>

          <ol className="space-y-1.5 text-xs text-slate-300 pl-4 list-decimal">
            <li>Notificar os operadores da área industrial.</li>
            <li>Seccionar a chave ou disjuntor geral de entrada.</li>
            <li>Colocar garra de bloqueio e cadeado individual.</li>
            <li>Fixar etiqueta de bloqueio com nome, CREA e telefone.</li>
            <li>Aguardar o tempo de descarga do barramento CC.</li>
            <li>Aferir ausência de tensão (&lt; 50V CC).</li>
          </ol>
        </div>
      </div>

      {/* Alerta Fatal de Ensaio com Megômetro */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h3 className="text-sm font-bold text-red-400 flex items-center gap-2 font-mono">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          <span>REGRA CRUCIAL: Testes de Isolação com Megômetro no Motor</span>
        </h3>
        <div className="bg-slate-950 p-4 rounded-lg border border-red-900/50 text-xs text-slate-300 leading-relaxed space-y-2">
          <p className="text-amber-300 font-semibold">
            NUNCA APLIQUE MEGÔMETRO NOS CABOS ENQUANTO ESTIVEREM CONECTADOS AOS BORNES U, V, W DO INVERSOR!
          </p>
          <p>
            Os módulos IGBT de saída possuem tensão de ruptura reversa limitada. A injeção de 500V ou 1000V CC pelo megômetro causa a <strong>perfuração imediata e irreversível das junções de silício dos semicondutores</strong>, inutilizando a unidade de potência do inversor.
          </p>
          <p className="text-sky-300">
            Procedimento correto: Desconecte fisicamente os cabos do motor dos bornes U, V, W do inversor antes de conectar as garras do megômetro na caixa de ligação do motor elétrico.
          </p>
        </div>
      </div>

      {/* EPIs Obrigatórios */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
          <FileCheck className="w-4 h-4 text-sky-400" />
          <span>Equipamentos de Proteção Individual (EPIs) para Acionamentos</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <div className="font-bold text-sky-400 mb-1">Luvas Isolantes</div>
            <p className="text-slate-400 text-[11px]">
              Borracha Classe 0 (até 1000V) com sobreluva de couro/vaqueta.
            </p>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <div className="font-bold text-sky-400 mb-1">Vestimenta ATPV</div>
            <p className="text-slate-400 text-[11px]">
              Proteção contra arco elétrico, mínimo Risco 2 (8 cal/cm²).
            </p>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <div className="font-bold text-sky-400 mb-1">Viseira / Óculos</div>
            <p className="text-slate-400 text-[11px]">
              Protetor facial policarbonato contra radiação térmica e estilhaços.
            </p>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <div className="font-bold text-sky-400 mb-1">Calçado Dielétrico</div>
            <p className="text-slate-400 text-[11px]">
              Botina de couro com solado bi-densidade e palmilha antiperfuro sem metal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
