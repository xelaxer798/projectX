import React, {Component } from 'react';
import users from '../../../Data/nodes-api'
import Logo from '../../../Images/Leaf.png'

class verify extends Component{
state = {
   name:""
  };

  
  componentDidMount = () => {
      console.log(this.props)
    users.verification(this.props.match.params.id).then(dataPoints => {
        console.log(dataPoints)
     this.setState({
      name:dataPoints.data
     });
    });
  };
  render() {
    return (
      <div className="verification">
     <img src={Logo} alt='Logo'/>
     <br/>
     {this.state.name}, You have been verified.   
      </div>
    );
  };

};
export default verify;