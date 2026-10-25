import React, { useState, useEffect } from 'react';
import {
  Search,
  Zap,
  Sliders,
  AlertTriangle,
  FileCheck,
  ChevronDown,
  ChevronUp,
  Cpu,
  Layers,
  Wrench,
  Sparkles,
  Info,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import {
  MANUFACTURERS_DATA,
  COMMON_LOAD_TYPES,
  COMMON_FAULT_MOMENTS,
} from '../data/manufacturerData';
import { DiagnosisRequest, QueryType } from '../types/diagnosis';

interface DiagnosisFormProps {
  onSubmit: (request: DiagnosisRequest) => Promise<void>;
  isLoading: boolean;
  scanStep: string;
}

const PRESET_CASES = [
  {
    manufacturer: 'WEG',
    model: 'CFW11',
    queryType: 'fault' as QueryType,
    queryCode: 'F0006',
    label: 'WEG CFW11 • F0006 (Sobrecorrente)',
    context: {
      voltage: '380-480V Trifásico',
      loadType: 'Extrusora de Polímeros',
      faultMoment: 'Instantânea no momento da partida (Start)',
    },
  },
  {
    manufacturer: 'Schneider Electric',
    model: 'Altivar 320 (ATV320)',
    queryType: 'fault' as QueryType,
    queryCode: 'OCF',
    label: 'Schneider ATV320 • OCF (Overcurrent)',
    context: {
      voltage: '380-500V Trifásico',
      loadType: 'Ponte Rolante / Içamento',
      faultMoment: 'Ao atingir pico de esforço mecânico',
    },
  },
  {
    manufacturer: 'ABB',
    model: 'ACS880',
    queryType: 'fault' as QueryType,
    queryCode: '2310',
    label: 'ABB ACS880 • 2310 (Overcurrent)',
    context: {
      voltage: '380-480V Trifásico',
      loadType: 'Ventilador Industrial / Exaustor',
      faultMoment: 'Durante aceleração na rampa (Acc Ramp)',
    },
  },
  {
    manufacturer: 'Siemens',
    model: 'Sinamics G120',
    queryType: 'fault' as QueryType,
    queryCode: 'F30001',
    label: 'Siemens G120 • F30001 (Power Unit)',
    context: {
      voltage: '380-480V Trifásico',
      loadType: 'Bomba Centrífuga',
      faultMoment: 'Em regime contínuo de rotação nominal',
    },
  },
  {
    manufacturer: 'WEG',
    model: 'CFW500',
    queryType: 'fault' as QueryType,
    queryCode: 'F0021',
    label: 'WEG CFW500 • F0021 (Subtensão CC)',
    context: {
      voltage: '220-240V Trifásico',
      loadType: 'Correia Transportadora',
      faultMoment: 'Imediatamente ao energizar o inversor (pré-carga)',
    },
  },
  {
    manufacturer: 'Rockwell / Allen-Bradley',
    model: 'PowerFlex 525',
    queryType: 'fault' as QueryType,
    queryCode: 'F012',
    label: 'PowerFlex 525 • F012 (HW Overcurrent)',
    context: {
      voltage: '380-480V Trifásico',
      loadType: 'Compressor de Parafuso',
      faultMoment: 'Instantânea no momento da partida (Start)',
    },
  },
];

export const DiagnosisForm: React.FC<DiagnosisFormProps> = ({
  onSubmit,
  isLoading,
  scanStep,
}) => {
  const [manufacturer, setManufacturer] = useState<string>('WEG');
  const [model, setModel] = useState<string>('CFW11');
  const [queryType, setQueryType] = useState<QueryType>('fault');
  const [queryCode, setQueryCode] = useState<string>('F0006');

  // Context fields
  const [showContext, setShowContext] = useState<boolean>(false);
  const [voltage, setVoltage] = useState<string>('380-480V Trifásico');
  const [loadType, setLoadType] = useState<string>('Extrusora de Polímeros');
  const [faultMoment, setFaultMoment] = useState<string>('Instantânea no momento da partida (Start)');
  const [additionalNotes, setAdditionalNotes] = useState<string>('');

  // Technician fields
  const [technicianName, setTechnicianName] = useState<string>('');
  const [technicianRegister, setTechnicianRegister] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');

  // Autocomplete suggestions
  const [filteredModels, setFilteredModels] = useState<string[]>([]);
  const [showModelDropdown, setShowModelDropdown] = useState<boolean>(false);

  // Validation warning
  const [validationWarning, setValidationWarning] = useState<string | null>(null);

  // Load manufacturer details
  const currentMfrData = MANUFACTURERS_DATA[manufacturer];

  // Update suggestions when manufacturer changes
  useEffect(() => {
    if (currentMfrData) {
      setFilteredModels(currentMfrData.models);
      if (!currentMfrData.models.includes(model)) {
        setModel(currentMfrData.models[0] || '');
      }
    } else {
      setFilteredModels([]);
    }
  }, [manufacturer]);

  // Syntax validation check
  useEffect(() => {
    if (!queryCode.trim()) {
      setValidationWarning(null);
      return;
    }

    const code = queryCode.trim().toUpperCase();

    if (queryType === 'symptom') {
      setValidationWarning(null);
      return;
    }

    if (manufacturer === 'WEG') {
      if (queryType === 'fault' && !code.startsWith('F')) {
        setValidationWarning('Padrão WEG: Falhas normalmente iniciam com "F" seguido de números (ex: F0006, F0021, F0070).');
      } else if (queryType === 'alarm' && !code.startsWith('A')) {
        setValidationWarning('Padrão WEG: Alarmes normalmente iniciam com "A" seguido de números (ex: A0110, A0046).');
      } else if (queryType === 'parameter' && !code.startsWith('P')) {
        setValidationWarning('Padrão WEG: Parâmetros iniciam com "P" seguido de 4 dígitos (ex: P0295, P0100).');
      } else {
        setValidationWarning(null);
      }
    } else if (manufacturer === 'Schneider Electric') {
      if (queryType === 'fault' && code.length > 5) {
        setValidationWarning('Padrão Schneider: Códigos de falha são tipicamente mnemônicos de 3 a 4 letras (ex: OCF, InF1, USF, OHF).');
      } else {
        setValidationWarning(null);
      }
    } else if (manufacturer === 'ABB') {
      if (queryType === 'fault' && !/^[0-9A-Fa-f]{3,5}$/.test(code)) {
        setValidationWarning('Padrão ABB: Falhas são tipicamente códigos hexadecimais ou numéricos de 4 dígitos (ex: 2310, 3181, 7121).');
      } else {
        setValidationWarning(null);
      }
    } else if (manufacturer === 'Siemens') {
      if (queryType === 'fault' && !code.startsWith('F')) {
        setValidationWarning('Padrão Siemens: Códigos de falha geralmente começam com "F" seguido de 5 dígitos (ex: F30001, F07900).');
      } else {
        setValidationWarning(null);
      }
    } else {
      setValidationWarning(null);
    }
  }, [manufacturer, queryCode, queryType]);

  const handleApplyPreset = (preset: (typeof PRESET_CASES)[0]) => {
    setManufacturer(preset.manufacturer);
    setModel(preset.model);
    setQueryType(preset.queryType);
    setQueryCode(preset.queryCode);
    setVoltage(preset.context.voltage);
    setLoadType(preset.context.loadType);
    setFaultMoment(preset.context.faultMoment);
    setShowContext(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!model.trim() || !queryCode.trim()) return;

    await onSubmit({
      manufacturer,
      model,
      queryType,
      queryCode,
      operationalContext: {
        voltage,
        loadType,
        faultMoment,
        additionalNotes,
      },
      technicianName,
      technicianRegister,
      companyName,
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden">
      {/* Top Banner / Presets */}
      <div className="bg-slate-950/70 border-b border-slate-800/80 px-4 py-3 sm:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span className="font-medium text-slate-300">Casos Críticos Recorrentes na Indústria:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_CASES.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className="text-xs px-2.5 py-1 rounded bg-slate-900 hover:bg-sky-950 text-slate-300 hover:text-sky-300 border border-slate-700/60 hover:border-sky-500/50 transition-colors font-mono"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
        {/* Main Grid: Fabricante, Modelo, Tipo de Consulta, Código */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Fabricante */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Fabricante do Inversor
            </label>
            <div className="relative">
              <select
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors appearance-none cursor-pointer"
              >
                {Object.keys(MANUFACTURERS_DATA).map((brand) => (
                  <option key={brand} value={brand}>
                    {brand} ({MANUFACTURERS_DATA[brand].country})
                  </option>
                ))}
                <option value="Outro">Outro Fabricante / Personalizado</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
            {currentMfrData && (
              <p className="mt-1 text-[11px] text-slate-400 font-mono">
                Padrão: {currentMfrData.standardFaultFormat}
              </p>
            )}
          </div>

          {/* Modelo com autocomplete inteligente */}
          <div className="relative">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Modelo / Série
            </label>
            <div className="relative">
              <input
                type="text"
                value={model}
                onChange={(e) => {
                  setModel(e.target.value);
                  setShowModelDropdown(true);
                }}
                onFocus={() => setShowModelDropdown(true)}
                placeholder="Ex: CFW11, ACS880, ATV320..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors font-mono"
                required
              />
              <button
                type="button"
                onClick={() => setShowModelDropdown(!showModelDropdown)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-white"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Dropdown sugerido */}
            {showModelDropdown && currentMfrData && (
              <div
                className="absolute z-20 mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg shadow-xl max-h-48 overflow-y-auto"
                onMouseLeave={() => setShowModelDropdown(false)}
              >
                <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 bg-slate-900/80">
                  Modelos Sugeridos - {manufacturer}
                </div>
                {currentMfrData.models
                  .filter((m) => m.toLowerCase().includes(model.toLowerCase()))
                  .map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => {
                        setModel(m);
                        setShowModelDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-sky-950/80 hover:text-sky-300 flex items-center justify-between font-mono"
                    >
                      <span>{m}</span>
                      <span className="text-[10px] text-slate-400">Oficial</span>
                    </button>
                  ))}
              </div>
            )}
          </div>

          {/* Tipo de Consulta */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Tipo de Consulta
            </label>
            <div className="relative">
              <select
                value={queryType}
                onChange={(e) => setQueryType(e.target.value as QueryType)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors appearance-none cursor-pointer"
              >
                <option value="fault">Código de Falha (Fault / Trip)</option>
                <option value="alarm">Alarme / Advertência (Warning)</option>
                <option value="parameter">Parâmetro de Configuração</option>
                <option value="symptom">Sintoma de Operação sem Código</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              {queryType === 'fault'
                ? 'Interrupção / Bloqueio imediato do drive'
                : queryType === 'alarm'
                  ? 'Aviso preventivo sem trip'
                  : queryType === 'parameter'
                    ? 'Consulta de endereço e escala'
                    : 'Ruído, aquecimento, vibração ou fuga'}
            </p>
          </div>

          {/* Código / Termo Exato */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              {queryType === 'symptom' ? 'Descrição Curta do Sintoma' : 'Código Exato do Manual'}
            </label>
            <div className="relative">
              <input
                type="text"
                value={queryCode}
                onChange={(e) => setQueryCode(e.target.value)}
                placeholder={
                  queryType === 'symptom'
                    ? 'Ex: Motor zumbindo sem girar'
                    : manufacturer === 'WEG'
                      ? 'Ex: F0006, F0021, P0295'
                      : manufacturer === 'Schneider Electric'
                        ? 'Ex: OCF, InF1, ACC'
                        : manufacturer === 'ABB'
                          ? 'Ex: 2310, 3181'
                          : manufacturer === 'Siemens'
                            ? 'Ex: F30001, p1082'
                            : 'Ex: Código do display'
                }
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors font-mono uppercase"
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-500">
                <Search className="w-4 h-4" />
              </div>
            </div>

            {/* Quick samples for active manufacturer */}
            {currentMfrData && (
              <div className="mt-1.5 flex flex-wrap gap-1">
                {currentMfrData.sampleCodes.slice(0, 3).map((sample) => (
                  <button
                    key={sample.code}
                    type="button"
                    onClick={() => {
                      setQueryCode(sample.code);
                      setQueryType(sample.type);
                    }}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-sky-400 hover:bg-sky-950 font-mono"
                    title={sample.label}
                  >
                    {sample.code}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Syntax Warning Banner if mismatched */}
        {validationWarning && (
          <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-800/60 flex items-start space-x-2.5 text-xs text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Aviso de Nomenclatura:</span> {validationWarning}
              <span className="block text-slate-400 text-[11px] mt-0.5">
                O DriveMaster AI analisará mesmo assim, buscando variações técnicas nos manuais globais.
              </span>
            </div>
          </div>
        )}

        {/* Context Accordion Toggle */}
        <div className="border-t border-slate-800 pt-3">
          <button
            type="button"
            onClick={() => setShowContext(!showContext)}
            className="flex items-center space-x-2 text-xs font-semibold text-slate-300 hover:text-sky-400 transition-colors"
          >
            <Sliders className="w-4 h-4 text-sky-400" />
            <span>Condições Operacionais & Dados do Técnico (Opcional para Laudo Mais Preciso)</span>
            {showContext ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showContext && (
            <div className="mt-4 p-4 rounded-lg bg-slate-950/70 border border-slate-800 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Tensão de Alimentação */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Tensão de Alimentação da Linha
                  </label>
                  <select
                    value={voltage}
                    onChange={(e) => setVoltage(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white"
                  >
                    {currentMfrData?.voltageClasses.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    )) || (
                      <>
                        <option value="220V Trifásico">220V Trifásico</option>
                        <option value="380V Trifásico">380V Trifásico</option>
                        <option value="440V Trifásico">440V Trifásico</option>
                        <option value="690V Trifásico">690V Trifásico</option>
                      </>
                    )}
                  </select>
                </div>

                {/* Tipo de Carga */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Tipo de Carga Acoplada
                  </label>
                  <select
                    value={loadType}
                    onChange={(e) => setLoadType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white"
                  >
                    {COMMON_LOAD_TYPES.map((lt) => (
                      <option key={lt} value={lt}>
                        {lt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Momento da Falha */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Momento da Ocorrência
                  </label>
                  <select
                    value={faultMoment}
                    onChange={(e) => setFaultMoment(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white"
                  >
                    {COMMON_FAULT_MOMENTS.map((fm) => (
                      <option key={fm} value={fm}>
                        {fm}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dados do Técnico para Assinatura do Laudo */}
              <div className="border-t border-slate-800/80 pt-3">
                <span className="text-[11px] font-bold text-sky-400 block mb-2">
                  Dados do Perito / Técnico Responsável (Para emissão no Laudo e PDF):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={technicianName}
                    onChange={(e) => setTechnicianName(e.target.value)}
                    placeholder="Nome do Técnico / Engenheiro"
                    className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white placeholder-slate-500"
                  />
                  <input
                    type="text"
                    value={technicianRegister}
                    onChange={(e) => setTechnicianRegister(e.target.value)}
                    placeholder="CREA / CFT / Matrícula"
                    className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white placeholder-slate-500"
                  />
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Empresa / Planta Industrial"
                    className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white placeholder-slate-500"
                  />
                </div>
              </div>

              {/* Observações adicionais */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Notas Adicionais de Campo (ruído estranho, cheiro de queimado, etc.)
                </label>
                <textarea
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="Ex: Falha ocorreu logo após oscilação da concessionária; motor estava operando em 60Hz com 85% de carga..."
                  rows={2}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white placeholder-slate-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Action Button & Scanning Animation */}
        <div className="pt-2">
          {isLoading ? (
            <div className="rounded-xl bg-slate-950 border border-sky-500/40 p-4 shadow-xl shadow-sky-500/10">
              <div className="flex items-center space-x-3">
                <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400">
                  <Zap className="w-5 h-5 animate-spin" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-sky-400 font-mono uppercase tracking-wider">
                      Processamento Pericial em Andamento...
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Temperatura: 0.15 (Strict)
                    </span>
                  </div>
                  <p className="text-sm font-medium text-white animate-pulse">
                    {scanStep || 'Escaneando esquemáticos e manuais de serviço...'}
                  </p>
                </div>
              </div>

              {/* Scanner Line Progress */}
              <div className="mt-3 w-full bg-slate-900 h-1.5 rounded-full overflow-hidden relative">
                <div className="h-full bg-gradient-to-r from-sky-500 via-cyan-300 to-sky-500 animate-[shimmer_1.5s_infinite] w-full rounded-full" />
              </div>
            </div>
          ) : (
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide bg-gradient-to-r from-sky-500 via-sky-600 to-blue-700 hover:from-sky-400 hover:via-sky-500 hover:to-blue-600 text-white shadow-lg shadow-sky-500/25 border border-sky-400/30 flex items-center justify-center space-x-2.5 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>GERAR LAUDO TÉCNICO ESPECIALIZADO</span>
              <FileCheck className="w-4 h-4 text-sky-200" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
