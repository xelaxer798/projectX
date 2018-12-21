import React, {Component} from 'react';
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";
import NodeApi from '../../../Data/nodes-api'
import moment from "moment";


class NodesMain extends Component {

    constructor(props) {
        super(props);
        this.state = {
            nodes: [{
                nodeId: '1',
                nodeName: 'placeholder'
            }]
        }
        this.getNodes = this.getNodes.bind(this);

    }

    getNodes() {
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
    }



    componentDidMount = () => {
        this.getNodes();
        setInterval(this.getNodes, 1000 * 60 * 5);

    };


    render() {
        const columns = [{
            dataField: 'nodeId',
            text: 'Node ID'
        }, {
            dataField: 'nodeName',
            text: 'Node Name'
        }, {
            dataField: 'lastUpdate',
            text: 'Last Update',
            formatter:  dateFormatter
        }];

        function dateFormatter(cell, row) {
            console.log("Cell contents: " + JSON.stringify(cell));
            if (cell) {
                return moment(cell).format('MMM. D, YYYY [at] h:mm A z');
            } else {
                return "";
            }
           // ?const formattedDateTime = moment(cell.getDate()).format('MMM. D, YYYY [at] h:mm A z');

            // return `${('0' + cell.getDate()).slice(-2)}/${('0' + (cell.getMonth() + 1)).slice(-2)}/${cell.getFullYear()}`;
         }

        return (
            <BootstrapTable
                ref={n => this.node = n}
                data={this.state.nodes}
                striped={true}
                condensed={true}
                // defaultSorted={this.defaultSorted}
                bootstrap4={true}
                classes="table-class"
                // cellEdit={cellEditFactory({mode: 'click', blurToSave: true})}
                keyField='nodeId'
                // selectRow={this.selectRow}
                // rowEvents={this.rowEvents}
                columns={columns}>

            </BootstrapTable>
        )

    }

}


export default NodesMain;