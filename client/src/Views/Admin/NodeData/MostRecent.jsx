import React, { Component } from 'react';
import nodeData from '../../../Data/nodes-api';
import userData from '../../../Data/users-api';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import functions from '../../../Functions/index';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
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

class MostRecent extends Component {
  state = {
    room: [],
    id: '538f6eb2-f522-4cbd-9a3a-dc4e9433ec5d',
    allUsers:[]
  };

  componentDidMount = () => {
    userData.findAllUsers().then(users=>{
      console.log(users.data)
     const usersArray=[];
   for(let i=0;i<users.data.length;i++){
let usersObj={
id:users.data[i].id,
name:`${users.data[i].firstName} ${users.data[i].lastName}`
}
usersArray.push(usersObj)
   }

   this.setState({
allUsers:usersArray
   })
          })

    setInterval(this.getData, 1000);

  }

handleChange = event => {
  this.setState({ [event.target.name]: event.target.value });
};

  getData = () => {
    nodeData.getAdmin(this.state.id, '1').then(data => {
      if (data.data !== null || data.data !== undefined || data.data !== []) {
        try {
          this.setState({
            room: data.data,
          })
        } catch (err) {
        }
      }
    })
  }
  deleteAll = () => {
    let yesOrNo = window.confirm("Are You Sure you want to Delete everything in the Db!?!");
    if (yesOrNo === true) {
    nodeData.delete().then(() => {
      nodeData.getAll().then(data => {
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

      nodeData.deleteById(this.state.id).then(data => {
        nodeData.getAll().then(data => {
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

    nodeData.getAll().then(data => {
      this.setState({
        room: data.data
      })
    })

  }
  render() {
    
    return (

      <div className="Room">
      <Button> <a href='/user/view/all'>
                    View All
    </a></Button>  
        <h1><Button onClick={this.changeUser}>Change to a Differant User</Button></h1>
        <InputLabel htmlFor="users-simple">users</InputLabel>
          <Select
            value={this.state.id}
            onChange={this.handleChange}
            input={<Input name="id" id="age-label-placeholder" />}
            name='id'
          >
        {this.state.allUsers.map((tile) => (
       
          <MenuItem key={tile.id} value={tile.id}>{tile.name}</MenuItem>


          ))}
          </Select>
          <br/> <br/> <br/>
        <Button onClick={this.deleteCurent}> Delete Current Info  </Button>
        <Button onClick={this.deleteAll}> click me to empty the db </Button>
        <br />   <br />   <br />   <br />
        <Grid container spacing={4}>

          <br /><br /><br />
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

                <p>Date Created: {functions.getFormateTime(tile.createdAt)}</p>
                
              </div>
            </Grid>
          ))}


        </Grid>

      </div>

    )
  }

}


export default MostRecent;

