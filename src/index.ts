import { getAsyncLifecycle, defineConfigSchema, getSyncLifecycle } from '@openmrs/esm-framework';
import { configSchema } from './config-schema';
import { hivSummaryPatientChartMeta } from './dashboard-meta/hiv-summary-patient-chart.meta'
import { createDashboardLink } from './createDashboardLink';

export const moduleName = '@ampath/esm-poc-features-app';

const options = {
  featureName: 'Poc Features',
  moduleName,
};


export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
}

export const root = getAsyncLifecycle(() => import('./root.component'), options);

export const hivSummary = getAsyncLifecycle(() => import('./hiv-summary/hiv-summary.component'), options);

export const hivSummaryPatientChartLink = getSyncLifecycle(createDashboardLink(hivSummaryPatientChartMeta as any), options);
