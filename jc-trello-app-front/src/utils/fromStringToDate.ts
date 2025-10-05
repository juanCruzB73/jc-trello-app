export const fromStringToDate=(stringDate:string)=>{
    let date = new Date(stringDate);
    console.log(typeof date);
    console.log(date);
    return date;
}