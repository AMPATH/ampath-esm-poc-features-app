import { getAsyncLifecycle, defineConfigSchema, getSyncLifecycle } from '@openmrs/esm-framework';
import { configSchema } from './config-schema';
import { hivSummaryPatientChartMeta } from './dashboard-meta/hiv-summary-patient-chart.meta'
import { createDashboardLink } from './createDashboardLink';
import { userFeedbackMeta } from './dashboard-meta/user-feedback.meta';
import { clinicalNotesPatientChartMeta } from './dashboard-meta/clinical-notes-patient-chart.meta';

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

export const userFeedbackLink = getSyncLifecycle(createDashboardLink(userFeedbackMeta), options);
export const userFeedbackForm = getAsyncLifecycle(() => import('./user-feedback/user-feedback.component'), options);

//clinical notes
export const clinicalNotesPatientChartLink = getSyncLifecycle(createDashboardLink(clinicalNotesPatientChartMeta as any), options);
export const clinicalNotes = getAsyncLifecycle(() => import('./clinical-notes/clinical-notes.component'), options);

//clinical summary
export const clinicalSummary = getAsyncLifecycle(() => import('./clinical-summary/clinical-summary.component'), options);

