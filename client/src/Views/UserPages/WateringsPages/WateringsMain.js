import React, {Component} from 'react';
import SensorDataApi from '../../../Data/sensorData-api'
import moment from "moment";
import ReactTable from "react-table";
import 'react-table/react-table.css'
import functions from "../../../Functions/index";
import nodesAPI from "../../../Data/nodes-api";
import _ from 'lodash';

class WateringsMain extends Component {

    constructor(props) {
        super(props);
        this.state = {
            wateringEvents: [{
                sensorId: '1',
                sensorName: 'placeholder'
            }],

        };

        document.title = "Project X - Waterings"
    }


    getWaterings = () => {
        console.log("Get all waterings");
        SensorDataApi.getWaterings().then(results => {
            console.log("Get all waterings: " + JSON.stringify(results.data));
            this.setState({waterings: results.data});
            // const nodes = [];
            // results.data.forEach(node => {
            //     nodes.push({
            //         nodeId: node.nodeId,
            //         nodeName: node.nodeName,
            //     lastNotification: node.lastNotification})
            // });
            // this.setState({
            //     nodes: nodes
            // });

        })
            .catch(err => {
                console.log("Error: " + err);
            })
    };


    componentDidMount = () => {
        this.getWaterings();
        setInterval(this.getWaterings, 1000 * 60);

    };

    editNode = (state, rowInfo, column, instance, e) => {
        console.log("Edit node: " + e);
        console.log("Cell - onDoubleClick", {
            state,
            rowInfo,
            column,
            instance,
            e: e
        })
        this.setState({
            modalIsOpen: true,
            nodeToEdit: this.state.nodes[rowInfo.index]
        })
    };

    handleEdit = (row) => {
        console.log("Row to edit: " + JSON.stringify(row));
        nodesAPI.updateWeatherNodes();
        //     this.setState({
        //         modalIsOpen:true,
        //         nodeToEdit: row
        //     })
    };

    handleDelete = (row) => {
        console.log("Row to delete: " + JSON.stringify(row));
    };


    render() {
        const columns = [{
            accessor: 'sensorId',
            Header: 'Sensor ID'
        }, {
            accessor: 'sensorName',
            aggregate: vals => vals[0] + "(s)",
            Header: 'Sensor Name'
        }, {
            accessor: 'amount',
            aggregate: vals => _.round(_.mean(vals)),
            Aggregated: row => {
                return (
                    <div style={{textAlign: "right"}}>
                        {row.value.toLocaleString()} (avg)
                      </div>
                );
            },
            Header: () => (
                <div style={{ textAlign: "right" }}>Amount ml</div>
            ),
            Cell: row => <div style={{ textAlign: "right" }}>{row.value.toLocaleString()}</div>
        }, {
            accessor: 'startTime',
            aggregate: vals => "",
            Header: 'Start Time',
            Cell: dateFormatter
        }, {
            accessor: 'endTime',
            aggregate: vals => "",
            Header: 'End Time',
            Cell: dateFormatter
        }, {
            accessor: 'updatedAt',
            aggregate: vals => "",
            Header: 'Updated At',
            Cell: dateFormatter
        }, {
            accessor: 'duration',
            aggregate: vals => {
                console.log("Duration vals: " + JSON.stringify(vals));
                let sum = vals.reduce((acc, curr) => {
                    console.log("Duration curr: " + moment(curr).seconds());
                    return acc + moment(curr).seconds();
                }, 0)
                console.log("Duration sum: " + sum)
                return sum/vals.length
            },
            Aggregated: row => {
                return (
                    <span>
                        {floatValueFormater(row)} (avg)
                      </span>
                );
            },
            Header: 'Duration',
            Cell: durationFormatter
        }, {
            accessor: 'rate',
            aggregate: vals => _.round(_.mean(vals)),
            Aggregated: row => {
                return (
                    <span>
                        {floatValueFormater(row)} (avg)
                      </span>
                );
            },
            Header: 'Flow rate ml/s',
            Cell: floatValueFormater

        }];

        function dateFormatter(row, Object) {
            console.log("Cell contents: " + JSON.stringify(row.value));
            if (row.value) {
                return moment(row.value).format('M/D/YY h:mm:ss A z');
            } else {
                return "";
            }
        }

        function durationFormatter(row, Object) {
            // let {lastUpdate, elapseTimeString} = functions.getLastUpdatedAndElapseTimeStrings("America/Los_Angeles", row.value);
            if (row.value) {
                return moment(row.value).format('mm:ss');
            } else {
                return "";
            }
        }

        function floatValueFormater(row, Object) {
            // let {lastUpdate, elapseTimeString} = functions.getLastUpdatedAndElapseTimeStrings("America/Los_Angeles", row.value);
            if (row.value) {
                return row.value.toFixed(2);
            } else {
                return "";
            }
        }


        return (
            <div>
                <ReactTable
                    data={this.state.waterings}
                    columns={columns}
                    className="-striped -highlight"
                    defaultPageSize={10}
                    pivotBy={["sensorId"]}
                    defaultSorted={[
                        {
                            id: "startTime",
                            desc: true
                        }

                    ]}
                    getTdProps={(state, rowInfo, column, instance) => {
                        return {
                            onDoubleClick: (e) => {
                                this.editNode(state, rowInfo, column, instance, e)
                            }
                        };
                    }}
                />
            </div>


        )

    }

}


export default WateringsMain;