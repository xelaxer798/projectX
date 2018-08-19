
import moment from 'moment';
import db from '../models'
function timeToDecimal(t) {

  const arr = t.split(':');
  const arr2=arr[1].split(' ');
  const time =[arr[0],arr2[0]];
  
  const dec = parseInt((time[1]/6)*10, 10);

  return parseFloat(parseInt(arr[0], 10) + '.' + (dec<10?'0':'') + dec);
}   
function timeToNumber(t) {
  // lastNodeEntry.split('.')
  const arr = t.split(':');

  const time =parseInt(arr[0], 10);
return time;
}

 const checkNodes =async (id) => {
console.log(id)
  const theCurrentTime = moment().tz("America/Los_Angeles").format("hh:mm a");

 let MyTime=timeToNumber(theCurrentTime,'olo ');
console.log(MyTime)
 let users=await   db.users.findAll({

    where:{

            },
    order: [ [ 'createdAt', 'DESC' ]]
    })
    
    let lastNodeEntry;
    console.log(users.length)
    for(let i=0;i<users.length;i++){
    let nodes =await db.nodes.findAll({
        limit: 1,
        where:{
          userId:users[i].dataValues.id
                },
        order: [ [ 'createdAt', 'DESC' ]]
        })
        try{
       
          lastNodeEntry  = timeToDecimal(nodes[0].dataValues.currentTime)
         console.log(timeToNumber(nodes[0].dataValues.currentTime),'fuck')
        }catch(err){
          console.log(err)
        }
        console.log(lastNodeEntry,MyTime)
     if(lastNodeEntry ){

     }
    
    }

}
export default  checkNodes ;