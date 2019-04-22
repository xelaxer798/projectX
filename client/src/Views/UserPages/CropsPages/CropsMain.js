import React, {Component} from 'react';
import CropsApi from '../../../Data/crops-api'
import moment from "moment";
import ReactTable from "react-table";
import 'react-table/react-table.css'
import functions from "../../../Functions/index";
import cropsAPI from "../../../Data/crops-api"
import {Button} from "react-bootstrap";
import Grid from "@material-ui/core/Grid/Grid";

import pdfMake from 'pdfmake/build/pdfmake';
import vfsFonts from 'pdfmake/build/vfs_fonts';

class NodesMain extends Component {

    constructor(props) {
        super(props);
        this.state = {
            crops: []
        };

        document.title = "Project X - Crops"
    }


    getCrops = () => {
        console.log("Get all nodes");
        CropsApi.getCropPrices().then(results => {
            console.log("Get all nodes: " + JSON.stringify(results.data));
            this.setState({crops: results.data});

        })
            .catch(err => {
                console.log("Error: " + err);
            })
    };


    componentDidMount = () => {
        this.getCrops();
        setInterval(this.getNodes, 1000 * 60);

    };

    createPriceSheet = () => {
        console.log("Create price sheet")

        const formatCurrentCrops = (data) => {
            return data.map(item => {
                return ([
                    {text: item.commonName},
                    {text: Number.parseFloat(item.pricing).toFixed(2)}
                ]);
            });
        }

        const formatFutureCrops = (data) => {
            return data.map(item => {
                return ([
                    {text: item.commonName}
                ]);
            });
        }

        const currentCrops = formatCurrentCrops(this.state.crops.filter(crop => {
            return crop.status === "Available";
        }));

        let currentCropsRight = [];
        let currentCropsLeft = [];
        console.log("Current crops: " + currentCrops);
        let currentCropsHalfwayPoint = currentCrops.length / 2;
        currentCrops.forEach((crop, index) => {
            if (index > currentCropsHalfwayPoint) {
                currentCropsRight.push(crop);
            } else {
                currentCropsLeft.push(crop);
            }
        });


        const futureCrops = formatFutureCrops(this.state.crops.filter(crop => {
            return crop.status === "Future Offering";
        }));
        let futureCropsRight = [];
        let futureCropsLeft = [];
        console.log("Future crops: " + futureCrops);
        let futureCropsHalfwayPoint = futureCrops.length / 2;
        futureCrops.forEach((crop, index) => {
            if (index >= futureCropsHalfwayPoint) {
                futureCropsRight.push(crop);
            } else {
                futureCropsLeft.push(crop);
            }
        });


        const subTableLayout = {
            hLineWidth: function (i, node) {
                return 0;
            },
            vLineWidth: function (i, node) {
                return 0;
            },
            hLineColor: function (i, node) {
                return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
            },
            vLineColor: function (i, node) {
                return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
            },
            paddingLeft: function (i, node) {
                return 20;
            },
            paddingRight: function (i, node) {
                return 4;
            },
            paddingTop: function (i, node) {
                return 2;
            },
            paddingBottom: function (i, node) {
                return 2;
            },
        }

        const {vfs} = vfsFonts.pdfMake;
        pdfMake.vfs = vfs;
        const documentDefinition = {
            pageSize: 'A4',
            content: [
                {text: 'Current', style: 'subheader'},
                {

                    table: {
                        body: [
                            [
                                [
                                    {
                                        style: 'subTable',
                                        table: {
                                            body: [
                                                ...currentCropsLeft
                                            ]
                                        }, layout: subTableLayout
                                    }
                                ],
                                [
                                    {
                                        style: 'subTable',
                                        table: {
                                            body: [
                                                ...currentCropsRight
                                            ]
                                        }, layout: subTableLayout
                                    }
                                ]
                            ]
                        ]
                    },
                    layout: 'noBorders'
                },
                {text: 'Future', style: 'subheader'},
                {
                    table: {
                        body: [
                            [
                                [
                                    {
                                        style: 'subTable',
                                        table: {
                                            body: [
                                                ...futureCropsLeft
                                            ]
                                        }, layout: subTableLayout
                                    }
                                ],
                                [
                                    {
                                        style: 'subTable',
                                        table: {
                                            body: [
                                                ...futureCropsRight
                                            ]
                                        }, layout: subTableLayout
                                    }
                                ]
                            ]
                        ]
                    },
                    layout: 'noBorders'
                }
            ],
            styles: {
                subheader: {
                    fontSize: 18,
                    bold: true,
                    alignment: 'center'
                },
                subTable: {
                    margin: [0, 5, 0, 15]
                },
                mainTable: {
                    alignment: 'center'
                }

            }
        };
        const reportDate = () => '31 August 2017';
        pdfMake.createPdf(documentDefinition).download(`priceList-${reportDate()}.pdf`);
        // var pdfDoc = printer.createPdfKitDocument(documentDefinition);
        // var fs = require('fs');
        // pdfDoc.pipe(fs.createWriteStream('pdfs/basics.pdf'));
        // pdfDoc.end();

        // CropsApi.getPricingReport()
        //     .then(results => {
        //         console.log("PDFMAKE: " + JSON.stringify(results));
        //     });
    };


    render() {
        const columns = [{
            accessor: 'cropId',
            Header: 'Crop ID'
        }, {
            accessor: 'commonName',
            Header: 'Common Name'
        }, {
            accessor: 'pricing',
            Header: '4 oz. Pricing',
        }, {
            accessor: 'status',
            Header: 'Status',
        },];


        return (
            <div>
                <button
                    onClick={this.createPriceSheet}
                    className="btn btn-primary"
                >Create Price Sheet
                </button>
                <ReactTable
                    data={this.state.crops}
                    columns={columns}
                    className="-striped -highlight"
                    defaultPageSize={10}
                />

            </div>


        )

    }

}


export default NodesMain;