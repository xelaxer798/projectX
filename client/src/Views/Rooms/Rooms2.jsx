import React, {Component} from 'react';
// import { BrowserRouter, Route, Link,Switch } from 'react-router-dom';
import Data from '../../Data/nodes-api'
import Grid from '@material-ui/core/Grid';
// const test=[{id:'111111',roomSize:'hye',nodeList:'bitch',createdAt:'2018-07-14 19:29:29'}]

const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flexGrow: 1,
  },
box: {
    
    border: '1px solid blue' 
  },
};
function getTIme(value) {
  const split=JSON.stringify(value);
  const dbDate = split.split(':')
  const splitDate=dbDate[0].split('-')
 const splitTime= splitDate[2].split('T')
 const hour =splitTime[0];
const hourToNUm= parseInt(3,hour);
let amPm;
let newHour
if(hourToNUm<13){
 amPm='AM'
 newHour=hour
}else if(hourToNUm >12){
 amPm='PM'
 newHour=hour-12
 
}

// const t24=`${newHour}:${dbDate[1]} ${amPm}`


const time=`${newHour}:${dbDate[1]} ${amPm}`
  console.log(hour)
  console.log(value)
  return time;
}
function getDbDate (value) {
  const split=JSON.stringify(value);
const dbDate = split.split(':')
const splitDate=dbDate[0].split('-')
const dayCreated =splitDate[2].split('T')
const removed=splitDate[0].split('"')

const dates=splitDate[1]+'-'+dayCreated[0]+'-'+removed[1]
return dates
 };
class Room extends Component {
  state = {
    room:[],
    id:''
  } 
  
  componentDidMount = () => {

    Data.getById().then(data => {
   
   if(data.data!==null||data.data !==undefined||data.data !==[]){
    this.setState({
        room:data.data,
        id:data.data[0].id
      })
   }

    })
    
  }
  
 livereload = () => {
  // setInterval(function(){
  //       }) }, 9000);
  
      
        setInterval(function(){    Data.getAll().then(data => {
          this.setState({
            room:data.data
          })
              })}, 5000);
            
  
  }
  deleteAll=()=>{
    let yesOrNo=  window.confirm("Are You Sure you want to Delete everything in the Db!?!");
    if(yesOrNo ===true){
      Data.delete().then(()=>{
          Data.getById().then(data => {
            if(data.data[0].id !==null||data.data[0].id !==undefined){
                this.setState({
                    room:data.data,
                    id:data.data[0].id
                  })
               }
                  })
      })
    }
    else
    {
        window.alert('nothing was deleted')
    }
  
  }
    deleteCurent = () => {
      
      let person=  window.prompt("Which id do you want To Delete!?!");
      console.log( person)
      if(person  !==null ){
      
            Data.deleteById( person).then(data => {
              Data.getById().then(data => {
                this.setState({
                  room:data.data,
                 id: data.data[0].id||'000000'
                })
                    })
                    })
      
      }else{
          alert('none')
      }
     

    }
  refresh = () => {
    
    Data.getById().then(data => {
this.setState({
  room:data.data
})
    })

  }
    render(){

      return (
    
        <div className="Room">
   
        <button onClick={this.refresh}> click me for new information from db </button>
        <button onClick={this.livereload}> click me for live reload </button>
        <button onClick={this.deleteCurent}> Delete an certin Id  </button>
        <button onClick={this.deleteAll}> click me to empty the db </button>
        <br/>   <br/>   <br/>   <br/>
        <Grid container spacing={4}>
        
        <br/><br/><br/>
         {this.state.room.map((tile) => (
              <Grid xs={4}>
           <div style={styles.box}>
         <p>Id: {tile.id}</p>
             <p>Node Id: {tile.nodeId}</p>
<p>User Id: {tile.userId}</p>
<p>Node Type: {tile.nodeType}</p>
<p>Temperature: {tile.temperature}</p>
<p>Humidity: {tile.humidity}</p>
<p>R: {tile.r}</p>
<p>G: {tile.g}</p>
<p>B: {tile.b}</p>
<p>Lux: {tile.lux}</p>
<p>Full: {tile.full}</p>
<p>Visable: {tile.visible}</p>
<p>IR: {tile.ir}</p>
<p>Room Id: {tile.roomId}</p>

<p>Date Created: {getDbDate(tile.createdAt)}</p>
<p>Time Created At: {getTIme(tile.createdAt)}</p>
</div>
</Grid>
         ))}

         
      </Grid>
      
        </div>
      
      )
    }

  }
 

export default Room;

