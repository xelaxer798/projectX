import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Data from '../../../Data/nodes-api';
import functions from '../../../Functions/index';
import Images from '../../../Images/index';
const styles = {
  card: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
};


class RGBCardData extends Component {
  state = {
    r: 0,
    g: 0,
    b: 0,
    time: '',
    loading:true
  };

  componentDidMount = () => {
    setInterval(this.getData, 10000);

  };
  getData = async () => {

let data =await Data.getById(this.props.userid);

      try {
        this.setState({
          r: data.data.r,
          g: data.data.g,
          b: data.data.b,
          time: functions.getFormateTime(data.data.createdAt, 'cards'),
          loading:false
        });
      } catch (err) {

      };

   
  };
  render() {
    const { classes } = this.props;
    return (
      <div>
        {!this.state.loading?<div>
          <Card className={classes.card}>

            <CardContent>
              <Typography gutterBottom variant="headline" component="h2">
                RGB
                    </Typography>
              <Typography component="p">
                R: {this.state.r}
              </Typography>
              <Typography component="p">
                G: {this.state.g}
              </Typography>
              <Typography component="p">
                B: {this.state.b}
              </Typography>
              <Typography component="p">
                Date: {this.state.time}
              </Typography>
            </CardContent>

          </Card>
        </div>:<img src={Images.loadingGif}alt='loading' height={100} width={100}/>}
        
      </div>
    );
  };

};
RGBCardData.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(RGBCardData);