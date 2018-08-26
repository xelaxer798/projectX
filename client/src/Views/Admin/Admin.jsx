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
                <a href='/user/rooms'>
                    View One
    </a>
    <br/>
                <a href='/user/data/room'>
                    View All
    </a>
            </div>
        )

    }


} export default Admin;
