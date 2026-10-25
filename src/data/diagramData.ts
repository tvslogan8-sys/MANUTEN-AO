export interface TerminalInfo {
  pin: string;
  name: string;
  group: 'power-in' | 'power-out' | 'dc-bus' | 'dcBus' | 'brake' | 'ground' | 'digital-in' | 'analog-in' | 'analog-out' | 'relay';
  description: string;
  recommendedGauge: string;
  tighteningTorque: string;
  safetyCaution?: string;
  standardColorCode?: string;
}

export interface ModelDiagramConfig {
  manufacturer: string;
  model: string;
  standardInputVoltage: string;
  dcBusWaitMin: number;
  powerTerminals: {
    input: string[];
    output: string[];
    dcBus: string[];
    brake: string[];
    ground: string[];
  };
  controlTerminals: {
    digitalInputs: { pin: string; label: string; defaultFunc: string }[];
    analogInputs: { pin: string; label: string; defaultFunc: string }[];
    analogOutputs: { pin: string; label: string; defaultFunc: string }[];
    relayOutputs: { pin: string; label: string; defaultFunc: string }[];
    powerSupply: { pin: string; label: string }[];
  };
  terminalsDetail: Record<string, TerminalInfo>;
}

export const DIAGRAM_CONFIGS: Record<string, ModelDiagramConfig> = {
  WEG: {
    manufacturer: 'WEG',
    model: 'CFW11 / CFW500',
    standardInputVoltage: '380V - 480V CA Trifásico',
    dcBusWaitMin: 10,
    powerTerminals: {
      input: ['L1/R', 'L2/S', 'L3/T'],
      output: ['U/T1', 'V/T2', 'W/T3'],
      dcBus: ['+UD', '-UD'],
      brake: ['+UD', 'BR'],
      ground: ['PE'],
    },
    controlTerminals: {
      digitalInputs: [
        { pin: 'DI1', label: 'Entrada Digital 1', defaultFunc: 'Gira / Pára (Start/Stop)' },
        { pin: 'DI2', label: 'Entrada Digital 2', defaultFunc: 'Sentido de Giro (FWD/REV)' },
        { pin: 'DI3', label: 'Entrada Digital 3', defaultFunc: 'Reset de Falhas (Fault Reset)' },
        { pin: 'DI4', label: 'Entrada Digital 4', defaultFunc: 'Multi-velocidade / JOG' },
      ],
      analogInputs: [
        { pin: 'AI1+', label: 'Analógica 1 (+)', defaultFunc: 'Referência de Velocidade (0-10V)' },
        { pin: 'AI1-', label: 'Analógica 1 (-)', defaultFunc: 'Referência GND' },
      ],
      analogOutputs: [
        { pin: 'AO1', label: 'Saída Analógica 1', defaultFunc: 'Velocidade do Motor (0-20mA / 0-10V)' },
      ],
      relayOutputs: [
        { pin: '11 (COM)', label: 'Comum Relé 1', defaultFunc: 'Ponto Comum de Alarme/Falha' },
        { pin: '12 (NF)', label: 'Normal Fechado', defaultFunc: 'Contato sem falha (Segurança)' },
        { pin: '14 (NA)', label: 'Normal Aberto', defaultFunc: 'Fechamento em condição de trip' },
      ],
      powerSupply: [
        { pin: '+10V', label: 'Alimentação Potenciômetro 10V CC (máx 10mA)' },
        { pin: '24V', label: 'Fonte de Controle 24V CC (máx 150mA)' },
        { pin: 'GND', label: 'Referência comum 0V' },
      ],
    },
    terminalsDetail: {
      'L1/R': {
        pin: 'L1/R',
        name: 'Fase de Entrada R (Linha 1)',
        group: 'power-in',
        description: 'Conexão da fase R da rede elétrica CA através de disjuntor de proteção e contator.',
        recommendedGauge: '6 a 16 mm² (conforme corrente nominal)',
        tighteningTorque: '3.5 a 4.5 N.m',
        standardColorCode: 'Marrom / Preto (NBR 5410)',
      },
      'L2/S': {
        pin: 'L2/S',
        name: 'Fase de Entrada S (Linha 2)',
        group: 'power-in',
        description: 'Conexão da fase S da rede trifásica.',
        recommendedGauge: '6 a 16 mm²',
        tighteningTorque: '3.5 a 4.5 N.m',
        standardColorCode: 'Preto (NBR 5410)',
      },
      'L3/T': {
        pin: 'L3/T',
        name: 'Fase de Entrada T (Linha 3)',
        group: 'power-in',
        description: 'Conexão da fase T da rede trifásica.',
        recommendedGauge: '6 a 16 mm²',
        tighteningTorque: '3.5 a 4.5 N.m',
        standardColorCode: 'Cinza (NBR 5410)',
      },
      '+UD': {
        pin: '+UD',
        name: 'Polo Positivo do Barramento CC (DC Link)',
        group: 'dcBus',
        description: 'Polo positivo do banco de capacitores internos. Ponto de conexão para resistor de frenagem ou link CC comum.',
        recommendedGauge: 'Mesma bitola da rede',
        tighteningTorque: '3.5 a 4.5 N.m',
        safetyCaution: 'ATENÇÃO NR-10: Tensão atinge até ~800V CC! Aguardar 10 min de descarga e medir < 50V CC antes do toque.',
      },
      '-UD': {
        pin: '-UD',
        name: 'Polo Negativo do Barramento CC (DC Link)',
        group: 'dcBus',
        description: 'Polo negativo do banco de capacitores eletrolíticos.',
        recommendedGauge: 'Mesma bitola da rede',
        tighteningTorque: '3.5 a 4.5 N.m',
        safetyCaution: 'PERIGO: Reter carga residual com potencial letal mesmo desenergizado.',
      },
      'BR': {
        pin: 'BR',
        name: 'Chopper de Frenagem Dinâmica (Brake Resistor)',
        group: 'brake',
        description: 'Terminal conectado ao transistor Chopper interno para drenar energia regenerada na desaceleração até o resistor.',
        recommendedGauge: 'Cabo flexível resistente a alta temperatura (silicone)',
        tighteningTorque: '3.0 N.m',
        safetyCaution: 'O resistor de frenagem dissipa muito calor. Instalar com termostato de proteção bimetálico.',
      },
      'U/T1': {
        pin: 'U/T1',
        name: 'Saída Inversora Fase U',
        group: 'power-out',
        description: 'Saída modulada por largura de pulso (PWM) sintetizada pelos IGBTs até o enrolamento U do motor elétrico.',
        recommendedGauge: '6 a 16 mm² cabo blindado com malha aterrada 360°',
        tighteningTorque: '3.5 a 4.5 N.m',
        safetyCaution: 'NUNCA aplicar megômetro com o cabo conectado neste borne sob risco de destruir os IGBTs.',
      },
      'V/T2': {
        pin: 'V/T2',
        name: 'Saída Inversora Fase V',
        group: 'power-out',
        description: 'Saída modulada PWM fase V.',
        recommendedGauge: '6 a 16 mm² cabo blindado',
        tighteningTorque: '3.5 a 4.5 N.m',
      },
      'W/T3': {
        pin: 'W/T3',
        name: 'Saída Inversora Fase W',
        group: 'power-out',
        description: 'Saída modulada PWM fase W.',
        recommendedGauge: '6 a 16 mm² cabo blindado',
        tighteningTorque: '3.5 a 4.5 N.m',
      },
      'PE': {
        pin: 'PE',
        name: 'Terra de Proteção (Protective Earth)',
        group: 'ground',
        description: 'Aterramento principal do chassi e carcaça do inversor e carcaça do motor elétrico.',
        recommendedGauge: 'Mínimo 10 mm² ou condutor de cobre equivalente (NBR 5410)',
        tighteningTorque: '4.5 N.m',
        safetyCaution: 'Aterramento obrigatório conforme NR-10 para proteção contra choques de contato indireto e redução de EMI.',
      },
      'DI1': {
        pin: 'DI1',
        name: 'Entrada Digital 1 (Start / Stop)',
        group: 'digital-in',
        description: 'Comando de Habilitação Geral e Gira/Pára do motor (nível alto 24V CC).',
        recommendedGauge: '0.5 a 1.0 mm² par trançado blindado',
        tighteningTorque: '0.5 N.m',
      },
      'DI2': {
        pin: 'DI2',
        name: 'Entrada Digital 2 (Sentido de Giro)',
        group: 'digital-in',
        description: 'Inversão do sentido de rotação Horário (FWD) / Anti-horário (REV).',
        recommendedGauge: '0.5 a 1.0 mm²',
        tighteningTorque: '0.5 N.m',
      },
      'AI1+': {
        pin: 'AI1+',
        name: 'Entrada Analógica 1 (+)',
        group: 'analog-in',
        description: 'Referência analógica de frequência (0 a 10V CC via potenciômetro 10k ou CLP).',
        recommendedGauge: '0.5 mm² par trançado com malha aterrada apenas na extremidade do inversor',
        tighteningTorque: '0.5 N.m',
      },
      '14 (NA)': {
        pin: '14 (NA)',
        name: 'Saída a Relé de Falha (Contato NA)',
        group: 'relay',
        description: 'Contato seco normalmente aberto que comuta ao ocorrer qualquer trip ou falha no inversor (intertravamento do painel).',
        recommendedGauge: '1.0 mm²',
        tighteningTorque: '0.5 N.m',
      },
    },
  },
  'Schneider Electric': {
    manufacturer: 'Schneider Electric',
    model: 'Altivar 320 (ATV320) / ATV630',
    standardInputVoltage: '380V - 500V CA Trifásico',
    dcBusWaitMin: 15,
    powerTerminals: {
      input: ['R/L1', 'S/L2', 'T/L3'],
      output: ['U/T1', 'V/T2', 'W/T3'],
      dcBus: ['PA/+', 'PC/-'],
      brake: ['PA/+', 'PB'],
      ground: ['PE'],
    },
    controlTerminals: {
      digitalInputs: [
        { pin: 'DI1', label: 'Digital Input 1', defaultFunc: 'Forward Run (Sentido Horário)' },
        { pin: 'DI2', label: 'Digital Input 2', defaultFunc: 'Reverse Run (Sentido Anti-horário)' },
        { pin: 'DI3', label: 'Digital Input 3', defaultFunc: 'Preset Speed 1 (Velocidade Pré-selecionada)' },
        { pin: 'DI4', label: 'Digital Input 4', defaultFunc: 'Fault Reset (Reinicialização de Falhas)' },
      ],
      analogInputs: [
        { pin: 'AI1', label: 'Analog Input 1', defaultFunc: '0-10V DC Speed Reference' },
      ],
      analogOutputs: [
        { pin: 'AQ1', label: 'Analog Output 1', defaultFunc: 'Motor Frequency 0-20mA' },
      ],
      relayOutputs: [
        { pin: 'R1A', label: 'Relay 1 NO', defaultFunc: 'Fault Relay Normally Open Contact' },
        { pin: 'R1B', label: 'Relay 1 NC', defaultFunc: 'Fault Relay Normally Closed Contact' },
        { pin: 'R1C', label: 'Relay 1 Common', defaultFunc: 'Fault Relay Common Terminal' },
      ],
      powerSupply: [
        { pin: '+10V', label: 'Reference 10V DC for Potentiometer' },
        { pin: '+24V', label: '24V DC Internal Logic Supply' },
        { pin: 'COM', label: 'Common 0V for I/O' },
      ],
    },
    terminalsDetail: {
      'R/L1': {
        pin: 'R/L1',
        name: 'Mains Supply Input L1',
        group: 'power-in',
        description: 'Entrada de alimentação trifásica da rede.',
        recommendedGauge: '6 a 16 mm²',
        tighteningTorque: '3.5 N.m',
      },
      'PA/+': {
        pin: 'PA/+',
        name: 'DC Bus Positive & Dynamic Brake Connection',
        group: 'dcBus',
        description: 'Barramento CC positivo. Conectar terminal 1 do resistor de frenagem neste ponto.',
        recommendedGauge: '6 a 16 mm²',
        tighteningTorque: '3.5 N.m',
        safetyCaution: 'Aguardar 15 min de descarga e medir < 50V CC antes de manusear.',
      },
      'PB': {
        pin: 'PB',
        name: 'Braking Resistor Terminal',
        group: 'brake',
        description: 'Conectar terminal 2 do resistor de frenagem dinâmico.',
        recommendedGauge: 'Cabo térmico',
        tighteningTorque: '3.5 N.m',
      },
      'PC/-': {
        pin: 'PC/-',
        name: 'DC Bus Negative',
        group: 'dcBus',
        description: 'Pólo negativo do barramento CC interno.',
        recommendedGauge: '6 a 16 mm²',
        tighteningTorque: '3.5 N.m',
        safetyCaution: 'Perigo de choque de alta energia.',
      },
      'U/T1': {
        pin: 'U/T1',
        name: 'Motor Output U',
        group: 'power-out',
        description: 'Fase de saída PWM para motor elétrico.',
        recommendedGauge: 'Cabo blindado',
        tighteningTorque: '3.5 N.m',
      },
      'R1A': {
        pin: 'R1A',
        name: 'Relé de Falha (Contato Aberto)',
        group: 'relay',
        description: 'Comuta em caso de desarme de proteção (OCF, InF1, USF, etc.).',
        recommendedGauge: '1.0 mm²',
        tighteningTorque: '0.5 N.m',
      },
    },
  },
  ABB: {
    manufacturer: 'ABB',
    model: 'ACS880 / ACS580',
    standardInputVoltage: '380V - 480V CA Trifásico',
    dcBusWaitMin: 15,
    powerTerminals: {
      input: ['L1', 'L2', 'L3'],
      output: ['T1/U', 'T2/V', 'T3/W'],
      dcBus: ['UDC+', 'UDC-'],
      brake: ['R+', 'R-'],
      ground: ['PE'],
    },
    controlTerminals: {
      digitalInputs: [
        { pin: 'DI1', label: 'Digital Input 1', defaultFunc: 'Start / Stop' },
        { pin: 'DI2', label: 'Digital Input 2', defaultFunc: 'Direction (FWD / REV)' },
        { pin: 'DI3', label: 'Digital Input 3', defaultFunc: 'Fault Reset' },
      ],
      analogInputs: [
        { pin: 'AI1', label: 'Analog Input 1', defaultFunc: 'Speed Reference (0-10V)' },
      ],
      analogOutputs: [
        { pin: 'AO1', label: 'Analog Output 1', defaultFunc: 'Motor Speed Output (0-20mA)' },
      ],
      relayOutputs: [
        { pin: 'RO1', label: 'Relay 1 (Ready)', defaultFunc: 'Drive Ready for Run' },
        { pin: 'RO2', label: 'Relay 2 (Fault)', defaultFunc: 'Drive Fault (-1 / Trip)' },
      ],
      powerSupply: [
        { pin: '+24V', label: 'Auxiliary 24V DC Supply' },
        { pin: 'DGND', label: 'Digital Ground' },
      ],
    },
    terminalsDetail: {
      'L1': {
        pin: 'L1',
        name: 'Mains Power L1',
        group: 'power-in',
        description: 'Entrada trifásica da rede.',
        recommendedGauge: '6 a 25 mm²',
        tighteningTorque: '4.0 N.m',
      },
      'UDC+': {
        pin: 'UDC+',
        name: 'DC Bus Positive Terminal',
        group: 'dcBus',
        description: 'Barramento CC retificado.',
        recommendedGauge: 'Mesma bitola de entrada',
        tighteningTorque: '4.0 N.m',
        safetyCaution: 'Aguardar 15 min de descarga antes de tocar nos bornes.',
      },
      'R+': {
        pin: 'R+',
        name: 'Brake Resistor Positive',
        group: 'brake',
        description: 'Conexão do resistor de frenagem Chopper.',
        recommendedGauge: 'Cabo térmico',
        tighteningTorque: '4.0 N.m',
      },
      'T1/U': {
        pin: 'T1/U',
        name: 'Motor Output U',
        group: 'power-out',
        description: 'Saída trifásica PWM até o motor.',
        recommendedGauge: 'Cabo blindado simétrico',
        tighteningTorque: '4.0 N.m',
      },
    },
  },
  Siemens: {
    manufacturer: 'Siemens',
    model: 'Sinamics G120 (PM240 / CU240E-2)',
    standardInputVoltage: '380V - 480V CA Trifásico',
    dcBusWaitMin: 15,
    powerTerminals: {
      input: ['L1', 'L2', 'L3'],
      output: ['U', 'V', 'W'],
      dcBus: ['DCP', 'DCN'],
      brake: ['R1', 'R2'],
      ground: ['PE'],
    },
    controlTerminals: {
      digitalInputs: [
        { pin: 'DI 0', label: 'Digital Input 0', defaultFunc: 'ON / OFF 1 (Comando de Marcha)' },
        { pin: 'DI 1', label: 'Digital Input 1', defaultFunc: 'Inversão de Rotação (Reversing)' },
        { pin: 'DI 2', label: 'Digital Input 2', defaultFunc: 'Reconhecimento de Falhas (Acknowledge)' },
      ],
      analogInputs: [
        { pin: 'AI 0+', label: 'Analog Input 0+', defaultFunc: 'Set point de Frequência 0 a 10V' },
      ],
      analogOutputs: [
        { pin: 'AO 0', label: 'Analog Output 0', defaultFunc: 'Frequência Real de Saída (0-20mA)' },
      ],
      relayOutputs: [
        { pin: 'DO 0 NC', label: 'Digital Output 0 (Relay)', defaultFunc: 'Contato de Falha (F30001 / F07900)' },
        { pin: 'DO 0 NO', label: 'Digital Output 0 (Relay)', defaultFunc: 'Contato Aberto em Operação Normal' },
      ],
      powerSupply: [
        { pin: '10V', label: 'Alimentação de Potenciômetro' },
        { pin: '24V OUT', label: 'Saída 24V CC de Controle' },
        { pin: '0V', label: 'Comum GND' },
      ],
    },
    terminalsDetail: {
      'L1': {
        pin: 'L1',
        name: 'Fase de Linha L1',
        group: 'power-in',
        description: 'Conexão da rede de alimentação na Unidade de Potência PM240.',
        recommendedGauge: '6 a 16 mm²',
        tighteningTorque: '3.5 N.m',
      },
      'DCP': {
        pin: 'DCP',
        name: 'DC Link Positive Pole',
        group: 'dcBus',
        description: 'Polo positivo do link de tensão contínua.',
        recommendedGauge: '6 a 16 mm²',
        tighteningTorque: '3.5 N.m',
        safetyCaution: 'Aguardar descarga completa de 15 minutos e medir com voltímetro.',
      },
      'R1': {
        pin: 'R1',
        name: 'Resistor de Frenagem R1',
        group: 'brake',
        description: 'Conexão do resistor de dissipação regenerativa.',
        recommendedGauge: 'Cabo térmico',
        tighteningTorque: '3.5 N.m',
      },
      'U': {
        pin: 'U',
        name: 'Saída Inversora U',
        group: 'power-out',
        description: 'Saída para o motor elétrico assíncrono ou síncrono.',
        recommendedGauge: 'Cabo blindado com blindagem contínua',
        tighteningTorque: '3.5 N.m',
      },
    },
  },
};

