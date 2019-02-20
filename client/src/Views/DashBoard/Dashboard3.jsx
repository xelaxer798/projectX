
import React, { Component } from 'react';
import Graphs from './index';
import moment from 'moment';
import 'moment-timezone';
import functions from '../../Functions/index';
import Grid from '@material-ui/core/Grid';
import './Dashboard.css'
// import moment from 'moment';

// "2018-04-25T04:41:30.000Z"
class Dashboard3 extends Component {
    state = {
        CurrentTime: moment().format(),
        timeFormated: functions.getDashboardFormateTime('dont'),
    };
    componentDidCatch = (error, info) => {
        console.log('hi i am catching Dashboard3');
        console.log(error, 'hi im errors at dash3')
        console.log(info, 'hi im info at dash3')
    };
    updateTime = () => {
        this.setState({
            CurrentTime: moment().format(),
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
            <div style={{ padding: 20 , backgroundColor: 'white'}}>
                <Grid container spacing={32}>
                    <Grid item xs={12} lg={6}>
                        <Graphs.Widgets.GraphWidget uniqueId="graphWidget2"/>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <Graphs.Widgets.GraphWidget uniqueId="graphWidget1"/>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <Graphs.Widgets.GraphWidget uniqueId="graphWidget3"/>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <Graphs.Widgets.GraphWidget uniqueId="graphWidget4"/>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <Graphs.Widgets.GraphWidget uniqueId="graphWidget5"/>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <Graphs.Widgets.GraphWidget uniqueId="graphWidget6"/>
                    </Grid>

                </Grid>

            </div>
        );
    };
};
export default Dashboard3;
