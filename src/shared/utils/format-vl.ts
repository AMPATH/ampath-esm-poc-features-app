export function formatVL(viralLoad: number){
    if(viralLoad <= 0){
        return 'LDL'
    }else{
        return viralLoad;
    }
}