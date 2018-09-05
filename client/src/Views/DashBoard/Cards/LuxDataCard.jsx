import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Data from '../../../Data/nodes-api';
import functions from '../../../Functions/index';
import Images from '../../../Images/index';
// import CardActions from '@material-ui/core/CardActions';
// import CardMedia from '@material-ui/core/CardMedia';
// import Button from '@material-ui/core/Button';
const styles = {
  card: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
};
class LuxDataCard extends Component {
  state = {
    lux: 0,
    ir: 0,
    visible: 0,
    full: 0,
    time: '',
    loading:true
  };

  componentDidMount = () => {
    setTimeout(this.GetData, 6000);
    setInterval(this.getData, 38000);

  };
  getData = async () => {
   let data=await Data.getById(this.props.userid);

      try {
        this.setState({
          lux: data.data.lux,
          ir: data.data.ir,
          visible: data.data.visible,
          full: data.data.full,
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
                Lux, Infrared, Visible, Full
                    </Typography>
              <Typography component="p">
                Lux: {this.state.lux}
              </Typography>
              <Typography component="p">
                Infrared: {this.state.ir}
              </Typography>
              <Typography component="p">
                Visible: {this.state.visible}
              </Typography>
              <Typography component="p">
                Full: {this.state.full}
              </Typography>
              <Typography component="p">
                Date: {this.state.time}
              </Typography>
            </CardContent>

          </Card>
        </div>: <img src={Images.loadingGif} alt='loading' height={100} width={100} />}
        
    
      </div>
    );
  };

};




LuxDataCard.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(LuxDataCard);