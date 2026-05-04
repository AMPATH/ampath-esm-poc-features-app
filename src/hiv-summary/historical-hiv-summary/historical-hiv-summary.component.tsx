import React from "react";
import { type HivSummary } from "../types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@carbon/react";
import { hivSummary } from "../..";
import { formatStringDate } from "../../shared/utils/format-string-date";

interface HistoricalHivSummaryProps {
    hivSummaries: HivSummary[]
}
const HistoricalHivSummary: React.FC<HistoricalHivSummaryProps> = ({ hivSummaries }) => {
    if (!hivSummaries || hivSummaries.length === 0) {
        return <>No Summary</>
    }
    function getDaysMissed(encounter_datetime: string, prev_rtc_date: string | null) {
        if (!prev_rtc_date) {
            return 0;
        }
        const enc = new Date(encounter_datetime);
        const prevRtcDate = new Date(prev_rtc_date);
        const diffInMs = Math.abs(enc.getTime() - prevRtcDate.getTime());

        const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
        if (diffInDays > 0) {
            return diffInDays.toFixed(0);
        } else {
            return 0;
        }
    }
    function getPatientActiveStatus(encounter_datetime: string,prev_rtc_date: string | null): string{
        if (!prev_rtc_date) {
            return '';
        }
        const enc = new Date(encounter_datetime);
        const prevRtcDate = new Date(prev_rtc_date);
        const diffInMs = Math.abs(enc.getTime() - prevRtcDate.getTime());
        const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
        if(diffInDays < 4){
            return 'missed'
        }else if(diffInDays > 4 && diffInDays <= 28){
            return 'defaulter'
        }else if(diffInDays > 28){
            return 'LTFU'
        }else{
             return '';
        }
     
    }
    return <>
        <Table aria-label="sample table" size="lg">
            <TableHead>
                <TableRow>
                    <TableHeader>Encounter Type</TableHeader>
                    <TableHeader>Encounter Date</TableHeader>
                    <TableHeader>RTC Date</TableHeader>
                    <TableHeader>Days Missed</TableHeader>
                    <TableHeader>Medication Pick up Date</TableHeader>
                    <TableHeader>ARV Meds</TableHeader>
                    <TableHeader>CD4 Count</TableHeader>
                    <TableHeader>Viral Load</TableHeader>
                    <TableHeader>WHO Stage</TableHeader>
                    <TableHeader>EAC Session</TableHeader>
                    <TableHeader>Status</TableHeader>
                </TableRow>
            </TableHead>
            <TableBody>
                {
                    hivSummaries.map((hivSummary) => {
                        return <TableRow key={hivSummary.encounter_id}>
                            <TableCell>{hivSummary.encounter_type_name}</TableCell>
                            <TableCell>{formatStringDate(hivSummary.encounter_datetime ?? '')}</TableCell>
                            <TableCell>{formatStringDate(hivSummary.rtc_date ?? '')}</TableCell>
                            <TableCell>
                                {
                                    getDaysMissed(hivSummary.encounter_datetime, hivSummary.prev_rtc_date)
                                }
                            </TableCell>
                            <TableCell>
                                {formatStringDate(hivSummary.med_pickup_rtc_date ?? '')}
                            </TableCell>
                            <TableCell>{hivSummary.cur_arv_meds}</TableCell>
                            <TableCell>{hivSummary.cd4_1} {
                                hivSummary.cd4_1_date ? (<>
                                    ({formatStringDate(hivSummary.cd4_1_date)})
                                </>) : (<></>)
                            }</TableCell>
                            <TableCell>{ hivSummary.vl_1 }</TableCell>
                            <TableCell>{hivSummary.cur_who_stage}</TableCell>
                            <TableCell>
                                {
                                    hivSummary.mdt_session_number
                                }
                            </TableCell>
                            <TableCell>
                                { getPatientActiveStatus(hivSummary.encounter_datetime,hivSummary.prev_rtc_date) }
                            </TableCell>
                        </TableRow>
                    })

                }

            </TableBody>
        </Table>

    </>
}
export default HistoricalHivSummary;