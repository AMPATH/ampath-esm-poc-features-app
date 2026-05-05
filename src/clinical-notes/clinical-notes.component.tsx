import React, { useEffect, useState } from "react";
import {
   DataTable,
   Table,
   TableHead,
   TableRow,
   TableHeader,
   TableBody,
   TableCell,
   TableExpandRow,
   TableExpandedRow,
   TableContainer,
   TextInput,
   Button,
   InlineLoading,
} from "@carbon/react";
import styles from './clinical-notes.component.scss';
import { usePatient } from "@openmrs/esm-framework";
import { type Provider, type ClinicalNotesParams, type Note, type Vitals, type ArtRegimen, type TbProphylaxisPlan, type Assessment, type SessionData } from "./types";
import { fetchClinicalNotes } from "./clinical-notes.resource";
import { formatStringDate } from "../shared/utils/format-string-date";
import { formatVL } from "../shared/utils/format-vl";
interface ClinicalNotesProps { }
const ClinicalNotes: React.FC<ClinicalNotesProps> = () => {
   const { isLoading, error, patient } = usePatient();
   const [notes, setNotes] = useState<Note[]>([]);
   const [loading, setLoading] = useState<boolean>(false);
   const [limit, setLimit]= useState<number>(10);
   useEffect(() => {
      if (patient) {
         getPatientClinicalNotes(patient.id,limit);
      }

   }, [patient]);
   if (isLoading) return <div>Loading…</div>;
   if (error) return <div>Error loading patient</div>;
   if (!notes || notes.length === 0) {
      return <>No Data to display</>
   }
   async function getPatientClinicalNotes(patientUuid: string, limit: number) {
      setLoading(true);
      const params: ClinicalNotesParams = {
         patientUuid: patientUuid,
         limit: limit,
         startIndex: 0,
         includeNonClinicalEncounter: false,
         isHEIActive: false
      };
      try {
         const resp = await fetchClinicalNotes(params);
         if (resp) {
            setNotes(resp);
         }
      } finally {
         setLoading(false);
      }
   }
   function formatProviders(providers: Provider[]) {
      const providersArr = providers.map((p) => {
         return `${p.name} (${p.encounterType})`
      })
      return providersArr.join(',');
   }
   function formatVitals(vitals: Vitals) {
      if (!vitals) {
         return '';
      }
      return `Weight(${vitals.weight ?? ''}), Height(${vitals.height ?? ''}), BMI(${vitals.bmi ?? ''}), Oxygen Saturation(${vitals.oxygenSaturation ?? ''}), Temperature(${vitals.oxygenSaturation ?? ''}), BP(${vitals.systolicBp ?? ''}/${vitals.diastolicBp ?? ''}), Pulse(${vitals.pulse ?? ''})`;
   }
   function formatArvDrugs(artRegimen: ArtRegimen) {
      if (!artRegimen) {
         return '';
      }
      return `${artRegimen.curArvMeds} (ARV Start Date : ${formatStringDate(artRegimen.arvStartDate)})`
   }
   function formatTBProphylaxisPlan(tb: TbProphylaxisPlan) {
      if (!tb) {
         return '';
      }
      return `${tb.plan ?? ''} ( Start Date: ${formatStringDate(tb.startDate)}, Estimated End Date: ${formatStringDate(tb.estimatedEndDate)}) `
   }
   function formatAssessment(ass: Assessment[]) {
      if (ass.length === 0) {
         return ['None'];
      }
      const assArr = ass.map((p) => {
         return `${formatStringDate(p.obsDatetime)} (${p.encounterType}) : ${p.value}`
      });
      return assArr;
   }
   function formatSessionData(sd: SessionData[]) {
      if (sd.length === 0) {
         return '';
      }
      const sdArr = sd.map((p) => {
         return `${p.value}`
      });
      return sdArr.join(',');
   }
   async function fetchMoreData(){
       let currentLimit = limit;
       const newLimit = currentLimit += limit;
       await getPatientClinicalNotes(patient.id,currentLimit);
       setLimit(currentLimit);
   }

   return <>
      <div className={styles.notesLayout}>
         <div className={styles.notesHeader}>
            <div className={styles.titleHeader}>
                 <h4>Clinical Notes</h4>
            </div>
         </div>
         <div className={styles.notesContent}>
            {
               notes.map((note) => {
                  return <>
                     <Table aria-label="sample table" size="lg">
                        <TableHead>
                           <TableRow>
                              <TableHeader>Visit Date</TableHeader>
                              <TableHeader>{formatStringDate(note.visitDate)}({note.scheduled === 1246 ? 'Scheduled' : 'Not Scheduled'})</TableHeader>
                           </TableRow>
                        </TableHead>
                        <TableBody>
                           <TableRow>
                              <TableCell>Providers</TableCell>
                              <TableCell>{formatProviders(note.providers)}</TableCell>
                           </TableRow>
                           <TableRow>
                              <TableCell>Last Viral Load </TableCell>
                              <TableCell>{
                                 note && note.lastViralLoad ? (<>
                                    {formatVL(note.lastViralLoad.value)} ({formatStringDate(note.lastViralLoad.date)})
                                 </>) : (<></>)}
                              </TableCell>
                           </TableRow>
                           <TableRow>
                              <TableCell>Last CD4 Count</TableCell>
                              <TableCell>{
                                 note && note.lastCD4Count ? (<>
                                    {note.lastCD4Count.value} ({formatStringDate(note.lastCD4Count.date)})
                                 </>) : (<></>)}
                              </TableCell>
                           </TableRow>
                           <TableRow>
                              <TableCell>Vitals</TableCell>
                              <TableCell>{
                                 note && note.vitals ? (<>
                                    {formatVitals(note.vitals)}
                                 </>) : (<></>)}
                              </TableCell>
                           </TableRow>
                           <TableRow>
                              <TableCell>Dispensed ARV drugs</TableCell>
                              <TableCell>{
                                 note && note.artRegimen ? (<>
                                    {formatArvDrugs(note.artRegimen)}
                                 </>) : (<></>)}
                              </TableCell>
                           </TableRow>
                           <TableRow>
                              <TableCell>TB Prophylaxis Plan</TableCell>
                              <TableCell>{
                                 note && note.artRegimen ? (<>
                                    {formatTBProphylaxisPlan(note.tbProphylaxisPlan)}
                                 </>) : (<></>)}
                              </TableCell>
                           </TableRow>
                           <TableRow>
                              <TableCell>RTC Date: </TableCell>
                              <TableCell>{
                                 note && note.rtcDate ? (<>
                                    {formatStringDate(note.rtcDate)}
                                 </>) : (<></>)}
                              </TableCell>
                           </TableRow>
                           {
                              note.assessment && note.assessment.length > 0 ? (<>
                                 <TableRow>
                                    <TableCell>CC/HPI & Assessemnt: </TableCell>
                                    <TableCell>{
                                       <ul className={styles.sessionList}>
                                          {formatAssessment(note.assessment).map((a) => {
                                             return <li>{a}</li>
                                          })}
                                       </ul>
                                    }</TableCell>
                                 </TableRow>

                              </>) : (<></>)
                           }
                           {
                              note.eacSession && note.eacSession.hasEacSession ? (<>
                                 <TableRow>
                                    <TableCell>EAC Notes </TableCell>
                                    <TableCell></TableCell>
                                 </TableRow>
                                 <TableRow>
                                    <TableCell>Session 1 </TableCell>
                                    <TableCell>{
                                       note.eacSession.session1 ? (<>

                                          <ol className={styles.sessionList}>
                                             <li><span className={styles.boldData}>Behavioral Barriers</span> : {formatSessionData(note.eacSession.session1.behavioral_barriers ?? [])}</li>
                                             <li><span className={styles.boldData}>Cognitive Barriers</span> : {formatSessionData(note.eacSession.session1.cognitive_barriers ?? [])}</li>
                                             <li><span className={styles.boldData}>Emotional Barriers</span> : {formatSessionData(note.eacSession.session1.emotional_barriers ?? [])}</li>
                                             <li><span className={styles.boldData}>Enhanced Adherence Session</span> : {formatSessionData(note.eacSession.session1.enhanced_adherence_session ?? [])}</li>
                                             <li><span className={styles.boldData}>Socio Economic Barriers </span>: {formatSessionData(note.eacSession.session1.socio_economic_barriers ?? [])}</li>
                                          </ol>

                                       </>) : (<></>)

                                    }</TableCell>
                                 </TableRow>

                                 <TableRow>
                                    <TableCell>Session 2 </TableCell>
                                    <TableCell>{
                                       note.eacSession.session2 ? (<>

                                          <ul className={styles.sessionList}>
                                             <li><span className={styles.boldData}>Adherence Plan </span>: {formatSessionData(note.eacSession.session2.adherence_plan ?? [])}</li>
                                             <li><span className={styles.boldData}>New Issues </span>: {formatSessionData(note.eacSession.session2.new_issues ?? [])}</li>
                                             <li><span className={styles.boldData}>Referral And Networking </span>: {formatSessionData(note.eacSession.session2.referral_and_networking ?? [])}</li>
                                             <li><span className={styles.boldData}>Review Adherence Plan </span>: {formatSessionData(note.eacSession.session2.review_adherence_plan ?? [])}</li>
                                          </ul>

                                       </>) : (<></>)

                                    }</TableCell>
                                 </TableRow>

                                 <TableRow>
                                    <TableCell>Session 3 </TableCell>
                                    <TableCell>{
                                       note.eacSession.session3 ? (<>

                                          <ul className={styles.sessionList}>
                                             <li><span className={styles.boldData}>Adherence Plan </span>: {formatSessionData(note.eacSession.session3.adherence_plan ?? [])}</li>
                                             <li><span className={styles.boldData}>Adherence Plan Review </span>: {formatSessionData(note.eacSession.session3.new_issues ?? [])}</li>
                                             <li><span className={styles.boldData}>New Issues </span>: {formatSessionData(note.eacSession.session3.referral_and_networking ?? [])}</li>
                                             <li><span className={styles.boldData}>Referral And Networking </span>: {formatSessionData(note.eacSession.session3.referral_and_networking ?? [])}</li>
                                             <li><span className={styles.boldData}>Repeat Viral Load </span>: {formatSessionData(note.eacSession.session3.repeat_viral_load ?? [])}</li>
                                          </ul>

                                       </>) : (<></>)

                                    }</TableCell>
                                 </TableRow>

                                 <TableRow>
                                    <TableCell>Session 4 </TableCell>
                                    <TableCell>{
                                       note.eacSession.session4 ? (<>
                                          <ul className={styles.sessionList}>
                                             <li><span className={styles.boldData}>Viral Load Results </span>: {formatSessionData(note.eacSession.session4.viral_load_results ?? [])}</li>
                                          </ul>

                                       </>) : (<></>)

                                    }</TableCell>
                                 </TableRow>

                              </>) : (<></>)
                           }
                        </TableBody>
                     </Table>
                  </>
               })
            }

            <div>
               <Button kind='primary' 
            disabled={loading}
            onClick={fetchMoreData}>
               {
                  loading ? <InlineLoading  description='Fetching data..please wait!'/> : 'Load More'
               }
            </Button>
            </div>

         </div>
      </div>
   </>
}
export default ClinicalNotes;