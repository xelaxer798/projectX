import React, {Component} from 'react';
import Modal from 'react-modal';
import Form from "react-validation/build/form";
import Select from 'react-select';
import Grid from "@material-ui/core/Grid/Grid";
import CropsApi from "../../../Data/crops-api";
import Functions from "../../../Functions/index"
import ReactTable from "react-table";
import functions from "../../../Functions";
import moment from "moment";
import PlantingsListTable from "./PlantingsListTable"

class SelectCropModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            crops: [],
            plantings: [],
            selectedCrop: "",
            loading: false
        }
    }

    componentDidMount = () => {
        this.props.onRef(this)
        CropsApi.getCrops().then(results => {
            let crops = [];
            results.data.forEach(crop => {
                crops.push({
                    value: crop.id,
                    label: crop.commonName,
                    plantings: crop.plantings,
                    sortName: crop.sortName
                })
            });
            crops.sort(Functions.compareValues("sortName"));
            this.setState({
                crops: crops,
                plantings: []
            })
        })

    };

    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    setPlantings = (plantings) => {
        this.setState({
            plantings: plantings
        })
    }

    handleSelectChange = (optionSelected) => {
        this.setState({
            loading: true
        }, this.getPlantings(optionSelected));
    };

    handleSelectPlanting = (rowInfo, column, instance, e) => {
        console.log("Selected Row handle select: " + this.state.selectedCrop);
        this.props.handleSelectPlanting(rowInfo, column, instance, e, this.state.selectedCrop)
    };

    getPlantings(optionSelected) {
        CropsApi.getPlantings(optionSelected.plantings).then(results => {
            console.log("Plantings result: " + JSON.stringify(results));
            let plantings = results.data.sort(Functions.compareValues("harvestDate", "desc"));
            // results.data.forEach(crop => {
            //     crops.push({
            //         value: crop.id,
            //         label: crop.commonName,
            //         plantings: crop.plantings,
            //         sortName: crop.sortName
            //     })
            // });
            this.setState({
                plantings: plantings,
                loading: false,
                selectedCrop: optionSelected.label
            })
        })
    }

    render() {

        let rand = () => Math.floor(Math.random() * 20) - 10;

        const modalStyle = function () {
            // we use some psuedo random coords so nested modals
            // don't sit right on top of each other.
            let top = 50 + rand();
            let left = 50 + rand();

            return {
                position: 'fixed',
                width: 400,
                zIndex: 1040,
                top: top + '%',
                left: left + '%',
                border: '1px solid #e5e5e5',
                backgroundColor: 'green',
                boxShadow: '0 5px 15px rgba(0,0,0,.5)',
                padding: 20
            };
        };


        // function dateFormatter(row, Object) {
        //     console.log("Cell contents: " + JSON.stringify(row.value));
        //     let {lastUpdate} = functions.getLastUpdatedAndElapseTimeStrings("America/Los_Angeles", row.value);
        //     if (row.value) {
        //         return moment(row.value).format('M/D/YY h:mm A z');
        //     } else {
        //         return "";
        //     }
        //     // ?const formattedDateTime = moment(cell.getDate()).format('MMM. D, YYYY [at] h:mm A z');
        //
        //     // return `${('0' + cell.getDate()).slice(-2)}/${('0' + (cell.getMonth() + 1)).slice(-2)}/${cell.getFullYear()}`;
        // }

        // const columns = [{
        //     accessor: 'plantingId',
        //     Header: 'Planting ID'
        // }, {
        //     accessor: 'dateSowed',
        //     Header: 'Date Sowed',
        //     Cell: dateFormatter
        // }, {
        //     accessor: 'firstLightDate',
        //     Header: 'First Light',
        //     Cell: dateFormatter
        // }, {
        //     accessor: 'harvestDate',
        //     Header: 'Harvest Date',
        //     Cell: dateFormatter
        // }, {
        //     accessor: 'substrate',
        //     Header: 'Substrate'
        // }, {
        //     accessor: 'harvestWeight',
        //     Header: 'Harvest Weight (g)'
        // }, {
        //     accessor: 'totalDays',
        //     Header: 'Total Days'
        // }, {
        //     accessor: 'darkDays',
        //     Header: 'Dark Days'
        // }, {
        //     accessor: 'germLocation',
        //     Header: 'Germinator Location'
        // }, {
        //     accessor: 'greenhouseLocation',
        //     Header: 'Greenhouse Location'
        // }, {
        //     accessor: 'notes',
        //     Header: 'Notes'
        // }];


        return <Modal
            isOpen={this.props.isOpen}
            style={{
                overlay: {
                    backgroundColor: 'papayawhip'
                },
            }}
        >
            <button className="btn-primary btn-xs" onClick={this.props.closeModal}>Close</button>
            <Select
                options={this.state.crops}
                onChange={this.handleSelectChange}/>
            <PlantingsListTable
                plantings={this.state.plantings}
                handleSelectPlanting={this.handleSelectPlanting}
                loading={this.state.loading}
            />
            {/*<ReactTable*/}
            {/*data={this.state.plantings}*/}
            {/*columns={columns}*/}
            {/*className="-striped -highlight"*/}
            {/*defaultPageSize={10}*/}
            {/*defaultSorted={[*/}
            {/*{*/}
            {/*id: "lastUpdate"*/}
            {/*}*/}

            {/*]}*/}
            {/*getTdProps={(state, rowInfo, column, instance) => {*/}
            {/*return {*/}
            {/*onDoubleClick: (e) => {*/}
            {/*this.props.handleSelectPlanting(state,rowInfo,column,instance,e)*/}
            {/*}*/}
            {/*};*/}
            {/*}}*/}
            {/*/>*/}


            <Form ref={c => {
                this.form = c
            }} onSubmit={this.handleSubmit}>

            </Form>

        </Modal>
    }

}

export default SelectCropModal