import { TechnicalReport } from '../types/diagnosis';

export interface ManufacturerInfo {
  name: string;
  country: string;
  standardParameterFormat: string;
  standardFaultFormat: string;
  models: string[];
  voltageClasses: string[];
  typicalDcBusWaitMin: number;
  sampleCodes: { code: string; type: 'fault' | 'alarm' | 'parameter'; label: string }[];
}

export const MANUFACTURERS_DATA: Record<string, ManufacturerInfo> = {
  WEG: {
    name: 'WEG',
    country: 'Brasil',
    standardParameterFormat: 'Pxxxx (ex: P0295, P0100, P0401)',
    standardFaultFormat: 'Fxxxx / Axxxx (ex: F0006, F0021, A0110)',
    models: ['CFW11', 'CFW500', 'CFW700', 'CFW08', 'CFW09', 'CFW100', 'MW500'],
    voltageClasses: ['200-240V Monofásico', '220-240V Trifásico', '380-480V Trifásico', '500-600V Trifásico', '690V Trifásico'],
    typicalDcBusWaitMin: 10,
    sampleCodes: [
      { code: 'F0006', type: 'fault', label: 'Sobrecorrente / Curto-circuito na saída' },
      { code: 'F0021', type: 'fault', label: 'Subtensão no Barramento CC (Under Voltage)' },
      { code: 'F0022', type: 'fault', label: 'Sobretensão no Barramento CC (Over Voltage)' },
      { code: 'A0110', type: 'alarm', label: 'Alarme de Sobrecarga no Motor (Ixt)' },
      { code: 'P0295', type: 'parameter', label: 'Corrente Nominal do Motor (In)' },
    ],
  },
  ABB: {
    name: 'ABB',
    country: 'Suíça / Suécia',
    standardParameterFormat: 'Grupo.Parâmetro (ex: 99.06, 20.01, 30.17)',
    standardFaultFormat: 'Código Hex/Numérico (ex: 2310, 3181, 7121, 5091)',
    models: ['ACS880', 'ACS580', 'ACS355', 'ACS380', 'ACS800', 'ACS150', 'ACH580'],
    voltageClasses: ['208-240V Trifásico', '380-480V Trifásico', '500-525V Trifásico', '690V Trifásico'],
    typicalDcBusWaitMin: 15,
    sampleCodes: [
      { code: '2310', type: 'fault', label: 'Overcurrent (Sobrecorrente de saída)' },
      { code: '3181', type: 'fault', label: 'Cross connection (Curto entre fases/cablagem)' },
      { code: '7121', type: 'fault', label: 'Motor stall (Rotor travado / Sobrecarga mecânica)' },
      { code: 'A2B1', type: 'alarm', label: 'Run enable missing (Habilitação ausente)' },
      { code: '99.06', type: 'parameter', label: 'Motor nominal current' },
    ],
  },
  'Schneider Electric': {
    name: 'Schneider Electric',
    country: 'França',
    standardParameterFormat: 'Mnemônicos textuais (ex: ACC, DEC, ItH, LSP, HSP, FrS)',
    standardFaultFormat: 'Mnemônico de 3-4 caracteres (ex: OCF, InF1, USF, OHF, SOF)',
    models: ['Altivar 320 (ATV320)', 'Altivar 630 (ATV630)', 'Altivar 930 (ATV930)', 'Altivar 71 (ATV71)', 'Altivar 312 (ATV312)', 'Altivar 12 (ATV12)'],
    voltageClasses: ['200-240V Monofásico', '200-240V Trifásico', '380-500V Trifásico', '525-690V Trifásico'],
    typicalDcBusWaitMin: 15,
    sampleCodes: [
      { code: 'OCF', type: 'fault', label: 'Overcurrent (Sobrecorrente instantânea)' },
      { code: 'InF1', type: 'fault', label: 'Internal Fault 1 (Falha no estágio de potência/IGBT)' },
      { code: 'USF', type: 'fault', label: 'Undervoltage Fault (Subtensão da rede)' },
      { code: 'OHF', type: 'fault', label: 'Drive Overheat (Sobreaquecimento do dissipador)' },
      { code: 'ItH', type: 'parameter', label: 'Proteção térmica do motor (Corrente de corte)' },
    ],
  },
  Siemens: {
    name: 'Siemens',
    country: 'Alemanha',
    standardParameterFormat: 'pxxxx ou rxxxx (ex: p1082, p0305, r0026)',
    standardFaultFormat: 'Fxxxxx / Axxxxx (ex: F30001, F07900, F07801, A07400)',
    models: ['Sinamics G120', 'Sinamics S120', 'Sinamics V20', 'Micromaster 440 (MM440)', 'Micromaster 420'],
    voltageClasses: ['200-240V Trifásico', '380-480V Trifásico', '500-690V Trifásico'],
    typicalDcBusWaitMin: 15,
    sampleCodes: [
      { code: 'F30001', type: 'fault', label: 'Power Unit: Overcurrent (Sobrecorrente na unidade)' },
      { code: 'F07900', type: 'fault', label: 'Motor blocked / speed deviation (Rotor bloqueado)' },
      { code: 'F07801', type: 'fault', label: 'Motor overcurrent (Sobrecorrente contínua do motor)' },
      { code: 'A07400', type: 'alarm', label: 'Drive: Maximum DC link voltage reached' },
      { code: 'p0305', type: 'parameter', label: 'Rated motor current' },
    ],
  },
  Danfoss: {
    name: 'Danfoss',
    country: 'Dinamarca',
    standardParameterFormat: 'P [grupo]-[índice] (ex: 1-24, 3-41, 4-16)',
    standardFaultFormat: 'Alarme Axx / Advertência Wxx (ex: A13, W13, A14, A8, W8)',
    models: ['VLT AutomationDrive FC 302', 'VLT AQUA Drive FC 202', 'VLT HVAC Drive FC 102', 'VLT Micro Drive FC 51'],
    voltageClasses: ['200-240V Trifásico', '380-480V Trifásico', '525-600V Trifásico', '525-690V Trifásico'],
    typicalDcBusWaitMin: 15,
    sampleCodes: [
      { code: 'A13', type: 'fault', label: 'Overcurrent (Pico de corrente no inversor)' },
      { code: 'A14', type: 'fault', label: 'Earth fault (Fuga para a terra / Falha de isolamento)' },
      { code: 'A8', type: 'fault', label: 'DC under voltage (Tensão do barramento DC muito baixa)' },
      { code: 'W13', type: 'alarm', label: 'Overcurrent warning (Advertência de sobrecorrente)' },
      { code: '1-24', type: 'parameter', label: 'Motor Current (Corrente nominal do motor)' },
    ],
  },
  Yaskawa: {
    name: 'Yaskawa',
    country: 'Japão',
    standardParameterFormat: 'Letra+Número (ex: b1-01, C1-01, E2-01, d1-01)',
    standardFaultFormat: 'Mnemônico 2-3 letras (ex: oC, oV, oH, GF, PUF, SC, Uv1)',
    models: ['GA700', 'A1000', 'V1000', 'J1000', 'GA500', 'Varispeed G7'],
    voltageClasses: ['200-240V Trifásico', '380-480V Trifásico', '500-600V Trifásico'],
    typicalDcBusWaitMin: 10,
    sampleCodes: [
      { code: 'oC', type: 'fault', label: 'Overcurrent (Corrente instantânea excedida)' },
      { code: 'oV', type: 'fault', label: 'Overvoltage (Sobretensão no barramento CC)' },
      { code: 'GF', type: 'fault', label: 'Ground Fault (Corrente de fuga à terra na saída)' },
      { code: 'Uv1', type: 'fault', label: 'DC Bus Undervoltage (Subtensão na entrada ou barramento)' },
      { code: 'E2-01', type: 'parameter', label: 'Motor Rated Current' },
    ],
  },
  'Rockwell / Allen-Bradley': {
    name: 'Rockwell / Allen-Bradley',
    country: 'EUA',
    standardParameterFormat: 'Pxxx, Axxx, bxxx (ex: P031, P041, A410, d301)',
    standardFaultFormat: 'Fxxx (ex: F012, F004, F005, F013, F070)',
    models: ['PowerFlex 525', 'PowerFlex 755', 'PowerFlex 753', 'PowerFlex 40', 'PowerFlex 4M'],
    voltageClasses: ['100-120V Monofásico', '200-240V Trifásico', '380-480V Trifásico', '600V Trifásico'],
    typicalDcBusWaitMin: 15,
    sampleCodes: [
      { code: 'F012', type: 'fault', label: 'HW Overcurrent (Corrente do estágio de potência excedida)' },
      { code: 'F004', type: 'fault', label: 'UnderVoltage (Tensão do barramento CC abaixo do limite)' },
      { code: 'F005', type: 'fault', label: 'OverVoltage (Regeneração excessiva de carga)' },
      { code: 'F013', type: 'fault', label: 'Ground Fault (Falha de aterramento no motor/cabo)' },
      { code: 'P031', type: 'parameter', label: 'Motor NP FLA (Corrente de Placa do Motor)' },
    ],
  },
  Delta: {
    name: 'Delta',
    country: 'Taiwan',
    standardParameterFormat: 'Grupo.Parâmetro (ex: 00-20, 01-00, 05-01)',
    standardFaultFormat: 'oc, ov, oh, lu, oL, GFF, cF1',
    models: ['MS300', 'VFD-M', 'VFD-E', 'CP2000', 'VFD-EL'],
    voltageClasses: ['220V Monofásico', '220V Trifásico', '380-480V Trifásico'],
    typicalDcBusWaitMin: 10,
    sampleCodes: [
      { code: 'oc', type: 'fault', label: 'Overcurrent during acceleration / steady state' },
      { code: 'ov', type: 'fault', label: 'Overvoltage during deceleration' },
      { code: 'GFF', type: 'fault', label: 'Ground Fault (Fuga para a carcaça/terra)' },
      { code: 'lu', type: 'fault', label: 'Low Voltage (Tensão da rede insuficiente)' },
      { code: '01-00', type: 'parameter', label: 'Maximum Output Frequency' },
    ],
  },
};