// Fallback config generator for other manufacturers
export function getDiagramConfigFor(manufacturer: string, model: string): ModelDiagramConfig {
  if (DIAGRAM_CONFIGS[manufacturer]) {
    return DIAGRAM_CONFIGS[manufacturer];
  }

  // Generic industrial standardized fallback
  return {
    manufacturer: manufacturer || 'Industrial',
    model: model || 'Padrão IEC/NEMA',
    standardInputVoltage: '380V - 480V CA Trifásico',
    dcBusWaitMin: 15,
    powerTerminals: {
      input: ['L1/R', 'L2/S', 'L3/T'],
      output: ['U/T1', 'V/T2', 'W/T3'],
      dcBus: ['DC+', 'DC-'],
      brake: ['DC+', 'BR'],
      ground: ['PE'],
    },
    controlTerminals: {
      digitalInputs: [
        { pin: 'DI1', label: 'Entrada Digital 1', defaultFunc: 'Start / Stop (Gira/Pára)' },
        { pin: 'DI2', label: 'Entrada Digital 2', defaultFunc: 'Forward / Reverse (Sentido)' },
        { pin: 'DI3', label: 'Entrada Digital 3', defaultFunc: 'Fault Reset (Reset de Falha)' },
      ],
      analogInputs: [
        { pin: 'AI1', label: 'Entrada Analógica 1', defaultFunc: 'Referência de Velocidade (0-10V)' },
      ],
      analogOutputs: [
        { pin: 'AO1', label: 'Saída Analógica 1', defaultFunc: 'Frequência do Motor (0-20mA)' },
      ],
      relayOutputs: [
        { pin: 'RL_COM', label: 'Comum Relé de Falha', defaultFunc: 'Ponto Comum de Alarme' },
        { pin: 'RL_NO', label: 'Normal Aberto', defaultFunc: 'Acionamento na Falha / Trip' },
      ],
      powerSupply: [
        { pin: '+24V', label: 'Fonte de Controle 24V CC' },
        { pin: 'GND', label: 'Referência comum 0V' },
      ],
    },
    terminalsDetail: {
      'L1/R': {
        pin: 'L1/R',
        name: 'Entrada de Linha L1',
        group: 'power-in',
        description: 'Alimentação trifásica da rede.',
        recommendedGauge: '6 a 16 mm²',
        tighteningTorque: '3.5 N.m',
      },
      'DC+': {
        pin: 'DC+',
        name: 'Polo Positivo Link CC',
        group: 'dcBus',
        description: 'Barramento CC interno retificado.',
        recommendedGauge: '6 a 16 mm²',
        tighteningTorque: '3.5 N.m',
        safetyCaution: 'Aguardar descarga mínima de 15 minutos antes de manuseio.',
      },
      'U/T1': {
        pin: 'U/T1',
        name: 'Saída Inversora U',
        group: 'power-out',
        description: 'Alimentação PWM para o motor elétrico.',
        recommendedGauge: 'Cabo blindado com malha aterrada',
        tighteningTorque: '3.5 N.m',
      },
    },
  };
}
