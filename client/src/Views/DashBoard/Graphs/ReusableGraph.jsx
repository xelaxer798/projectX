import React, {Component} from 'react';
import SensorDataAPI from '../../../Data/sensorData-api';
import Plot from 'react-plotly.js';
import Constants from '../Constants/index';
import Images from "../../../Images";

class ReusableGraph extends Component {
    state = {
        data: [],
        selectorOptions: {},
        layout: {},
        loading: true,
        statusCode: 'status code will appear here'
    };
    componentDidMount = () => {
        let layout = {
            width: 575,
            height: 700,
            margin: {
                // l: 50,
                // r: 50,
                // b: 100,
                // t: 100,
                pad: 1
            },
            xaxis: {
                tickfont: {
                    family: 'Old Standard TT, serif',
                    size: 12,
                    color: 'black'
                }, ticks: 'outside', rangeselector: Constants.selectorOptions,
                rangeslider: {}, tickangle: -45, tickformat: '%a %I:%M%p %e-%b', tickcolor: '#000', autotick: true
            },
            title: 'pH'
        };
        this.setState({
            selectorOptions: Constants.selectorOptions,
            layout: layout
        });
        console.log("component did mount");
        setTimeout(this.getData, Constants.timeoutAndIntervalSettings.graphTimeout);
        setInterval(this.getData, Constants.timeoutAndIntervalSettings.graphUpdateInterval);
    };
    getData = () => {
        console.log("get data");
        SensorDataAPI.getAll(this.props.sensorId).then(data => {
            console.log("Data: " + JSON.stringify(data.data));
            if (data.data !== null || data.data !== undefined || data.data !== []) {
                this.setState({
                    data: data.data.pH,
                    loading: false,
                    statusCode: `Temperature Status Code: ${data.status}  `
                });
            }
            ;
        });
    };
//   render() {
//     return(
//     <div>
//       Hello world
//     </div>
//     )
//   }
// }
    render() {
        return (
            <div>
                <div style={{paddingLeft: '10px', color: 'black'}}>
                    {this.state.statusCode}
                    {!this.state.loading ? <Plot

                        data={this.state.data}
                        layout={this.state.layout}
                    /> : <div>
                        <h1>Your Graphs are Loading</h1>
                        <img src={Images.loadingGif} alt='loading'/>
                    </div>}

                </div>
            </div>

        );
    };
};
export default ReusableGraph;
