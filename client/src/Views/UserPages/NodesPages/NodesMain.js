import React, {Component} from 'react';
import NodeApi from '../../../Data/nodes-api'
import moment from "moment";
import ReactTable from "react-table";
import 'react-table/react-table.css'
import './NodeMain.css'
import EditNodeModal from "./EditNodeModal";
import functions from "../../../Functions/index";
import nodesAPI from "../../../Data/nodes-api"

class NodesMain extends Component {

    constructor(props) {
        super(props);
        this.state = {
            nodes: [{
                nodeId: '1',
                nodeName: 'placeholder'
            }],
            modalIsOpen: false,
            nodeToEdit: {}

        };
        // this.getNodes = this.getNodes.bind(this);
        // this.closeModal = this.closeModal.bind(this);
        // this.editNode = this.editNode.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleEdit = this.handleEdit.bind(this);

        document.title = "Project X - Nodes"
    }

    closeModal = () => {
        this.setState({
            modalIsOpen: false
        });
    };


    getNodes = () => {
        console.log("Get all nodes");
        NodeApi.getNodes().then(results => {
            console.log("Get all nodes: " + JSON.stringify(results.data));
            this.setState({nodes: results.data});
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
        this.getNodes();
        setInterval(this.getNodes, 1000 * 60);

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
            modalIsOpen:true,
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
            accessor: 'nodeId',
            Header: 'Node ID'
        }, {
            accessor: 'nodeName',
            Header: 'Node Name'
        }, {
            accessor: 'lastUpdate',
            Header: 'Last Update',
            Cell: dateFormatter
        }, {
            accessor: 'numberOfFlowSensors',
            Header: '# of Flow Sensors'
        }, {
            accessor: 'numberOfOutlets',
            Header: '# of Outlets'
        }, {
            Header: '',
            Cell: row => (
                <div>
                    <button className="  btn-default btn-xs" onClick={() => this.handleEdit(row.original)}>Edit</button>
                    <button className="   btn-primary btn-xs" onClick={() => this.handleDelete(row.original)}>Delete</button>
                </div>
            )

        }];

        function dateFormatter(row, Object) {
            console.log("Cell contents: " + JSON.stringify(row.value));
            let {lastUpdate, elapseTimeString} = functions.getLastUpdatedAndElapseTimeStrings("America/Los_Angeles", row.value);
            if (row.value) {
                return moment(row.value).format('M/D/YY h:mm A z') + "(" + elapseTimeString + ")";
            } else {
                return "";
            }
            // ?const formattedDateTime = moment(cell.getDate()).format('MMM. D, YYYY [at] h:mm A z');

            // return `${('0' + cell.getDate()).slice(-2)}/${('0' + (cell.getMonth() + 1)).slice(-2)}/${cell.getFullYear()}`;
        }

        function booleanFormatter(row, Object) {
              if (row.value) {
                return "☑";
            } else {
                return "︎𐄂";
            }
            // ?const formattedDateTime = moment(cell.getDate()).format('MMM. D, YYYY [at] h:mm A z');

            // return `${('0' + cell.getDate()).slice(-2)}/${('0' + (cell.getMonth() + 1)).slice(-2)}/${cell.getFullYear()}`;
        }


        return (
            <div>
                {/*<BootstrapTable*/}
                {/*ref={n => this.node = n}*/}
                {/*data={this.state.nodes}*/}
                {/*striped={true}*/}
                {/*condensed={true}*/}
                {/*// defaultSorted={this.defaultSorted}*/}
                {/*bootstrap4={true}*/}
                {/*classes="table-class"*/}
                {/*// cellEdit={cellEditFactory({mode: 'click', blurToSave: true})}*/}
                {/*keyField='nodeId'*/}
                {/*// selectRow={this.selectRow}*/}
                {/*// rowEvents={this.rowEvents}*/}
                {/*columns={columns}>*/}

                {/*</BootstrapTable>*/}
                <ReactTable
                    data={this.state.nodes}
                    columns={columns}
                    className="-striped -highlight"
                    defaultPageSize={10}
                    defaultSorted={[
                        {
                            id: "lastUpdate"
                        }

                    ]}
                     getTdProps={(state, rowInfo, column, instance) => {
                        return {
                            onDoubleClick: (e) => {
                                this.editNode(state,rowInfo,column,instance,e)
                            }
                        };
                    }}
                />
                <EditNodeModal isOpen={this.state.modalIsOpen}
                               closeModal={this.closeModal}
                nodeToEdit={this.state.nodeToEdit}/>

            </div>


        )

    }

}


export default NodesMain;