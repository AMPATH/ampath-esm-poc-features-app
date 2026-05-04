import { getAsyncLifecycle, defineConfigSchema, getSyncLifecycle } from '@openmrs/esm-framework';
import { configSchema } from './config-schema';
import { createDashboardLink as openMrsCreateDashboardLink } from '@openmrs/esm-patient-common-lib';
import { hivSummaryPatientChartMeta } from './dashboard-meta/hiv-summary-patient-chart.meta'

export const moduleName = '@ampath/esm-poc-features-app';

const options = {
  featureName: 'poc-features',
  moduleName,
};


export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
}

export const root = getAsyncLifecycle(() => import('./root.component'), options);

export const hivSummary = getAsyncLifecycle(() => import('./hiv-summary/hiv-summary.component'), options);

export const hivSummaryPatientChartLink = getSyncLifecycle(openMrsCreateDashboardLink(hivSummaryPatientChartMeta as any), options);
