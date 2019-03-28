import React, {Component} from 'react';
import ReactTable from "react-table";
import Modal from "react-modal";
import functions from "../../../Functions";
import moment from "moment";

class PlantingsListTable extends Component {

    render() {

        function dateFormatter(row, Object) {
            console.log("Cell contents: " + JSON.stringify(row.value));
            let {lastUpdate} = functions.getLastUpdatedAndElapseTimeStrings("America/Los_Angeles", row.value);
            if (row.value) {
                return moment(row.value).format('M/D/YY h:mm A z');
            } else {
                return "";
            }
            // ?const formattedDateTime = moment(cell.getDate()).format('MMM. D, YYYY [at] h:mm A z');

            // return `${('0' + cell.getDate()).slice(-2)}/${('0' + (cell.getMonth() + 1)).slice(-2)}/${cell.getFullYear()}`;
        }


        const columns = [{
            accessor: 'plantingId',
            Header: 'Planting ID',
            show:false
        }, {
            accessor: 'cropName',
            Header: 'Crop',
            show: this.props.showCropName
        }, {
            accessor: 'dateSowed',
            Header: 'Date Sowed',
            Cell: dateFormatter
        }, {
            accessor: 'firstLightDate',
            Header: 'First Light',
            Cell: dateFormatter
        }, {
            accessor: 'harvestDate',
            Header: 'Harvest Date',
            Cell: dateFormatter
        }, {
            accessor: 'substrate',
            Header: 'Substrate',
            width: 100
        }, {
            accessor: 'harvestWeight',
            Header: 'wt.',
            width: 50
        }, {
            accessor: 'totalDays',
            Header: '# Days',
            width: 50
        }, {
            accessor: 'darkDays',
            Header: 'Dark Days',
            width: 50
        }, {
            accessor: 'germLocation',
            Header: 'Germ',
            width: 75
        }, {
            accessor: 'greenhouseLocation',
            Header: 'GH',
            width: 75
        }, {
            accessor: 'notes',
            Header: 'Notes'
        }];


        return (
            <ReactTable
                data={this.props.plantings}
                loading={this.props.loading}
                showPagination={this.props.showPagination}
                columns={columns}
                className="-striped -highlight"
                defaultPageSize={this.props.defaultPageSize ? this.props.defaultPageSize : 20}
                 getTdProps={(state, rowInfo, column, instance) => {
                    return {
                        onDoubleClick: (e) => {
                            this.props.handleSelectPlanting(rowInfo,column,instance,e)
                        }
                    };
                }}
            />

        )
    }
}

PlantingsListTable.defaultProps = {
    showPagination: true,
    showCropName: false
}

export default PlantingsListTable