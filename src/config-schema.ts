import { Type, validator } from '@openmrs/esm-framework';

/**
 * This is the config schema. It expects a configuration object which
 * looks like this:
 *
 * ```json
 * { "casualGreeting": true, "whoToGreet": ["Mom"] }
 * ```
 *
 * In OpenMRS Microfrontends, all config parameters are optional. Thus,
 * all elements must have a reasonable default. A good default is one
 * that works well with the reference application.
 *
 * To understand the schema below, please read the configuration system
 * documentation:
 *   https://openmrs.github.io/openmrs-esm-core/#/main/config
 * Note especially the section "How do I make my module configurable?"
 *   https://openmrs.github.io/openmrs-esm-core/#/main/config?id=im-developing-an-esm-module-how-do-i-make-it-configurable
 * and the Schema Reference
 *   https://openmrs.github.io/openmrs-esm-core/#/main/config?id=schema-reference
 */
export const configSchema = {
   etlBaseUrl: {
    _type: Type.String,
    _description: 'ETL Endpoint',
    _default: '',
  },
  tbScreeningConceptUuid: {
    _type: Type.String,
    _description:
      'Concept UUID for the TB screening result observation. Used by the Clinical Summary widget as a fallback when the ETL endpoint does not return TB status.',
    _default: '',
  },
};

export type Config = {
  etlBaseUrl: string;
  tbScreeningConceptUuid: string;
};
