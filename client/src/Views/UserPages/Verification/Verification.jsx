import React, {Component } from 'react';
import users from '../../../Data/nodes-api'


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
     })
    });
  };
  render() {
    return (
      <div className="verification">
     {this.state.name}, You have been verified.   
      </div>
    )
  }

}
export default verify;