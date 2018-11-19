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
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import './AlertsMain.css'


// import Grid from '@material-ui/core/Grid';
// import moment from 'moment';


class AlertsMain extends Component {

    constructor(props) {
        super(props);
        let height = 400;

        this.state = {
            isLoading: false,
            alerts: [],
            tableHeight: height + "px"
        };
        // this.tableStyle = this.tableStyle.bind(this);

        // this.onAfterInsertRow = this.onAfterInsertRow.bind(this);

    }

    selectRow = {
        mode: 'checkbox', // or checkbox
        clickToSelectAndEditCell: true
    };

    renderShowsTotal = (start, to, total) => {
        return (
            <p style={ { color: 'blue' } }>
                From { start } to { to }, totals is { total }
            </p>
        );
    };

    componentDidMount = () => {
        this.getAlerts();
    };

    getAlerts() {
        AlertsApi.getAlerts().then(results => {
            this.setState({
                alerts: results.data,
                loading: false
            });
        });
    }

    onAfterInsertRow = (row) => {
        console.log("New record: " + JSON.stringify(row));
        console.log("Rows: " + JSON.stringify(this.state));
        AlertsApi.createAlert(row).then(data => {
            this.getAlerts();
        });
    };

    options = {
        afterInsertRow: this.onAfterInsertRow,   // A hook for after insert rows
        page: 1,  // which page you want to show as default
        sizePerPageList: [ {
            text: '5', value: 5
        }, {
            text: '10', value: 10
        } ], // you can change the dropdown list for size per page
        sizePerPage: 5,  // which size per page you want to locate as default
        pageStartIndex: 1, // where to start counting the pages
        paginationSize: 3,  // the pagination bar size.
        alwaysShowAllBtns: true,
        withFirstAndLast: true,
        paginationShowsTotal: this.renderShowsTotal,  // Accept bool or function
    };

    cellEdit = {
        mode: 'click' // click cell to edit
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
                <div className='home' style={{ backgroundColor: 'white' }}>

                <BootstrapTable
                    data={this.state.alerts}
                    insertRow={true}
                    deleteRow={true}
                    condensed={true}
                    pagination={true}
                    cellEdit={this.cellEdit}
                    selectRow={this.selectRow}
                    options={this.options}
                    maxHeight={this.state.tableHeight}>
                    <TableHeaderColumn
                        dataField='alertId'
                        isKey visible={false}
                        hiddenOnInsert={true}
                        autoValue={true}
                        hidden={true}
                    width='5%'>Alert ID</TableHeaderColumn>
                    <TableHeaderColumn dataField='alertName'>Alert Name</TableHeaderColumn>
                    <TableHeaderColumn dataField='highValue'>High Value</TableHeaderColumn>
                    <TableHeaderColumn dataField='lowValue'>Low Value</TableHeaderColumn>
                    <TableHeaderColumn dataField='status'>Status</TableHeaderColumn>
                    <TableHeaderColumn dataField='active'>Active</TableHeaderColumn>
                </BootstrapTable>
                </div>
            );

    };


}

export default AlertsMain;