export const COMMON_LOAD_TYPES = [
  'Bomba Centrífuga',
  'Ventilador Industrial / Exaustor',
  'Compressor de Parafuso',
  'Extrusora de Polímeros',
  'Ponte Rolante / Içamento',
  'Correia Transportadora',
  'Misturador / Agitador',
  'Moinho de Bolas',
  'Torno / Fresadora CNC',
  'Bomba Dosadora',
];

export const COMMON_FAULT_MOMENTS = [
  'Instantânea no momento da partida (Start)',
  'Durante aceleração na rampa (Acc Ramp)',
  'Em regime contínuo de rotação nominal',
  'Durante desaceleração na rampa (Dec Ramp)',
  'Imediatamente ao energizar o inversor (pré-carga)',
  'Ao atingir pico de esforço mecânico',
  'Intermitente e sem padrão aparente',
];

// Offline verified manual knowledge base for high-fidelity responses
export const VERIFIED_MANUAL_REPORTS: Record<string, Partial<TechnicalReport>> = {
  'WEG-CFW11-F0006': {
    officialNomenclature: 'F0006: Sobrecorrente / Curto-Circuito na Saída (Overcurrent)',
    criticality: 'Crítico / Interrupção Imediata',
    criticalityScore: 9,
    shortSummary:
      'A corrente de saída nos bornes U, V ou W ultrapassou o limiar de proteção de hardware dos módulos IGBT (tipicamente ~200% a 250% de In nominal). Interrupção forçada instantânea para proteção contra destruição física dos semicondutores.',
    rootCauses: {
      electricalGrid: {
        summary: 'Transientes violentos de tensão ou desbalanceamento de fases na rede de alimentação.',
        items: [
          {
            title: 'Surtos de Chaveamento de Banco de Capacitores',
            description: 'Manobras na subestação induzem transientes de alta frequência com picos que forçam saturação dos drivers.',
            probability: 'Média',
            testMethod: 'Análise de distorção harmônica e oscilografia na entrada com analisador de energia.',
          },
          {
            title: 'Desbalanceamento severo de fases (> 3%)',
            description: 'Gera ondulação excessiva no link CC e assimetria na corrente sintetizada pelo inversor.',
            probability: 'Baixa',
            testMethod: 'Medição de tensão RMS entre fases R-S, S-T, T-R sob carga.',
          },
        ],
      },
      mechanicalLoad: {
        summary: 'Bloqueio mecânico instantâneo, emperramento ou inércia incompatível com a rampa configurada.',
        items: [
          {
            title: 'Rotor Travado ou Bloqueio de Eixo',
            description: 'Carga travada faz a impedância do motor cair para a reatância de dispersão de partida, gerando corrente de curto.',
            probability: 'Alta',
            testMethod: 'Giro manual do eixo desacoplado do motor para checar rolamentos e folgas.',
          },
          {
            title: 'Rampa de Aceleração Excessivamente Rápida (P0100 muito curto)',
            description: 'Inércia da carga exige torque superior ao limite de corrente dinâmico suportado pelo inversor.',
            probability: 'Alta',
            testMethod: 'Aumentar o parâmetro P0100 em 50% e testar com partida suave desacoplada.',
          },
        ],
      },
      motorCabling: {
        summary: 'Degradação dielétrica do enrolamento estatórico ou cabos de potência rompidos/esmagados.',
        items: [
          {
            title: 'Curto-circuito entre espiras ou fases (U-V, V-W, W-U)',
            description: 'Isolação das bobinas degradada por descargas parciais induzidas por dV/dt elevado.',
            probability: 'Alta',
            testMethod: 'Medição da resistência ôhmica das bobinas com miliohmímetro (desvio máximo aceitável < 2%).',
          },
          {
            title: 'Fuga para a Terra na Carcaça ou Conduíte',
            description: 'Cabo de potência prensado ou infiltração de umidade na caixa de ligação do motor.',
            probability: 'Alta',
            testMethod: 'Ensaio de isolamento com megômetro a 1000V DC por 1 minuto (resistência mínima > 20 MΩ).',
          },
          {
            title: 'Comprimento excessivo de cabos sem reatância de saída',
            description: 'Capacitância parasita dos cabos blindados longos (> 50m) provoca correntes capacitivas que ativam a proteção F0006.',
            probability: 'Média',
            testMethod: 'Inspeção do comprimento do cabo e presença de filtro dV/dt ou reatância de carga.',
          },
        ],
      },
      internalDrive: {
        summary: 'Falha catastrófica ou queima de transistores IGBT, sensores Hall ou circuito de gate drive.',
        items: [
          {
            title: 'Curto-circuito no Módulo IGBT de Potência',
            description: 'Perfuração de junção semicondutora por sobretensão ou fadiga térmica.',
            probability: 'Média',
            testMethod: 'Teste estático de diodos antiparalelo dos IGBTs (multímetro na escala de diodo: U-DC+, V-DC+, W-DC+ e U-DC-, V-DC-, W-DC-).',
          },
          {
            title: 'Defeito no Sensor de Corrente Hall ou Placa de Controle',
            description: 'Offset descalibrado no transdutor de corrente simulando sobrecorrente inexistente.',
            probability: 'Baixa',
            testMethod: 'Desconectar o motor nos bornes U, V, W e acionar o inversor em 5Hz; se acusar F0006 sem carga, a falha é interna no inversor.',
          },
        ],
      },
    },
    actionPlan: [
      {
        step: 1,
        phase: 'Não Invasiva',
        action: 'Desconecte os cabos do motor nos bornes de saída U, V e W do inversor CFW11.',
      },
      {
        step: 2,
        phase: 'Não Invasiva',
        action: 'Com os cabos desconectados, execute um comando de Gira/Para a 5 Hz. Se o erro F0006 persistir imediatamente sem carga conectada, a falha está confinada no módulo de potência (IGBT) ou placa de controle do inversor.',
      },
      {
        step: 3,
        phase: 'Medição com Instrumento',
        action: 'Teste estático dos IGBTs com o inversor desligado e descarregado.',
        measurementGuide: {
          instrument: 'Multímetro Digital na escala de teste de diodo (Vf)',
          expectedRange: '0,35V a 0,55V de queda direta; circuito aberto (OL) em polarização reversa.',
          procedure: 'Ponta vermelha em DC- e ponta preta alternadamente em U, V, W. Depois ponta preta em DC+ e vermelha em U, V, W. Valores próximos de 0.000V indicam IGBT perfurado/em curto.',
        },
      },
      {
        step: 4,
        phase: 'Medição com Instrumento',
        action: 'Teste de resistência ôhmica das bobinas do motor com miliohmímetro digital.',
        measurementGuide: {
          instrument: 'Miliohmímetro de 4 pontas (Kelvin) ou ponte de Wheatstone',
          expectedRange: 'Valores equilibrados entre U-V, V-W e W-U. Desbalanceamento máximo permitido de 2%.',
          procedure: 'Medir diretamente nos terminais da caixa de ligação do motor, com os cabos de alimentação desconectados.',
        },
      },
      {
        step: 5,
        phase: 'Medição com Instrumento',
        action: 'Ensaio de rigidez dielétrica e isolação dos enrolamentos contra a carcaça (terra).',
        measurementGuide: {
          instrument: 'Megômetro calibrado na faixa de 1000V CC',
          expectedRange: 'Resistência de isolação R_iso > 20 MΩ a 25°C (conforme ABNT NBR 5383 / IEEE 43).',
          procedure: 'Aplicar 1000V CC entre cada fase do motor e o terminal de aterramento (carcaça) durante 60 segundos.',
        },
      },
      {
        step: 6,
        phase: 'Parametrização',
        action: 'Revisar parametrização de rampa de aceleração e ganho de sobrecorrente.',
        measurementGuide: {
          instrument: 'IHM WEG CFW11',
          expectedRange: 'P0100 >= 5.0 s (conforme inércia); P0135 (Limite de Corrente) ajustado a 150% do motor.',
          procedure: 'Acesse o menu Parâmetros > Rampa (P0100) e aumente o tempo gradualmente até eliminar o pico de torque na partida.',
        },
      },
    ],
    nr10Safety: {
      dcBusDischargeTimeMinutes: 10,
      dcBusSafeVoltageThreshold: '< 50 V CC (verificar entre terminais +UD e -UD)',
      lotoProcedure: [
        'Desligar o disjuntor geral da alimentação de entrada do inversor.',
        'Inserir cadeado de bloqueio e garra de travamento (LOTO) na manopla do painel.',
        'Fixar etiqueta de advertência com identificação do responsável técnico, data, hora e motivo do bloqueio.',
        'Aguardar no mínimo 10 minutos para descarga total dos capacitores do barramento CC.',
        'Com multímetro CAT III 1000V / CAT IV 600V, medir a tensão entre +UD e -UD garantindo leitura inferior a 50V CC antes de tocar em qualquer borne.',
      ],
      mandatoryPPE: [
        'Luvas isolantes de borracha Classe 0 (1000V) com luva de proteção de vaqueta sobreposta',
        'Óculos de proteção com lente incolor e proteção contra arco elétrico (classe UV)',
        'Vestimenta antichama ATPV categoria 2 (mínimo 8 cal/cm²)',
        'Calçado de segurança ocupacional com solado bidensidade sem partes metálicas expostas',
      ],
      criticalCautions: [
        'PERIGO DE MORTE: A tensão no barramento CC pode atingir até 800V CC em inversores 380-480V e permanece letal após o desligamento da rede!',
        'NUNCA abra a tampa dos bornes antes de confirmar a descarga completa através da medição nos pontos de teste +UD/-UD.',
        'Nunca realize teste com megômetro nos cabos enquanto estiverem conectados aos bornes U, V, W do inversor (destruição imediata dos IGBTs).',
      ],
    },
    relatedParameters: [
      {
        code: 'P0295',
        name: 'Corrente Nominal do Inversor (In)',
        defaultValue: 'Fixo pelo hardware',
        suggestedCheck: 'Verificar se o inversor é compatível com a potência da carga e regime de sobrecarga (ND/HD).',
        relevance: 'Crítico',
      },
      {
        code: 'P0100',
        name: 'Tempo de Aceleração',
        defaultValue: '5.0 s',
        suggestedCheck: 'Aumentar o tempo se a falha ocorrer durante a rampa de aceleração.',
        relevance: 'Direto na partida',
      },
      {
        code: 'P0135',
        name: 'Limite Máximo de Corrente de Saída',
        defaultValue: '150 %',
        suggestedCheck: 'Checar se está calibrado de acordo com a placa do motor (P0401) e fator de serviço.',
        relevance: 'Proteção dinâmica',
      },
      {
        code: 'P0401',
        name: 'Corrente Nominal do Motor (In)',
        defaultValue: 'Conforme modelo',
        suggestedCheck: 'Garantir que corresponde exatamente ao valor impresso na placa de identificação do motor.',
        relevance: 'Modelagem térmica',
      },
      {
        code: 'P0297',
        name: 'Frequência de Chaveamento dos IGBTs',
        defaultValue: '2.5 kHz ou 5 kHz',
        suggestedCheck: 'Reduzir a frequência de chaveamento se houver aquecimento excessivo ou cabos longos.',
        relevance: 'Redução de dV/dt e capacitância',
      },
    ],
    preventiveRecommendations: [
      'Realizar termografia semestral no cubículo do inversor, barramento de entrada e bornes de potência.',
      'Se o cabo entre inversor e motor tiver mais de 30 metros, instalar reatância de saída ou filtro dV/dt na saída U, V, W.',
      'Reapertar todas as conexões de potência utilizando torquímetro calibrado conforme torque estipulado pelo manual WEG (tipicamente 4 a 6 N.m para potências médias).',
      'Efetuar periodicamente limpeza do dissipador de calor e inspeção dos ventiladores axiais de refrigeração.',
      'Registrar histórico de corrente no software SuperDrive / WLP para monitorar tendência de aumento de carga mecânica.',
    ],
  },
};
