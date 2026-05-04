import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@carbon/react";
import React from "react";
import { type MedicationChangeHistory } from "../types";
interface MedicationChangeHistorySummaryProps {
    medicationChangeHistory: MedicationChangeHistory[];
}
const MedicationChangeHistorySummary: React.FC<MedicationChangeHistorySummaryProps> = ({ medicationChangeHistory }) => {
    if (!medicationChangeHistory || medicationChangeHistory.length === 0) {
        return <>No medication Change History</>
    }
    return <>
        <Table aria-label="sample table" size="lg">
            <TableHead>
                <TableRow>
                    <TableHeader>Change Date</TableHeader>
                    <TableHeader>Previous VL</TableHeader>
                    <TableHeader>Previous Vl Date</TableHeader>
                    <TableHeader>DST/DRT Date</TableHeader>
                    <TableHeader>Current Regimen</TableHeader>
                    <TableHeader>ARV Line</TableHeader>
                    <TableHeader>Reason</TableHeader>
                </TableRow>
            </TableHead>
            <TableBody>
                {
                    medicationChangeHistory.map((encounter, index) => {
                        return <TableRow key={index}>
                            <TableCell>{encounter.encounter_datetime}</TableCell>
                            <TableCell>{(encounter.previous_vl && encounter.previous_vl !== null) ? encounter.previous_vl : ''}</TableCell>
                            <TableCell>{encounter.previous_vl_date}</TableCell>
                             <TableCell></TableCell>
                            <TableCell>
                                {
                                    encounter.current_regimen ?? ''
                                }
                            </TableCell>
                            <TableCell>
                                {encounter.cur_arv_line ?? ''}
                            </TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    })
                }
            </TableBody>
        </Table>
    </>
}
export default MedicationChangeHistorySummary;