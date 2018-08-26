import React, { Component } from 'react';
import Logo from '../../Images/Leaf.png';
// import Grid from '@material-ui/core/Grid';
// import moment from 'moment';
class Admin extends Component {

    componentDidMount = async () => {

    }

    render() {
        return (
            <div className='home' style={{ backgroundColor: 'white' }}>
                <img src={Logo} alt='Logo' />
                <br />    <br />    <br />
                This is the Admin Page {this.props.theUser.firstName} {this.props.theUser.lastName}
                <br/> <br/>
                <button><a href='/user/rooms'>
                    View One
    </a></button>
    <br/><br/>
             <button> <a href='/user/data/room'>
                    View All
    </a></button>  
            </div>
        )

    }


} export default Admin;
