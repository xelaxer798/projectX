import React, {Component } from 'react';





class confirmation extends Component{
    state={
        countDown:10
    }
    componentDidMount = () => {
        setInterval(this.countDown,1000)
    
    }
    countDown=()=>{
        this.setState({
            countDown:this.state.countDown -1
        })
    }
    
      render() {
        if(this.state.countDown===0){
            window.location='/';
        }
        return (   
            
            <div>
                <h1>This page will redirect you to the home page in {this.state.countDown}</h1>
       
        You have changed your password sucsessfully. 
        You will recieve a confirmation email

    <br />
     
        </div>
        
    )
  }

}
export default confirmation;