import React, { useState } from 'react';
import {
  Zap,
  Activity,
  Layers,
  ShieldAlert,
  Download,
  Info,
  Maximize2,
  Copy,
  Check,
  CheckCircle2,
  Cpu,
  Clock,
  Wrench,
  Gauge,
  Sliders,
  ExternalLink,
} from 'lucide-react';
import { getDiagramConfigFor, TerminalInfo, ModelDiagramConfig } from '../data/diagramData';

interface ConnectionDiagramProps {
  manufacturer: string;
  model: string;
  activeFaultCode?: string;
  onSelectTerminal?: (terminal: TerminalInfo) => void;
}

export const ConnectionDiagram: React.FC<ConnectionDiagramProps> = ({
  manufacturer,
  model,
  activeFaultCode,
}) => {
  const [diagramMode, setDiagramMode] = useState<'full' | 'power' | 'control'>('full');
  const [selectedPin, setSelectedPin] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const config: ModelDiagramConfig = getDiagramConfigFor(manufacturer, model);
  const selectedTerminal: TerminalInfo | undefined = selectedPin
    ? config.terminalsDetail[selectedPin] || {
        pin: selectedPin,
        name: `Borne ${selectedPin}`,
        group: 'power-in',
        description: `Terminal de conexão oficial do modelo ${manufacturer} ${model}.`,
        recommendedGauge: 'Conforme potência e corrente nominal de placa',
        tighteningTorque: '3.5 N.m',
      }
    : undefined;

  const handleDownloadSVG = () => {
    const svgElement = document.getElementById('vfd-connection-svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Diagrama_Conexao_${manufacturer}_${model}.svg`.replace(/\s+/g, '_');
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyWiringSummary = () => {
    const summary = `
DIAGRAMA DE CONEXÃO SIMPLIFICADO - ${manufacturer} ${model}
Tensão Nominal de Entrada: ${config.standardInputVoltage}
Tempo Mínimo de Descarga do Barramento CC: ${config.dcBusWaitMin} minutos (NR-10)

BORNES DE POTÊNCIA:
- Entrada Rede CA: ${config.powerTerminals.input.join(', ')}
- Saída para Motor: ${config.powerTerminals.output.join(', ')}
- Barramento CC (+/-): ${config.powerTerminals.dcBus.join(', ')}
- Resistor de Frenagem: ${config.powerTerminals.brake.join(', ')}
- Aterramento: ${config.powerTerminals.ground.join(', ')}

BORNES DE CONTROLE TÍPICOS:
${config.controlTerminals.digitalInputs.map((d) => `- ${d.pin}: ${d.label} [${d.defaultFunc}]`).join('\n')}
${config.controlTerminals.analogInputs.map((a) => `- ${a.pin}: ${a.label} [${a.defaultFunc}]`).join('\n')}
${config.controlTerminals.relayOutputs.map((r) => `- ${r.pin}: ${r.label} [${r.defaultFunc}]`).join('\n')}
`.trim();

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl space-y-4">
      {/* Top Bar */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-sky-400 uppercase tracking-wider mb-1">
            <Zap className="w-4 h-4 text-sky-400 animate-pulse" />
            <span>Diagrama Elétrico Simplificado</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300 font-semibold">{manufacturer} {model}</span>
            {activeFaultCode && (
              <span className="px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 text-[10px] border border-amber-800">
                Foco na Falha: {activeFaultCode}
              </span>
            )}
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Esquema de Ligação de Potência, Barramento CC e Bornes de Controle
          </h2>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View mode toggle */}
          <div className="bg-slate-950 p-1 rounded-lg border border-slate-800 flex items-center space-x-1 text-xs">
            <button
              onClick={() => setDiagramMode('full')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                diagramMode === 'full' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Circuito Completo
            </button>
            <button
              onClick={() => setDiagramMode('power')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                diagramMode === 'power' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Potência & Link CC
            </button>
            <button
              onClick={() => setDiagramMode('control')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                diagramMode === 'control' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Controle I/O
            </button>
          </div>

          <button
            onClick={handleDownloadSVG}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center space-x-1.5 transition-colors"
            title="Baixar Arquivo Vetorial SVG"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Baixar SVG</span>
          </button>

          <button
            onClick={handleCopyWiringSummary}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center space-x-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copied ? 'Copiado!' : 'Copiar Pinagem'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Blueprint Canvas (SVG) */}
      <div className="px-4 sm:px-6">
        <div className="relative rounded-xl border border-sky-500/20 bg-gradient-to-b from-[#090e1c] to-[#040711] overflow-hidden p-2 sm:p-4 shadow-inner">
          {/* Blueprint Grid Lines Background */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(circle, #38bdf8 1px, transparent 1px), linear-gradient(to right, rgba(56, 189, 248, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(56, 189, 248, 0.05) 1px, transparent 1px)',
              backgroundSize: '24px 24px, 24px 24px, 24px 24px',
            }}
          />

          {/* SVG Diagram Rendering */}
          <div className="w-full overflow-x-auto">
            <svg
              id="vfd-connection-svg"
              viewBox="0 0 1000 580"
              className="w-full h-auto min-w-[750px] font-mono select-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Glow filter */}
                <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="amberGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <linearGradient id="driveBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>
                <linearGradient id="motorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0284c7" />
                  <stop offset="100%" stopColor="#0369a1" />
                </linearGradient>
              </defs>

              {/* Title inside schematic */}
              <text x="30" y="32" fill="#38bdf8" fontSize="13" fontWeight="bold" letterSpacing="1">
                ESQUEMA UNIFILAR & PINAGEM: {manufacturer.toUpperCase()} - {model.toUpperCase()}
              </text>
              <text x="30" y="48" fill="#64748b" fontSize="10">
                Tensão Nominal: {config.standardInputVoltage} | Conformidade NR-10 & NBR 5410
              </text>

              {/* ----------------- 1. ALIMENTAÇÃO REDE CA (L1, L2, L3) ----------------- */}
              {(diagramMode === 'full' || diagramMode === 'power') && (
                <g id="mains-source">
                  {/* Mains Source Box */}
                  <rect x="30" y="80" width="130" height="150" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
                  <text x="42" y="105" fill="#f8fafc" fontSize="11" fontWeight="bold">REDE CA</text>
                  <text x="42" y="120" fill="#94a3b8" fontSize="9">3F + PE</text>
                  <text x="42" y="135" fill="#38bdf8" fontSize="9">{config.standardInputVoltage}</text>

                  {/* Disjuntor Q1 symbol */}
                  <rect x="42" y="150" width="105" height="42" rx="4" fill="#1e293b" stroke="#0ea5e9" strokeWidth="1" />
                  <text x="50" y="168" fill="#e2e8f0" fontSize="9" fontWeight="bold">DISJUNTOR Q1</text>
                  <text x="50" y="182" fill="#94a3b8" fontSize="8">Curva C • NBR IEC</text>

                  {/* Power Lines R, S, T */}
                  {/* L1 */}
                  <path d="M 160 110 L 320 110" stroke="#f59e0b" strokeWidth="2.5" />
                  <text x="210" y="103" fill="#fbbf24" fontSize="9" fontWeight="bold">L1 / R (Marrom)</text>

                  {/* L2 */}
                  <path d="M 160 140 L 320 140" stroke="#0ea5e9" strokeWidth="2.5" />
                  <text x="210" y="133" fill="#38bdf8" fontSize="9" fontWeight="bold">L2 / S (Preto)</text>

                  {/* L3 */}
                  <path d="M 160 170 L 320 170" stroke="#a855f7" strokeWidth="2.5" />
                  <text x="210" y="163" fill="#c084fc" fontSize="9" fontWeight="bold">L3 / T (Cinza)</text>

                  {/* Ground line PE from Mains */}
                  <path d="M 100 230 L 100 530 L 920 530" stroke="#22c55e" strokeWidth="2" strokeDasharray="6,4" />
                  <text x="110" y="522" fill="#4ade80" fontSize="9" fontWeight="bold">BARRAMENTO DE PROTEÇÃO EQUIPOTENCIAL (PE) - NBR 5410</text>
                </g>
              )}

              {/* ----------------- 2. CORPO DO INVERSOR (VFD) ----------------- */}
              <g id="inverter-chassis">
                {/* Main Enclosure */}
                <rect
                  x="320"
                  y="65"
                  width="360"
                  height="440"
                  rx="12"
                  fill="url(#driveBodyGrad)"
                  stroke="#0284c7"
                  strokeWidth="2"
                  filter="url(#cyanGlow)"
                />

                {/* Inverter Display / Keypad Area */}
                <rect x="420" y="80" width="160" height="42" rx="6" fill="#020617" stroke="#1e293b" />
                <rect x="430" y="86" width="70" height="28" rx="3" fill="#0369a1" />
                <text x="440" y="104" fill="#ffffff" fontSize="12" fontWeight="bold">60.0 Hz</text>
                <circle cx="525" cy="95" r="4" fill="#22c55e" />
                <text x="535" y="98" fill="#4ade80" fontSize="8">RUN</text>
                <circle cx="525" cy="107" r="4" fill={activeFaultCode ? '#ef4444' : '#64748b'} />
                <text x="535" y="110" fill={activeFaultCode ? '#f87171' : '#94a3b8'} fontSize="8">
                  {activeFaultCode ? 'FAULT' : 'RDY'}
                </text>

                {/* Brand label on drive */}
                <text x="345" y="98" fill="#ffffff" fontSize="13" fontWeight="bold">{manufacturer}</text>
                <text x="345" y="112" fill="#38bdf8" fontSize="10">{model}</text>

                {/* Internal Rectifier - DC Link - Inverter block representation */}
                <rect x="340" y="135" width="320" height="50" rx="4" fill="#0b1329" stroke="#1e293b" />
                <text x="350" y="152" fill="#94a3b8" fontSize="8" fontWeight="bold">ESTÁGIO DE RETIFICAÇÃO</text>
                <text x="495" y="152" fill="#eab308" fontSize="8" fontWeight="bold">LINK CC (~800V)</text>
                <text x="590" y="152" fill="#38bdf8" fontSize="8" fontWeight="bold">IGBT PWM</text>
                <path d="M 450 160 L 485 160 M 560 160 L 585 160" stroke="#38bdf8" strokeWidth="1.5" />

                {/* --- BORNES DE ENTRADA (TOP / LEFT) --- */}
                <g id="input-terminals">
                  <text x="330" y="210" fill="#94a3b8" fontSize="8" fontWeight="bold">BORNES DE POTÊNCIA (REDE)</text>
                  {config.powerTerminals.input.map((pin, i) => {
                    const yPos = 110 + i * 30;
                    const isSelected = selectedPin === pin;
                    return (
                      <g
                        key={pin}
                        className="cursor-pointer group"
                        onClick={() => setSelectedPin(pin)}
                      >
                        <circle
                          cx="320"
                          cy={yPos}
                          r={isSelected ? 10 : 7}
                          fill={isSelected ? '#38bdf8' : '#0f172a'}
                          stroke={isSelected ? '#ffffff' : '#38bdf8'}
                          strokeWidth="2"
                        />
                        <text
                          x="335"
                          y={yPos + 4}
                          fill={isSelected ? '#38bdf8' : '#f1f5f9'}
                          fontSize="10"
                          fontWeight="bold"
                        >
                          {pin}
                        </text>
                      </g>
                    );
                  })}
                </g>

                {/* --- BORNES BARRAMENTO CC & RESISTOR DE FRENAGEM (CENTRO) --- */}
                {(diagramMode === 'full' || diagramMode === 'power') && (
                  <g id="dc-bus-terminals">
                    <rect x="340" y="200" width="320" height="60" rx="6" fill="#18181b" stroke="#ef4444" strokeWidth="1" strokeDasharray="3,3" />
                    <text x="350" y="218" fill="#ef4444" fontSize="9" fontWeight="bold">
                      BARRAMENTO CC & CHOPPER (PERIGO NR-10: ALTA TENSÃO)
                    </text>

                    {/* DC+ and DC- and BR pins */}
                    {config.powerTerminals.dcBus.concat(config.powerTerminals.brake.filter((b) => !config.powerTerminals.dcBus.includes(b))).map((pin, i) => {
                      const xPos = 365 + i * 75;
                      const isSelected = selectedPin === pin;
                      return (
                        <g
                          key={pin}
                          className="cursor-pointer"
                          onClick={() => setSelectedPin(pin)}
                        >
                          <rect
                            x={xPos - 25}
                            y={225}
                            width="50"
                            height="24"
                            rx="4"
                            fill={isSelected ? '#7f1d1d' : '#27272a'}
                            stroke={isSelected ? '#f87171' : '#dc2626'}
                            strokeWidth="1.5"
                          />
                          <text
                            x={xPos}
                            y={241}
                            fill="#ffffff"
                            fontSize="9"
                            fontWeight="bold"
                            textAnchor="middle"
                          >
                            {pin}
                          </text>
                        </g>
                      );
                    })}
                  </g>
                )}

                {/* --- BORNES DE SAÍDA PARA O MOTOR (DIREITA) --- */}
                {(diagramMode === 'full' || diagramMode === 'power') && (
                  <g id="output-terminals">
                    <text x="575" y="280" fill="#94a3b8" fontSize="8" fontWeight="bold">SAÍDA DO MOTOR (U, V, W)</text>
                    {config.powerTerminals.output.map((pin, i) => {
                      const yPos = 300 + i * 35;
                      const isSelected = selectedPin === pin;
                      return (
                        <g
                          key={pin}
                          className="cursor-pointer"
                          onClick={() => setSelectedPin(pin)}
                        >
                          <circle
                            cx="680"
                            cy={yPos}
                            r={isSelected ? 10 : 7}
                            fill={isSelected ? '#38bdf8' : '#0f172a'}
                            stroke={isSelected ? '#ffffff' : '#0ea5e9'}
                            strokeWidth="2"
                          />
                          <text
                            x="640"
                            y={yPos + 4}
                            fill={isSelected ? '#38bdf8' : '#f1f5f9'}
                            fontSize="10"
                            fontWeight="bold"
                          >
                            {pin}
                          </text>
                        </g>
                      );
                    })}
                  </g>
                )}

                {/* --- BORNES DE CONTROLE (DIGITAIS E ANALÓGICOS - INFERIOR) --- */}
                {(diagramMode === 'full' || diagramMode === 'control') && (
                  <g id="control-terminals-block">
                    <rect x="340" y="280" width="220" height="210" rx="6" fill="#0b1329" stroke="#334155" />
                    <text x="350" y="300" fill="#38bdf8" fontSize="9" fontWeight="bold">
                      BARRA DE CONTROLE (I/O)
                    </text>

                    {/* Digital Inputs */}
                    <text x="350" y="320" fill="#94a3b8" fontSize="8" fontWeight="bold">ENTRADAS DIGITAIS 24V</text>
                    {config.controlTerminals.digitalInputs.slice(0, 3).map((di, i) => {
                      const yPos = 335 + i * 20;
                      const isSelected = selectedPin === di.pin;
                      return (
                        <g key={di.pin} className="cursor-pointer" onClick={() => setSelectedPin(di.pin)}>
                          <circle cx="355" cy={yPos} r="4" fill={isSelected ? '#38bdf8' : '#0284c7'} />
                          <text x="365" y={yPos + 3} fill={isSelected ? '#38bdf8' : '#cbd5e1'} fontSize="8">
                            {di.pin}: {di.defaultFunc.slice(0, 18)}
                          </text>
                        </g>
                      );
                    })}

                    {/* Analog Inputs */}
                    <text x="350" y="405" fill="#94a3b8" fontSize="8" fontWeight="bold">ANALÓGICA 0-10V</text>
                    {config.controlTerminals.analogInputs.slice(0, 2).map((ai, i) => {
                      const yPos = 420 + i * 18;
                      const isSelected = selectedPin === ai.pin;
                      return (
                        <g key={ai.pin} className="cursor-pointer" onClick={() => setSelectedPin(ai.pin)}>
                          <circle cx="355" cy={yPos} r="4" fill={isSelected ? '#38bdf8' : '#eab308'} />
                          <text x="365" y={yPos + 3} fill={isSelected ? '#38bdf8' : '#cbd5e1'} fontSize="8">
                            {ai.pin}: {ai.defaultFunc.slice(0, 18)}
                          </text>
                        </g>
                      );
                    })}

                    {/* Relay Outputs */}
                    <text x="350" y="460" fill="#94a3b8" fontSize="8" fontWeight="bold">RELÉ DE TRIP / ALARME</text>
                    {config.controlTerminals.relayOutputs.slice(0, 2).map((ro, i) => {
                      const yPos = 475 + i * 15;
                      const isSelected = selectedPin === ro.pin;
                      return (
                        <g key={ro.pin} className="cursor-pointer" onClick={() => setSelectedPin(ro.pin)}>
                          <circle cx="355" cy={yPos} r="4" fill={isSelected ? '#38bdf8' : '#22c55e'} />
                          <text x="365" y={yPos + 3} fill={isSelected ? '#38bdf8' : '#cbd5e1'} fontSize="8">
                            {ro.pin}: {ro.defaultFunc.slice(0, 18)}
                          </text>
                        </g>
                      );
                    })}
                  </g>
                )}

                {/* Ground terminal PE on chassis */}
                <g className="cursor-pointer" onClick={() => setSelectedPin('PE')}>
                  <circle cx="350" cy="495" r="7" fill="#14532d" stroke="#22c55e" strokeWidth="2" />
                  <text x="365" y="499" fill="#4ade80" fontSize="10" fontWeight="bold">PE (Terra)</text>
                  <path d="M 350 502 L 350 530" stroke="#22c55e" strokeWidth="2" strokeDasharray="4,2" />
                </g>
              </g>

              {/* ----------------- 3. RESISTOR DE FRENAGEM (EXTERNO) ----------------- */}
              {(diagramMode === 'full' || diagramMode === 'power') && (
                <g id="braking-resistor">
                  {/* Lines to Braking Resistor */}
                  <path d="M 450 200 L 450 140 L 730 140" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4,2" />
                  <path d="M 525 200 L 525 155 L 730 155" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4,2" />

                  {/* Resistor Component Box */}
                  <rect x="730" y="125" width="130" height="48" rx="6" fill="#1c1917" stroke="#ea580c" strokeWidth="1.5" />
                  <text x="740" y="145" fill="#fb923c" fontSize="9" fontWeight="bold">RESISTOR FRENAGEM</text>
                  <text x="740" y="160" fill="#a8a29e" fontSize="8">Drenagem Link CC</text>
                </g>
              )}

              {/* ----------------- 4. MOTOR TRIFÁSICO (SAÍDA) ----------------- */}
              {(diagramMode === 'full' || diagramMode === 'power') && (
                <g id="electric-motor">
                  {/* Motor Cable U, V, W */}
                  <path d="M 680 300 L 800 300" stroke="#0284c7" strokeWidth="2.5" />
                  <text x="710" y="293" fill="#38bdf8" fontSize="9" fontWeight="bold">U (Fase 1)</text>

                  <path d="M 680 335 L 800 335" stroke="#0284c7" strokeWidth="2.5" />
                  <text x="710" y="328" fill="#38bdf8" fontSize="9" fontWeight="bold">V (Fase 2)</text>

                  <path d="M 680 370 L 800 370" stroke="#0284c7" strokeWidth="2.5" />
                  <text x="710" y="363" fill="#38bdf8" fontSize="9" fontWeight="bold">W (Fase 3)</text>

                  {/* Shielded Cable Outer Boundary */}
                  <rect x="690" y="285" width="105" height="100" rx="6" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="4,3" />
                  <text x="695" y="400" fill="#94a3b8" fontSize="8">Cabo Blindado Aterrado 360°</text>

                  {/* Motor Circle */}
                  <circle cx="860" cy="335" r="55" fill="url(#motorGrad)" stroke="#38bdf8" strokeWidth="2.5" filter="url(#cyanGlow)" />
                  <circle cx="860" cy="335" r="42" fill="none" stroke="#bae6fd" strokeWidth="1.5" strokeDasharray="4,2" />
                  <text x="860" y="330" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">M</text>
                  <text x="860" y="348" fill="#bae6fd" fontSize="10" fontWeight="bold" textAnchor="middle">3 ~</text>
                  <text x="860" y="415" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">MOTOR DE INDUÇÃO</text>
                  <text x="860" y="428" fill="#94a3b8" fontSize="8" textAnchor="middle">Assíncrono Trifásico</text>

                  {/* Motor Ground connection to PE */}
                  <path d="M 860 390 L 860 530" stroke="#22c55e" strokeWidth="2" strokeDasharray="4,2" />
                </g>
              )}

              {/* ----------------- 5. POTENCIÔMETRO EXTERNO & COMANDOS (DIREITA OU ESQUERDA) ----------------- */}
              {(diagramMode === 'full' || diagramMode === 'control') && (
                <g id="control-external-devices">
                  {/* Potentiometer Box */}
                  <rect x="180" y="405" width="130" height="60" rx="6" fill="#0f172a" stroke="#eab308" strokeWidth="1.5" />
                  <text x="190" y="423" fill="#facc15" fontSize="9" fontWeight="bold">POTENCIÔMETRO</text>
                  <text x="190" y="437" fill="#94a3b8" fontSize="8">10 kΩ / 0-10V CC</text>
                  <text x="190" y="452" fill="#cbd5e1" fontSize="8">Ajuste de Rotação</text>
                  {/* Wires from Pot to drive */}
                  <path d="M 310 425 L 340 425" stroke="#eab308" strokeWidth="1.5" />
                  <path d="M 310 445 L 340 445" stroke="#64748b" strokeWidth="1.5" />

                  {/* Switch S1 Gira/Pára */}
                  <rect x="180" y="325" width="130" height="50" rx="6" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
                  <text x="190" y="343" fill="#38bdf8" fontSize="9" fontWeight="bold">CHAVE S1 (MARCHA)</text>
                  <text x="190" y="358" fill="#94a3b8" fontSize="8">Contato NA (Gira/Pára)</text>
                  <path d="M 310 345 L 340 345" stroke="#38bdf8" strokeWidth="1.5" />
                </g>
              )}
            </svg>
          </div>

          {/* Hint Overlay */}
          <div className="mt-2 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2 border-t border-slate-800/80 pt-2">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
              <span>
                <strong>Modo Interativo:</strong> Clique em qualquer borne (ex: <code className="text-sky-300">L1/R</code>, <code className="text-sky-300">+UD</code>, <code className="text-sky-300">U/T1</code>, <code className="text-sky-300">DI1</code>, <code className="text-sky-300">PE</code>) para inspecionar parâmetros de fiação e regras de torque.
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              Padrão Normativo: ABNT NBR 5410 & IEC 61800-5-1
            </div>
          </div>
        </div>
      </div>

      {/* Selected Terminal Inspector Panel */}
      {selectedTerminal && (
        <div className="px-4 sm:px-6">
          <div className="bg-slate-950 border-2 border-sky-500/50 rounded-xl p-4 sm:p-5 shadow-2xl relative">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-sky-500/20 border border-sky-400 text-sky-300 font-mono font-bold flex items-center justify-center text-sm">
                  {selectedTerminal.pin}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-mono">
                    {selectedTerminal.name}
                  </h4>
                  <span className="text-xs text-slate-400">
                    Borne Oficial • {manufacturer} {model}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedPin(null)}
                className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded bg-slate-900 border border-slate-700 self-start sm:self-auto"
              >
                Fechar Detalhes ✕
              </button>
            </div>

            <p className="text-xs text-slate-200 mb-4 leading-relaxed font-sans">
              {selectedTerminal.description}
            </p>

            {/* Spec Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mb-3">
              <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-mono block mb-1">
                  Bitola Recomendada do Cabo:
                </span>
                <span className="font-bold text-sky-300 font-mono">
                  {selectedTerminal.recommendedGauge}
                </span>
              </div>

              <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-mono block mb-1">
                  Torque de Aperto Nominal:
                </span>
                <span className="font-bold text-amber-400 font-mono">
                  {selectedTerminal.tighteningTorque}
                </span>
              </div>

              <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-mono block mb-1">
                  Código de Cores Padrão:
                </span>
                <span className="font-medium text-slate-300">
                  {selectedTerminal.standardColorCode || 'Cabo Flexível Blindado / Par Trançado'}
                </span>
              </div>
            </div>

            {/* Safety Alert if applicable */}
            {selectedTerminal.safetyCaution && (
              <div className="p-3 rounded-lg bg-red-950/60 border border-red-800/80 text-red-200 text-xs flex items-start space-x-2">
                <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{selectedTerminal.safetyCaution}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Terminal Block Quick Reference Table */}
      <div className="p-4 sm:p-6 border-t border-slate-800/80">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center space-x-1.5 font-mono">
          <Layers className="w-4 h-4 text-sky-400" />
          <span>Tabela Rápida de Pinagem ({manufacturer} {model})</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {/* Power In */}
          <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
            <span className="font-bold text-sky-400 block mb-1">Alimentação CA (Entrada)</span>
            <div className="space-y-1 font-mono text-[11px] text-slate-300">
              {config.powerTerminals.input.map((t) => (
                <div key={t} className="flex justify-between">
                  <span>Borne {t}:</span>
                  <span className="text-slate-400">Rede Trifásica</span>
                </div>
              ))}
            </div>
          </div>

          {/* Power Out */}
          <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
            <span className="font-bold text-sky-400 block mb-1">Saída para Motor (PWM)</span>
            <div className="space-y-1 font-mono text-[11px] text-slate-300">
              {config.powerTerminals.output.map((t) => (
                <div key={t} className="flex justify-between">
                  <span>Borne {t}:</span>
                  <span className="text-slate-400">Enrolamento Motor</span>
                </div>
              ))}
            </div>
          </div>

          {/* DC Link & Brake */}
          <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
            <span className="font-bold text-red-400 block mb-1">Link CC & Frenagem</span>
            <div className="space-y-1 font-mono text-[11px] text-slate-300">
              <div className="flex justify-between">
                <span>{config.powerTerminals.dcBus.join(' / ')}:</span>
                <span className="text-red-300">Capacitores &lt; 50V</span>
              </div>
              <div className="flex justify-between">
                <span>{config.powerTerminals.brake.join(' / ')}:</span>
                <span className="text-amber-300">Resistor Chopper</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
