import { z } from 'zod';

export const ManufacturerEnum = z.enum([
  'WEG',
  'ABB',
  'Schneider Electric',
  'Siemens',
  'Danfoss',
  'Yaskawa',
  'Delta',
  'Rockwell / Allen-Bradley',
  'Outro',
]);

export type Manufacturer = z.infer<typeof ManufacturerEnum>;

export const QueryTypeEnum = z.enum([
  'fault', // Código de Falha
  'alarm', // Alarme / Advertência
  'parameter', // Parâmetro de Configuração
  'symptom', // Sintoma sem código
]);

export type QueryType = z.infer<typeof QueryTypeEnum>;

export const DiagnosisRequestSchema = z.object({
  manufacturer: z.string().min(1, 'Fabricante é obrigatório'),
  model: z.string().min(1, 'Modelo do inversor é obrigatório'),
  queryType: QueryTypeEnum,
  queryCode: z.string().min(1, 'Código ou sintoma é obrigatório').max(200),
  operationalContext: z
    .object({
      voltage: z.string().optional(),
      loadType: z.string().optional(),
      faultMoment: z.string().optional(),
      additionalNotes: z.string().optional(),
    })
    .optional(),
  technicianName: z.string().optional(),
  technicianRegister: z.string().optional(),
  companyName: z.string().optional(),
});

export type DiagnosisRequest = z.infer<typeof DiagnosisRequestSchema>;

export interface RootCauseItem {
  title: string;
  description: string;
  probability: 'Alta' | 'Média' | 'Baixa';
  testMethod: string;
}

export interface RootCauseBreakdown {
  electricalGrid: {
    summary: string;
    items: RootCauseItem[];
  };
  mechanicalLoad: {
    summary: string;
    items: RootCauseItem[];
  };
  motorCabling: {
    summary: string;
    items: RootCauseItem[];
  };
  internalDrive: {
    summary: string;
    items: RootCauseItem[];
  };
}

export interface ActionStep {
  step: number;
  phase: 'Não Invasiva' | 'Medição com Instrumento' | 'Intervenção Mecânica/Elétrica' | 'Parametrização';
  action: string;
  measurementGuide?: {
    instrument: string;
    expectedRange: string;
    procedure: string;
  };
}

export interface RelatedParameter {
  code: string;
  name: string;
  defaultValue?: string;
  suggestedCheck: string;
  relevance: string;
}

export interface TechnicalReport {
  id: string;
  reportCode: string;
  createdAt: string;
  manufacturer: string;
  model: string;
  queryType: QueryType;
  queryCode: string;
  officialNomenclature: string;
  criticality: 'Crítico / Interrupção Imediata' | 'Médio / Atenção Operacional' | 'Baixo / Monitoramento';
  criticalityScore: number; // 1 to 10
  shortSummary: string;
  rootCauses: RootCauseBreakdown;
  actionPlan: ActionStep[];
  nr10Safety: {
    dcBusDischargeTimeMinutes: number;
    dcBusSafeVoltageThreshold: string;
    lotoProcedure: string[];
    mandatoryPPE: string[];
    criticalCautions: string[];
  };
  relatedParameters: RelatedParameter[];
  preventiveRecommendations: string[];
  operationalContext?: {
    voltage?: string;
    loadType?: string;
    faultMoment?: string;
    additionalNotes?: string;
  };
  technicianData?: {
    name?: string;
    register?: string; // CREA / CFT
    company?: string;
    signedAt?: string;
  };
  engineMeta: {
    source: 'Gemini 3.8 Flash' | 'Knowledge Base Oficial';
    temperature: number;
    confidence: number;
  };
}
