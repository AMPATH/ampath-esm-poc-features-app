import { formatDate } from "@openmrs/esm-framework";

export function formatStringDate(stringDate: string){
    if(!stringDate || stringDate === 'Not available' || stringDate === 'N/A'){
         return '';
    }
  return formatDate(new Date(stringDate));
}