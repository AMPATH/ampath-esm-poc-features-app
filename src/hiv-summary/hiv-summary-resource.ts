import { openmrsFetch } from "@openmrs/esm-framework";
import { getEtlBaseUrl } from "../shared/utils/get-base-url";
import { type HivSummary, type HivSummaryApiResponse, type HivSummaryParams } from "./types";

const hivSummaryUrl = 'hiv-summary';

export async function fetchHivSummary(params: HivSummaryParams): Promise<HivSummary[]> {
  const etlBaseUrl = await getEtlBaseUrl();
  const summaryUrl = `${etlBaseUrl}/patient/${params.patientUuid}/hiv-summary?startIndex=${params.startIndex}&limit=${params.limit}&includeNonClinicalEncounter=${params.includeNonClinicalEncounter}&isHEIActive=${params.isHEIActive}`;
  const resp = await openmrsFetch(summaryUrl);
  const data: HivSummaryApiResponse = await resp.json();
  if (data && data.result) {
    return data.result;
  } else {
    return [];
  }
}