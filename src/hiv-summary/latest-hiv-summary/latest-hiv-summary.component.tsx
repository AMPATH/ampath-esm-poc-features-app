import React, { useEffect, useState } from "react";
import { usePatient } from "@openmrs/esm-framework";
import { type HivSummary } from "../types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@carbon/react";
import { formatStringDate } from "../../shared/utils/format-string-date";

interface LatestHivSummaryProps {
    hivSummary: HivSummary
}
const LatestHivSummary: React.FC<LatestHivSummaryProps> = ({ hivSummary }) => {
    if (!hivSummary) {
        return <>No Summary</>
    }

    return <>
        <Table aria-label="sample table" size="lg">
            <TableHead>
                <TableRow>
                    <TableHeader></TableHeader>
                    <TableHeader></TableHeader>
                </TableRow>
            </TableHead>
            <TableBody>
                <TableRow>
                    <TableCell>COVID-19 Assessment Status</TableCell>
                    <TableCell></TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>COVID-19 Screening Outcome</TableCell>
                    <TableCell></TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Contraception Method</TableCell>
                    <TableCell></TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Last Appt Date</TableCell>
                    <TableCell>{formatStringDate(hivSummary?.encounter_datetime)} {hivSummary?.encounter_type_name
                        ? '(' + hivSummary?.encounter_type_name + ')'
                        : '(None)'}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>RTC Date</TableCell>
                    <TableCell>{formatStringDate(hivSummary?.rtc_date ?? '')}</TableCell>
                </TableRow>
                {
                    hivSummary?.hpv !== null ? (<>
                        <TableRow>
                            <TableCell>RTC Date</TableCell>
                            <TableCell>{hivSummary?.hpv == 664
                                ? 'NEGATIVE'
                                : hivSummary?.hpv == 703
                                    ? 'POSITIVE'
                                    : hivSummary?.hpv == 1138
                                        ? 'INDETERMINATE'
                                        : ''}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell> HPV Test Date</TableCell>
                            <TableCell>{hivSummary?.hpv_test_date}</TableCell>
                        </TableRow>

                    </>) : (<></>)
                }

                {
                    hivSummary?.med_pickup_rtc_date && hivSummary?.med_pickup_rtc_date !== null ? (<>

                        <TableRow>
                            <TableCell>Medication Pick Up Date</TableCell>
                            <TableCell>{formatStringDate(hivSummary?.med_pickup_rtc_date)}</TableCell>
                        </TableRow>

                    </>) : (<></>)
                }

                <TableRow>
                    <TableCell>Last Viral Load</TableCell>
                    <TableCell>{hivSummary?.vl_1} ({hivSummary?.vl_1_date
                        ? (formatStringDate(hivSummary?.vl_1_date))
                        : 'None'})</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>There is a Pending Viral Load Test Ordered on</TableCell>
                    <TableCell>{formatStringDate(hivSummary?.vl_order_date ?? '')}</TableCell>
                </TableRow>

                <TableRow>
                    <TableCell>Last CD4 Count</TableCell>
                    <TableCell>{hivSummary?.cd4_1} ({hivSummary?.cd4_1_date
                        ? (formatStringDate(hivSummary?.cd4_1_date))
                        : 'None'})</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Pending CD4 Count Test Ordered on</TableCell>
                    <TableCell>{hivSummary?.cd4_order_date}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Current ARV Regimen</TableCell>
                    <TableCell>{hivSummary?.cur_arv_meds ? hivSummary?.cur_arv_meds : '(None)'}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Current ARV Regimen Start Date</TableCell>
                    <TableCell>{formatStringDate(hivSummary?.arv_start_date ?? '')}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Enrollment Date</TableCell>
                    <TableCell>{formatStringDate(hivSummary?.enrollment_date)}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>ARV Initiation Start Date</TableCell>
                    <TableCell>{hivSummary?.arv_first_regimen_start_date
                        ? (formatStringDate(hivSummary?.arv_first_regimen_start_date))
                        : 'Unknown or Not Indicated'}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>TPT Medication</TableCell>
                    <TableCell></TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>TPT Start Date</TableCell>
                    <TableCell>{formatStringDate(hivSummary?.ipt_start_date ?? '')}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>TPT End Date</TableCell>
                    <TableCell>{formatStringDate(hivSummary?.ipt_completion_date ??'')} {hivSummary?.ipt_start_date &&
                        hivSummary?.ipt_completion_date === null ? (<>
                            Not completed
                        </>) : (<></>)}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Current WHO Stage</TableCell>
                    <TableCell>{hivSummary?.cur_who_stage}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>TB Treatment Start Date</TableCell>
                    <TableCell>{formatStringDate(hivSummary?.tb_tx_start_date ?? '')}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>TB Treatment End Date: </TableCell>
                    <TableCell>{hivSummary?.tb_tx_end_date}</TableCell>
                </TableRow>
                {
                    hivSummary?.mdt_session_number &&
                        hivSummary?.mdt_session_number !== null ? (<>
                            <TableRow>
                                <TableCell>EAC Session </TableCell>
                                <TableCell>{hivSummary?.mdt_session_number}</TableCell>
                            </TableRow>
                        </>) : (<></>)
                }
            </TableBody>
        </Table>
    </>
}
export default LatestHivSummary;