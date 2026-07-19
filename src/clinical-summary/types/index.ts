export interface ClinicalSummaryApiResponse {
  tbStatus?: TBStatus;
  encounters?: Encounter[];
  diagnoses?: Diagnosis[];
  allergies?: Allergy[];
}

export interface ClinicalSummaryEndpointResponse {
  result: ClinicalSummaryApiResponse;
}

export interface TBStatus {
  latestResult: string;
  date: string;
  method?: string;
}

export interface Encounter {
  uuid: string;
  type: string;
  date: string;
  location?: string;
  provider?: string;
}

export interface Diagnosis {
  uuid: string;
  name: string;
  status: 'active' | 'inactive';
  onsetDate?: string;
  code?: string;
}

export interface Allergy {
  uuid: string;
  substance: string;
  reaction?: string;
  severity?: 'mild' | 'moderate' | 'severe';
}

export type ClinicalSummaryParams = {
  patientUuid: string;
  timeRangeMonths?: number;
};
