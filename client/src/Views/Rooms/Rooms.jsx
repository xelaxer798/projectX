import React, { Component } from 'react';

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
  const split = JSON.stringify(value);
  const dbDate = split.split(':')
  const splitDate = dbDate[0].split('-')
  const splitTime = splitDate[2].split('T')
  const hour = splitTime[0];
  const hourToNUm = parseInt(3, hour);
  let amPm;
  let newHour
  if (hourToNUm < 13) {
    amPm = 'AM'
    newHour = hour
  } else if (hourToNUm > 12) {
    amPm = 'PM'
    newHour = hour - 12

  }

  // const t24=`${newHour}:${dbDate[1]} ${amPm}`


  const time = `${newHour}:${dbDate[1]} ${amPm}`
  console.log(hour)
  return time;
}
function getDbDate(value) {
  const split = JSON.stringify(value);
  const dbDate = split.split(':')
  const splitDate = dbDate[0].split('-')
  const dayCreated = splitDate[2].split('T')
  const removed = splitDate[0].split('"')

  const dates = splitDate[1] + '-' + dayCreated[0] + '-' + removed[1]
  return dates
};
class Room extends Component {
  state = {
    room: [],
    id: ''
  }

  componentDidMount = () => {
    console.log(this.props)
    setInterval(this.getData, 1000);

  }

getData=()=>{
  Data.getAll().then(data => {
    console.log(data.data)
    if (data.data !== null || data.data !== undefined || data.data !== []) {
      try {
        this.setState({
          room: data.data,
          id: data.data[0].id
        })
      } catch (err) {

      }

    }
  })
}
  deleteAll = () => {
    let yesOrNo = window.confirm("Are You Sure you want to Delete everything in the Db!?!");
    if (yesOrNo === true) {
      Data.delete().then(() => {
        Data.getAll().then(data => {
          try {
            this.setState({
              room: data.data
            })
          } catch (err) {

          }

        })
      })
    }


  }
  deleteCurent = () => {
    console.log(this.state.id)
    let yesOrNo = window.confirm("Are You Sure you want to Delete the Current index!?!");
    if (yesOrNo === true) {

      Data.deleteById(this.state.id).then(data => {
        Data.getAll().then(data => {
          if (data.data[0].id !== null || data.data[0].id !== undefined) {
            try {
              this.setState({
                room: data.data,
                id: data.data[0].id
              })
            } catch (err) {

            }

          }
        })
      })

    }
   

  }
  refresh = () => {

    Data.getAll().then(data => {
      this.setState({
        room: data.data
      })
    })

  }
  render() {

    return (

      <div className="Room">

        <button onClick={this.refresh}> click me for new information from db </button>
        <button onClick={this.livereload}> click me for live reload </button>
        <button onClick={this.deleteCurent}> Delete Current Info  </button>
        <button onClick={this.deleteAll}> click me to empty the db </button>
        <br />   <br />   <br />   <br />
        <Grid container spacing={4}>

          <br /><br /><br />
          {this.state.room.map((tile) => (

            <Grid xs={4}>
              <div style={styles.box}>
                <p>Id: {tile.id}</p>
                {console.log(tile)}
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

