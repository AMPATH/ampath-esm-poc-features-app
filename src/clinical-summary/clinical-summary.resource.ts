import { openmrsFetch } from '@openmrs/esm-framework';
import { getEtlBaseUrl } from '../shared/utils/get-base-url';
import { getTbScreeningConceptUuid } from '../shared/utils/get-tb-screening-concept-uuid';
import {
  type Allergy,
  type ClinicalSummaryApiResponse,
  type ClinicalSummaryEndpointResponse,
  type ClinicalSummaryParams,
  type Diagnosis,
  type Encounter,
  type TBStatus,
} from './types';

/**
 * Fetches the clinical summary from the custom ETL endpoint, then fills in
 * any sections it doesn't return by querying OpenMRS directly.
 */
export async function fetchClinicalSummary(params: ClinicalSummaryParams): Promise<ClinicalSummaryApiResponse> {
  const summary = await fetchFromCustomEndpoint(params);

  const [tbStatus, diagnoses, encounters, allergies] = await Promise.all([
    summary.tbStatus ?? fetchTBStatusFallback(params.patientUuid),
    summary.diagnoses?.length ? summary.diagnoses : fetchDiagnosesFallback(params.patientUuid),
    summary.encounters?.length
      ? summary.encounters
      : fetchEncountersFallback(params.patientUuid, params.timeRangeMonths ?? 6),
    summary.allergies?.length ? summary.allergies : fetchAllergiesFallback(params.patientUuid),
  ]);

  return { tbStatus, diagnoses, encounters, allergies };
}

async function fetchFromCustomEndpoint(params: ClinicalSummaryParams): Promise<ClinicalSummaryApiResponse> {
  try {
    const etlBaseUrl = await getEtlBaseUrl();
    const summaryUrl = `${etlBaseUrl}/patient/${params.patientUuid}/clinical-summary`;
    const resp = await openmrsFetch(summaryUrl);
    const data: ClinicalSummaryEndpointResponse = await resp.json();
    return data?.result ?? {};
  } catch (error) {
    console.warn('Clinical summary ETL endpoint unavailable, falling back to OpenMRS data:', error);
    return {};
  }
}

/**
 * Fallback: latest TB screening observation, keyed off a configurable concept UUID
 * since this ETL system has no separate TB status concept beyond the screening obs itself.
 */
async function fetchTBStatusFallback(patientUuid: string): Promise<TBStatus | undefined> {
  try {
    const tbScreeningConceptUuid = await getTbScreeningConceptUuid();
    if (!tbScreeningConceptUuid) {
      return undefined;
    }
    const url = `/ws/rest/v1/obs?patient=${patientUuid}&concept=${tbScreeningConceptUuid}&v=full&limit=1`;
    const resp = await openmrsFetch(url);
    const data = await resp.json();
    const obs = data?.results?.[0];
    if (!obs) {
      return undefined;
    }
    return {
      latestResult: obs.value?.display ?? String(obs.value ?? 'Unknown'),
      date: obs.obsDatetime,
    };
  } catch (error) {
    console.warn('Error fetching TB status fallback from OpenMRS:', error);
    return undefined;
  }
}

/**
 * Fallback: patient conditions via the FHIR2 module, since core REST has no condition resource.
 */
async function fetchDiagnosesFallback(patientUuid: string): Promise<Diagnosis[]> {
  try {
    const url = `/ws/fhir2/R4/Condition?patient=${patientUuid}`;
    const resp = await openmrsFetch(url);
    const data = await resp.json();
    const entries = data?.entry ?? [];
    return entries.map(({ resource }: { resource: any }) => ({
      uuid: resource.id,
      name: resource.code?.text ?? resource.code?.coding?.[0]?.display ?? 'Unknown',
      status: resource.clinicalStatus?.coding?.some((c: any) => c.code === 'active') ? 'active' : 'inactive',
      onsetDate: resource.onsetDateTime,
      code: resource.code?.coding?.[0]?.code,
    }));
  } catch (error) {
    console.warn('Error fetching diagnoses fallback from OpenMRS:', error);
    return [];
  }
}

/**
 * Fallback: recent encounters via core REST, since this is a standard resource on every OpenMRS server.
 */
async function fetchEncountersFallback(patientUuid: string, monthsBack: number): Promise<Encounter[]> {
  try {
    const fromDate = new Date();
    fromDate.setMonth(fromDate.getMonth() - monthsBack);
    const fromDateStr = fromDate.toISOString().split('T')[0];
    const rep = 'custom:(uuid,encounterType,encounterDatetime,location,encounterProviders:(provider:(display)))';
    const url = `/ws/rest/v1/encounter?patient=${patientUuid}&fromdate=${fromDateStr}&v=${rep}&limit=100`;
    const resp = await openmrsFetch(url);
    const data = await resp.json();
    const results = data?.results ?? [];
    return results.map((enc: any) => ({
      uuid: enc.uuid,
      type: enc.encounterType?.display ?? 'Unknown',
      date: enc.encounterDatetime,
      location: enc.location?.display,
      provider: enc.encounterProviders?.[0]?.provider?.display,
    }));
  } catch (error) {
    console.warn('Error fetching encounters fallback from OpenMRS:', error);
    return [];
  }
}

/**
 * Fallback: allergies via the FHIR2 module, since core REST has no allergyIntolerance resource.
 */
async function fetchAllergiesFallback(patientUuid: string): Promise<Allergy[]> {
  try {
    const url = `/ws/fhir2/R4/AllergyIntolerance?patient=${patientUuid}`;
    const resp = await openmrsFetch(url);
    const data = await resp.json();
    const entries = data?.entry ?? [];
    return entries.map(({ resource }: { resource: any }) => {
      const reaction = resource.reaction?.[0];
      return {
        uuid: resource.id,
        substance: resource.code?.text ?? resource.code?.coding?.[0]?.display ?? 'Unknown substance',
        reaction: reaction?.manifestation?.[0]?.text ?? reaction?.manifestation?.[0]?.coding?.[0]?.display,
        severity: reaction?.severity,
      };
    });
  } catch (error) {
    console.warn('Error fetching allergies fallback from OpenMRS:', error);
    return [];
  }
}
