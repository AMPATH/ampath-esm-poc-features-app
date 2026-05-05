export interface NotesApiResponse {
  notes: Note[];
  status: string;
}

export interface Note {
  visitDate: string;
  scheduled: number | null;
  providers: Provider[];
  lastViralLoad: LabResult;
  lastCD4Count: LabResult;
  artRegimen: ArtRegimen;
  tbProphylaxisPlan: TbProphylaxisPlan;
  ccHpi: any[];
  assessment: Assessment[];
  otherAssessment: any[];
  vitals: Vitals;
  rtcDate: string;
  mdtHistory: MdtHistory;
  eacSession: EacSession;
  homeVisit: HomeVisit;
}

export interface Provider {
  uuid: string;
  name: string;
  encounterType: string;
}

export interface LabResult {
  value: number;
  date: string;
}

export interface ArtRegimen {
  curArvMeds: string;
  curArvLine: number;
  arvStartDate: string;
}

export interface TbProphylaxisPlan {
  plan: string;
  estimatedEndDate: string;
  startDate: string;
}

export interface Assessment {
  obsDatetime: string;
  encounterType: string;
  value: string;
}

export interface Vitals {
  weight: number | string;
  height: number | string;
  bmi: number | string;
  temperature: number | string;
  oxygenSaturation: number | null | string;
  systolicBp: number | string;
  diastolicBp: number | string;
  pulse: number | string;
}

export interface MdtHistory {
  adherence: any[];
  exam: any[];
}

export interface EacSession {
  session1: Session1;
  session2: Session2;
  session3: Session3;
  session4: Session4;
  hasEacSession: boolean;
}

export interface SessionData {
  obsDatetime: string;
  encounterType: string;
  value: string;
}

export interface Session1 {
  cognitive_barriers: SessionData[];
  behavioral_barriers: SessionData[];
  emotional_barriers: SessionData[];
  socio_economic_barriers: SessionData[];
  enhanced_adherence_session: SessionData[];
}

export interface Session2 {
  review_adherence_plan: any[];
  new_issues: any[];
  referral_and_networking: any[];
  adherence_plan: any[];
}

export interface Session3 {
  adherence_plan_review: any[];
  new_issues: any[];
  referral_and_networking: any[];
  adherence_plan: any[];
  repeat_viral_load: any[];
}

export interface Session4 {
  viral_load_results: any[];
}

export interface HomeVisit {
  findings: any[];
  previous_interventions: any[];
  current_interventions: any[];
  arv_consumption_mode: any[];
  display: boolean;
}

export type ClinicalNotesParams = {
  patientUuid: string;
  startIndex: number;
  limit: number;
  includeNonClinicalEncounter: boolean;
  isHEIActive: boolean;
}