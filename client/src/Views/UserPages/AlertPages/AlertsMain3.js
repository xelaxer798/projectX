import React, {Component} from 'react';
import AlertsApi from '../../../Data/alerts-api'
import SensorApi from '../../../Data/sensor-api'
import NodeApi from '../../../Data/nodes-api'
import UsersApi from '../../../Data/users-api'
import Images from "../../../Images";
import BootstrapTable from 'react-bootstrap-table-next';
import './AlertsMain.css'
import cellEditFactory, {Type} from 'react-bootstrap-table2-editor';
import Modal from 'react-modal';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import Select from 'react-validation/build/select';
import Button from 'react-validation/build/button'
import {isEmail} from 'validator';
import './foundation-flex.css';
import EditAlertModal from './EditAlertModal'
import Constants from "../../DashBoard/Constants";
import moment from 'moment';

class AlertsMain3 extends Component {

    constructor(props) {
        super(props);
        let height = 400;

        this.state = {
            isLoading: false,
            alerts: [],
            modalIsOpen: false,
            modal2IsOpen: false,
            tableHeight: height + "px",
            selectedAlert: this.blankAlert,
            sensors: [],
            nodes: [],
            users: []
        };
        this.newRecord = this.newRecord.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.editRecord = this.editRecord.bind(this);
        AlertsMain3.renderColumns = AlertsMain3.renderColumns.bind(this);
        this.editRecord = this.editRecord.bind(this);
        AlertsMain3.setStatusColor = AlertsMain3.setStatusColor.bind(this);
        this.getAlerts = this.getAlerts.bind(this);

        document.title = "Project X - Alerts"

    }

    blankAlert = {
        alertName: "",
        highValue: 0,
        lowValue: 0,
        status: ""
    };

    editRecord(alertId) {
        const selectedAlert = this.state.alerts.find((alert) => {
            return (alert.alertId === alertId)
        });
        console.log("Selected alert: " + JSON.stringify(selectedAlert));
        this.setState({
            selectedAlert: selectedAlert,
            newRecord: false,
            modal2IsOpen: true,
        });
        // this.openModal();
    }


    closeModal() {
        this.setState({
            modal2IsOpen: false
        });
    }


    renderShowsTotal = (start, to, total) => {
        return (
            <p style={{color: 'blue'}}>
                From {start} to {to}, totals is {total}
            </p>
        );
    };

    componentDidMount = () => {
        this.getAlerts();
        this.getSensors();
        this.getNodes();
        this.getUsers();
        setInterval(this.getAlerts, 1000 * 60);

    };

    getAlerts() {
        let timezone = encodeURIComponent(moment.tz.guess());
        console.log("Timezone: " + timezone);
        AlertsApi.getAlerts(timezone).then(results => {
            this.setState({
                alerts: results.data,
                loading: false
            });
        });
    }

    getSensors() {
        SensorApi.getAll().then(results => {
            const sensors = [];
            results.data.forEach(sensor => {
                sensors.push({value: sensor.sensorId, label: sensor.dropdownLabel})
            });
            this.setState({
                sensors: sensors
            });

        })
    }

    getNodes() {
        NodeApi.getNodes().then(results => {
            const nodes = [];
            results.data.forEach(node => {
                console.log("Node ID: " + node.nodeId + "   Node name: " + node.nodeName)
                nodes.push({value: node.nodeId, label: node.nodeName})
            });
            this.setState({
                nodes: nodes
            });

        })
            .catch(err => {
                console.log("Error: " + err);
            })
    }


    getUsers() {
        UsersApi.findAllUsers().then(results => {
            const users = [];
            results.data.forEach(user => {
                console.log("User ID: " + user.userId + "   First name: " + user.firstName)
                users.push({value: user.userId, label: user.firstName + " " + user.lastName + " - " + user.email})
            });
            this.setState({
                users: users
            });

        })
            .catch(err => {
                console.log("Error: " + err);
            })
    }

