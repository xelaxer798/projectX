
import React, { Component } from 'react';
import Logo from '../../Images/Leaf.png';
import Graphs from './index';
import moment from 'moment';
import 'moment-timezone';
import functions from '../../Functions/index';
import Grid from '@material-ui/core/Grid';
// import moment from 'moment';

// "2018-04-25T04:41:30.000Z"
class Dashboard3 extends Component {
    state = {
        CurrentTime: moment().tz("America/Los_Angeles").format(),
        timeFormated: functions.getDashboardFormateTime('dont'),
    };
    componentDidCatch = (error, info) => {
        console.log('hi i am catching Dashboard3');
        console.log(error, 'hi im errors at dash3')
        console.log(info, 'hi im info at dash3')
    };
    updateTime = () => {
        this.setState({
            CurrentTime: moment().tz("America/Los_Angeles").format(),
            timeFormated: functions.getDashboardFormateTime('dont')
        });
    };
    componentDidMount = () => {
        setInterval(this.updateTime, 1000);

        const heyt = moment(this.state.CurrentTime).subtract(1, 'days');

        this.setState({
            timeToStartTemp: moment(heyt._d).tz("America/Los_Angeles").format('YYYY-MM-DD'),
            timeToEndTemp: moment(this.state.CurrentTime).format('YYYY-MM-DD')
        });
    };


    render() {


        return (
            <div className='home' style={{ backgroundColor: 'white' }}>
                <img src={Logo} alt='Logo' />
                <br />    <br />    <br />
                {this.state.timeFormated}
                <br />  <br />  <br />
                {/*This is your Dashboard {this.props.theUser.firstName} {this.props.theUser.lastName}*/}

                <Grid container spacing={40}>
                    <Grid item xs={8} lg={4}>
                        <Graphs.Widgets.GraphWidget  sensorId={'7159BF2DE6B4-EC'}/>
                    </Grid>
                    <Grid item xs={8} lg={4}>
                        <Graphs.Widgets.GraphWidget  sensorId={'6943B32DE6B4-pH'}/>
                    </Grid>

                </Grid>

            </div>
        );
    };
};
export default Dashboard3;
