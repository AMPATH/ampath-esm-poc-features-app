import { openmrsFetch } from "@openmrs/esm-framework";
import { getEtlBaseUrl } from "../../shared/utils/get-base-url";
import { type MedicationChangeHistory, type MedicationReportApiResp } from "../types";


export async function fetchPatientMedicationHistoryReport(patientUuid: string): Promise<MedicationChangeHistory[]> {
  const etlBaseUrl = await getEtlBaseUrl();
  const medicationChangeUrl = `${etlBaseUrl}/patient/${patientUuid}/medical-history-report`;
  const resp = await openmrsFetch(medicationChangeUrl);
  const data:MedicationReportApiResp  = await resp.json();
  if (data && data.result) {
    return data.result;
  } else {
    return [];
  }
}