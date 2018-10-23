import React, {Component} from 'react';
import Logo from '../../../Images/Leaf.png';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import AlertsApi from '../../../Data/alerts-api'
import Plot from "react-plotly.js";
import Images from "../../../Images";


// import Grid from '@material-ui/core/Grid';
// import moment from 'moment';


const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
    },
    table: {
        minWidth: 700,
    },
});

class AlertsMain extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            alerts: []
        }
    }


    rows = [];

    componentDidMount = () => {
        AlertsApi.getAlerts().then(results => {
            this.setState({
                alerts: results.data,
                loading: false
            });
            this.rows = results.data;
        });
    };

    render() {
        if (this.state.loading) {
            return (
                <div>
                    <h1>Your data is loading</h1>
                    <img src={Images.loadingGif} alt='loading'/>
                </div>
            )
        } else
            return (
            <div className='home' style={{backgroundColor: 'white'}}>
                <img src={Logo} alt='Logo'/>
                <br/> <br/> <br/>
                <Paper className={styles.root}>
                    <Table className={styles.table}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Alert</TableCell>
                                <TableCell>Active</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.alerts.map(row => {
                                return (
                                    <TableRow key={row.alertId}>
                                        <TableCell component="th" scope="row">
                                            {row.alertName}
                                        </TableCell>
                                        <TableCell>Active</TableCell>

                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </Paper>

            </div>
        );

    };


}

export default AlertsMain;
