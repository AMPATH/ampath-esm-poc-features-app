import { formatDate } from "@openmrs/esm-framework";

export function formatStringDate(stringDate: string){
    if(!stringDate){
         return '';
    }
  return formatDate(new Date(stringDate));
}