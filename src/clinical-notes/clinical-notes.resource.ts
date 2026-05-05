import { openmrsFetch } from "@openmrs/esm-framework";
import { getEtlBaseUrl } from "../shared/utils/get-base-url";
import { type Note, type ClinicalNotesParams, type NotesApiResponse } from "./types";

export async function fetchClinicalNotes(params: ClinicalNotesParams): Promise<Note[]> {
  const etlBaseUrl = await getEtlBaseUrl();
  const summaryUrl = `${etlBaseUrl}/patient/${params.patientUuid}/clinical-notes?startIndex=${params.startIndex}&limit=${params.limit}&includeNonClinicalEncounter=${params.includeNonClinicalEncounter}&isHEIActive=${params.isHEIActive}`;
  const resp = await openmrsFetch(summaryUrl);
  const data: NotesApiResponse = await resp.json();
  if (data && data.notes) {
    return data.notes;
  } else {
    return [];
  }
}