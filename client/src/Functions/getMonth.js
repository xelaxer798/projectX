
const getMonth=()=>{
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const d = new Date();
    const month= monthNames[d.getMonth()];
    return month;
}
export default getMonth;