import React, { useEffect, useState } from "react";
import styles from './hiv-summary.component.scss';
import { InlineLoading, Tab, TabList, TabPanel, TabPanels, Tabs } from "@carbon/react";
import { usePatient } from "@openmrs/esm-framework";
import { type HivSummaryParams, type HivSummary, type MedicationChangeHistory } from "./types";
import { fetchHivSummary } from "./hiv-summary-resource";
import LatestHivSummary from "./latest-hiv-summary/latest-hiv-summary.component";
import HistoricalHivSummary from "./historical-hiv-summary/historical-hiv-summary.component";
import { fetchPatientMedicationHistoryReport } from "./medication-change-history/medication-change-history.resource";
import MedicationChangeHistorySummary from "./medication-change-history/medication-change-history.component";
interface HivSummaryProps { }
const HivSummary: React.FC<HivSummaryProps> = () => {
  const { isLoading, error, patient } = usePatient();
  const [ hivSummary,setHivSummary] = useState<HivSummary[]>([]);
  const [medicationHistoryChange,setMedicationHistoryChange] = useState<MedicationChangeHistory[]>([]);
  const latestHivSummary = hivSummary[0] ?? null;
  const [loading,setLoading] = useState<boolean>(false);
  useEffect(()=>{
    if(patient){
       getPatientHivSummary(patient.id);
       getPatientMedicationChangeHistory(patient.id);
    }
    
  },[patient]);
  if (isLoading) return <div>Loading…</div>;
  if (error) return <div>Error loading patient</div>;

  async function getPatientHivSummary(patientUuid: string){
      setLoading(true);
      const hivSummaryParams: HivSummaryParams = {
            patientUuid: patientUuid,
            limit:20,
            startIndex:0,
            includeNonClinicalEncounter:false,
            isHEIActive: false
      };
      try{
           const resp = await fetchHivSummary(hivSummaryParams);
            if(resp){
                setHivSummary(resp);
            }
      }finally{
           setLoading(false);
      }
     
      
  }
    async function getPatientMedicationChangeHistory(patientUuid: string){
      setLoading(true);
      
      try{
           const resp = await fetchPatientMedicationHistoryReport(patientUuid);
            if(resp){
                setMedicationHistoryChange(resp);
            }
      }finally{
           setLoading(false);
      }
     
      
  }
    return <>
        <div className={styles.hivSummaryLayout}>
            <div className={styles.hivSummaryContent}>
                {
                    loading ? <>
                    <InlineLoading description='Fetching patient summary..please wait' />
                    </>: (<>
                      <Tabs>
                    <TabList
                    >
                        <Tab>
                          HIV Summary
                        </Tab>
                        <Tab>
                            Historical  HIV Summary
                        </Tab>
                        <Tab>
                            Viral Load and Treamnent Changes Tracker
                        </Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            { latestHivSummary &&  <LatestHivSummary hivSummary={latestHivSummary}/>} 
                        </TabPanel>
                        <TabPanel>
                             { hivSummary && <HistoricalHivSummary hivSummaries={hivSummary}/>}
                        </TabPanel>
                        <TabPanel>
                             { medicationHistoryChange && <MedicationChangeHistorySummary medicationChangeHistory={medicationHistoryChange} /> }
                        </TabPanel>
                        <TabPanel>
                             Hiv Clinical Summary
                        </TabPanel>
                         <TabPanel>
                              Previous Visit Summary
                        </TabPanel>
                         <TabPanel>
                              AHD Events Summary
                        </TabPanel>
                    </TabPanels>
                </Tabs>
                    </>)
                }
               
            </div>
        </div>
    </>
}

export default HivSummary;