import { openmrsFetch } from "@openmrs/esm-framework";
import { getEtlBaseUrl } from "../shared/utils/get-base-url";
import { type CreateFeedbackMessageApiResp, type createFeedbackMessageDto } from "./types";

export async function sendUserFeedback(params: createFeedbackMessageDto): Promise<CreateFeedbackMessageApiResp | null> {
  const etlBaseUrl = await getEtlBaseUrl();
  const feedbackUrl = `${etlBaseUrl}/user-feedback`;
  const resp = await openmrsFetch(feedbackUrl,{
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  const data: CreateFeedbackMessageApiResp = await resp.json();
  if (data) {
    return data;
  } else {
    return null;
  }
}