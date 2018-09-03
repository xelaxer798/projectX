
const getMonth=(date)=>{

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
   if(date==='dont'){
    const d = new Date();
    const month= monthNames[d.getMonth()];
    return month;
   }else {
    const d = new Date(date);
    const month= monthNames[d.getMonth()];
    return month;
   }
   
}
export default getMonth;