    options = {
        afterInsertRow: this.onAfterInsertRow,   // A hook for after insert rows
        page: 1,  // which page you want to show as default
        sizePerPageList: [{
            text: '5', value: 5
        }, {
            text: '10', value: 10
        }], // you can change the dropdown list for size per page
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

    static setStatusColor(cell, row, rowIndex, colIndex) {
        let activeCss;
        if (row.active) {
            activeCss = "active-true "
        } else {
            activeCss = "active-false "
        }

        if (row.alertType === "Node") {
            if (row.status === 'a-ok') {
                return activeCss + "status-ok node-alert"
            } else {
                return activeCss + "status-danger node-alert"
            }
        } else if (row.alertType === "Sensor") {
            if (row.status === 'a-ok') {
                return activeCss + "status-ok sensor-alert"
            } else {
                return activeCss + "status-danger sensor-alert"
            }

        } else if (row.alertType === "Watering") {
            if (row.status === 'a-ok') {
                return activeCss + "status-ok watering-alert"
            } else {
                return activeCss + "status-danger watering-alert"
            }

        }
    }

    static checkBoxFormatter(cell, row) {
        if (row.active) {
            return ("︎︎✅");
        } else {
            return ("︎❌");
        }
    }

    static renderColumns() {

        return [{
            dataField: 'alertId',
            text: 'Alert ID',
            sort: true,
            hidden: false,
            classes: AlertsMain3.setStatusColor
        }, {
            dataField: 'alertName',
            text: 'Alert Name',
            sort: true,
            hidden: false,
            classes: AlertsMain3.setStatusColor
        }, {
            dataField: 'target',
            text: 'Target',
            sort: true,
            classes: AlertsMain3.setStatusColor
        }, {
            dataField: 'criteria',
            text: 'Criteria',
            sort: true,
            classes: AlertsMain3.setStatusColor
        }, {
            //     {
            dataField: 'current',
            text: 'Current',
            sort: true,
            classes: AlertsMain3.setStatusColor
        }, {
            dataField: 'status',
            text: 'Status',
            headerStyle: () => {
                return {width: "10%"};
            },
            classes: AlertsMain3.setStatusColor
        }, {
            dataField: 'active',
            text: 'Active',
            headerStyle: () => {
                return {width: "5%"};
            },
            classes: AlertsMain3.setStatusColor,
            formatter: AlertsMain3.checkBoxFormatter
        }, {
            dataField: 'users',
            text: 'User(s)',
            sort: true,
            classes: AlertsMain3.setStatusColor
        }
        ];

    }

    defaultSorted = [{
        dataField: 'target',
        order: 'asc'
    }];

    newRecord = () => {
        this.setState({
            newRecord: true,
            modal2IsOpen: true,
            selectedAlert: this.blankAlert
        });
        // this.openModal();
    };

    handleAlertFromModal = (alert) => {
        this.setState({
            modal2IsOpen: false
        });
        if (this.state.newRecord) {
            console.log("New alert: " + JSON.stringify(alert));
            AlertsApi.createAlert(alert).then(data => {
                console.log("Return from new alert: " + JSON.stringify(data));
                this.getAlerts();
            });
        } else {
            console.log("Updated from main alert: " + JSON.stringify(alert));
            AlertsApi.updateAlertDeep(alert).then(data => {
                console.log("Return from update alert: " + JSON.stringify(data));
                this.getAlerts();
            });
        }
    };

    selectRow = {
        mode: 'checkbox', // or checkbox
        clickToSelect: true,
    };

    rowEvents = {
        onDoubleClick: (e, row, rowIndex) => {
            // console.log("e: " + JSON.stringify(e));
            console.log("row: " + JSON.stringify(row));
            console.log("rowIndex: " + rowIndex);
            this.editRecord(row.alertId);
        }
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
                <div>
                    <div style={{padding: "5px"}}>
                        <button className="editButton" type="button" onClick={this.newRecord}>New</button>
                    </div>


                    <BootstrapTable
                        ref={n => this.node = n}
                        data={this.state.alerts}
                        striped={true}
                        condensed={true}
                        defaultSorted={this.defaultSorted}
                        bootstrap4={true}
                        classes="table-class"
                        cellEdit={cellEditFactory({mode: 'click', blurToSave: true})}
                        keyField='alertId'
                        selectRow={this.selectRow}
                        rowEvents={this.rowEvents}
                        columns={AlertsMain3.renderColumns()}>

                    </BootstrapTable>
                    <EditAlertModal
                        isOpen={this.state.modal2IsOpen}
                        selectedAlert={this.state.selectedAlert}
                        closeModal={this.closeModal}
                        sensors={this.state.sensors}
                        nodes={this.state.nodes}
                        newRecord={this.state.newRecord}
                        handleAlertFromModal={this.handleAlertFromModal}
                        users={this.state.users}
                    />
                </div>
            );

    };


}

export default AlertsMain3;
