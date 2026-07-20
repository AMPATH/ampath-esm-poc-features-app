import React, { useEffect, useState } from 'react';
import styles from './clinical-summary.component.scss';
import {
  InlineLoading,
  Pagination,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tag,
} from '@carbon/react';
import { usePatient } from '@openmrs/esm-framework';
import { type ClinicalSummaryApiResponse, type ClinicalSummaryParams } from './types';
import { fetchClinicalSummary } from './clinical-summary.resource';
import { formatStringDate } from '../shared/utils/format-string-date';

interface ClinicalSummaryProps {}

const ClinicalSummary: React.FC<ClinicalSummaryProps> = () => {
  const { isLoading, error, patient } = usePatient();
  const [summary, setSummary] = useState<ClinicalSummaryApiResponse>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [encounterPage, setEncounterPage] = useState<number>(1);
  const [encounterPageSize, setEncounterPageSize] = useState<number>(5);

  useEffect(() => {
    if (patient) {
      getClinicalSummary(patient.id);
    }
  }, [patient]);

  if (isLoading) return <div>Loading…</div>;
  if (error) return <div>Error loading patient</div>;

  async function getClinicalSummary(patientUuid: string) {
    setLoading(true);
    const params: ClinicalSummaryParams = {
      patientUuid: patientUuid,
      timeRangeMonths: 6,
    };
    try {
      const resp = await fetchClinicalSummary(params);
      if (resp) {
        setSummary(resp);
      }
    } finally {
      setLoading(false);
    }
  }

  function getTbStatusBadgeVariant(latestResult: string): 'positive' | 'negative' | 'neutral' {
    const result = latestResult?.toLowerCase() ?? '';
    if (result.includes('positive')) return 'positive';
    if (result.includes('negative')) return 'negative';
    return 'neutral';
  }

  function getAllergySeverityTagType(severity: string): 'red' | 'magenta' | 'green' {
    if (severity === 'severe') return 'red';
    if (severity === 'moderate') return 'magenta';
    return 'green';
  }

  const encounters = summary.encounters ?? [];
  const paginatedEncounters = encounters.slice(
    (encounterPage - 1) * encounterPageSize,
    encounterPage * encounterPageSize,
  );

  return (
    <div className={styles.clinicalSummaryLayout}>
      <div className={styles.cardHeader}>
        <h4>Patient Visit Summary</h4>
      </div>
      <div className={styles.clinicalSummaryContent}>
        {loading ? (
          <InlineLoading description="Fetching patient visit summary..please wait" />
        ) : (
          <Tabs>
            <TabList>
              <Tab>TB Screening Status</Tab>
              <Tab>Diagnoses</Tab>
              <Tab>Previous Encounters</Tab>
              <Tab>Allergies &amp; Adverse Reactions</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                {summary.tbStatus ? (
                  <div className={styles.tbStatus}>
                    <span
                      className={`${styles.statusBadge} ${styles[getTbStatusBadgeVariant(summary.tbStatus.latestResult)]}`}
                    >
                      {summary.tbStatus.latestResult}
                    </span>
                    <span>{formatStringDate(summary.tbStatus.date)}</span>
                    {summary.tbStatus.method && <span>({summary.tbStatus.method})</span>}
                  </div>
                ) : (
                  <>No TB screening data available</>
                )}
              </TabPanel>

              <TabPanel>
                {summary.diagnoses && summary.diagnoses.length > 0 ? (
                  <Table aria-label="diagnoses table" size="lg">
                    <TableHead>
                      <TableRow>
                        <TableHeader>Diagnosis</TableHeader>
                        <TableHeader>Status</TableHeader>
                        <TableHeader>Onset Date</TableHeader>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {summary.diagnoses.map((diagnosis) => (
                        <TableRow key={diagnosis.uuid}>
                          <TableCell>{diagnosis.name}</TableCell>
                          <TableCell>
                            <Tag type={diagnosis.status === 'active' ? 'green' : 'gray'}>{diagnosis.status}</Tag>
                          </TableCell>
                          <TableCell>{formatStringDate(diagnosis.onsetDate ?? '')}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <>No diagnoses recorded</>
                )}
              </TabPanel>

              <TabPanel>
                {encounters.length > 0 ? (
                  <>
                    <Table aria-label="encounters table" size="lg">
                      <TableHead>
                        <TableRow>
                          <TableHeader>Type</TableHeader>
                          <TableHeader>Date</TableHeader>
                          <TableHeader>Location</TableHeader>
                          <TableHeader>Provider</TableHeader>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {paginatedEncounters.map((encounter) => (
                          <TableRow key={encounter.uuid}>
                            <TableCell>{encounter.type}</TableCell>
                            <TableCell>{formatStringDate(encounter.date)}</TableCell>
                            <TableCell>{encounter.location ?? ''}</TableCell>
                            <TableCell>{encounter.provider ?? ''}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <Pagination
                      page={encounterPage}
                      pageSize={encounterPageSize}
                      pageSizes={[5, 10, 20, 50]}
                      totalItems={encounters.length}
                      onChange={({ page, pageSize }) => {
                        setEncounterPage(page);
                        setEncounterPageSize(pageSize);
                      }}
                    />
                  </>
                ) : (
                  <>No previous encounters recorded</>
                )}
              </TabPanel>

              <TabPanel>
                {summary.allergies && summary.allergies.length > 0 ? (
                  <Table aria-label="allergies table" size="lg">
                    <TableHead>
                      <TableRow>
                        <TableHeader>Substance</TableHeader>
                        <TableHeader>Reaction</TableHeader>
                        <TableHeader>Severity</TableHeader>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {summary.allergies.map((allergy) => (
                        <TableRow key={allergy.uuid}>
                          <TableCell>{allergy.substance}</TableCell>
                          <TableCell>{allergy.reaction ?? ''}</TableCell>
                          <TableCell>
                            {allergy.severity && (
                              <Tag type={getAllergySeverityTagType(allergy.severity)}>{allergy.severity}</Tag>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <>No allergies recorded</>
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default ClinicalSummary;
