import { getConfig } from '@openmrs/esm-framework';
import { moduleName } from '../../index';

export async function getTbScreeningConceptUuid() {
  const { tbScreeningConceptUuid } = await getConfig(moduleName);
  return tbScreeningConceptUuid ?? null;
}
