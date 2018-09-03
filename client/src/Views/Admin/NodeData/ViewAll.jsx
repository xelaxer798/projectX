import React, { Component } from 'react';
// import { BrowserRouter, Route, Link,Switch } from 'react-router-dom';
import NodeData from '../../../Data/nodes-api';
import userData from '../../../Data/users-api';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import functions from '../../../Functions/index';
import loadingGif from '../../../Images/loading.gif'
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

// const t24=`${newHour}:${dbDate[1]} ${amPm}`



class ViewAll extends Component {
  state = {
    room: [],
    id: '538f6eb2-f522-4cbd-9a3a-dc4e9433ec5d',
    loading: false,
    allUsers: []
  };

  componentDidMount = () => {
    this.setState({
      loading: true
    });
    userData.findAllUsers().then(users => {

      const usersArray = [];
      for (let i = 0; i < users.data.length; i++) {
        let usersObj = {
          id: users.data[i].id,
          name: `${users.data[i].firstName} ${users.data[i].lastName}`
        };
        usersArray.push(usersObj)
      };

      this.setState({
        allUsers: usersArray
      });
    });

    setTimeout(this.getData, 1000);
    setInterval(this.getData, 30000);

  };
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  getData = async () => {

    let data = await NodeData.getAdmin(this.state.id, 'many');
    console.log(data.data);
    if (data.data !== null || data.data !== undefined || data.data !== []) {
      try {
        this.setState({
          room: data.data,
          loading: false

        });
      } catch (err) {
        console.log(err)
      };

    };
  };
  deleteAll = () => {
    let yesOrNo = window.confirm("Are You Sure you want to Delete everything in the Db!?!");
    if (yesOrNo === true) {
      NodeData.delete().then(() => {
        NodeData.getById().then(data => {
          if (data.data[0].id !== null || data.data[0].id !== undefined) {
            this.setState({
              room: data.data,
              id: data.data[0].id
            });
          };
        });
      });
    }
    else {

    };
  };
  deleteCurent = () => {
    let person = window.prompt("Which id do you want To Delete!?!");
    if (person !== null) {
      try {
        NodeData.deleteById(person).then(data => {
          NodeData.getById().then(data => {
            this.setState({
              room: data.data,
              id: data.data[0].id || '000000'
            });
          });
        });
      } catch (err) {
      };
    };
  };
  refresh = () => {
    NodeData.getById().then(data => {
      this.setState({
        room: data.data
      });
    });
  };
  render() {

    return (

      <div className="Room">
        <Button><a href='/user/most/recent'>
          View One
    </a></Button>
        <h1><Button onClick={this.changeUser}>Change to a Differant User</Button></h1>
        <InputLabel htmlFor="users-simple">users</InputLabel>
        <br />
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
        <br /><br /><br />
        <Button onClick={this.refresh}> click me for new information from db </Button>

        <Button onClick={this.deleteCurent}> Delete an certin Id  </Button>
        <Button onClick={this.deleteAll}> click me to empty the db </Button>
        <br />   <br />   <br />   <br />

        <Grid container spacing={4}>

          <br /><br /><br />
          {!this.state.loading ?
            this.state.room.map((tile) => (
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
            )) : <div><img src={loadingGif} alt="loading" /></div>}


        </Grid>

      </div>

    );
  };

};


export default ViewAll;

