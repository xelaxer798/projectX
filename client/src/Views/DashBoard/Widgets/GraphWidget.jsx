import React, {Component} from 'react';
import Graphs from "../index";

class GraphWidget extends Component {

    render() {
        return (
            <div>
                <Graphs.Graphs.ReusableGraph  sensorId={this.props.sensorId}/>
            </div>
        )
    }

}

export default GraphWidget;