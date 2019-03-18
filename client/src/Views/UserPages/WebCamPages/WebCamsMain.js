import React, {Component} from 'react';
import webCamAPI from "../../../Data/webCams-api"
import base64 from "base-64"

class WebCamsMain extends Component {

    constructor(props) {
        super(props)
        this.state = {
            imageURL: ""
        }
    }

    getWebCamImages = () => {
        webCamAPI.getLatestImage("MicroGreenhouse1").then(webCamImage => {
            console.log("ImageURL:" + JSON.stringify(webCamImage.data.imageURL))
            this.setState({
                imageURL: webCamImage.data.imageURL
            })
        })
    };

    componentDidMount = () => {
        this.getWebCamImages();
    };


    render() {
        return(
            <div>
                <img width = "500px" alt="" src={this.state.imageURL}/>
            </div>
        );
    }
}

export default WebCamsMain;