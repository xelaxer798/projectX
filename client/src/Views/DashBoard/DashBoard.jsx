import React,{Component} from 'react';




class Dashboard extends Component {
    state={
  
    }
    render(){
      return(
        <div className='home'>
  
This is your Dashboard {this.props.theUser.firstName} {this.props.theUser.lastName}
      </div>
      )
    
    }
  
  
  }export default Dashboard;
  