import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Data from '../../../Data/nodes-api';
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
    time: ''
  }

  componentDidMount = () => {
    setInterval(this.getData, 1000);

  }
  getData = async() => {
    Data.getById(this.props.userid).then(data => {
      try {
        this.setState({
          lux: data.data[0].lux,
          ir: data.data[0].ir,
          visible: data.data[0].visible,
          full: data.data[0].full,
          time: data.data[0].currentTime
        })
      } catch (err) {

      }

    })
  }
  render() {
    const { classes } = this.props;
    return (
      <div>

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
              TIme: {this.state.time}
            </Typography>
          </CardContent>

        </Card>
      </div>
    );
  }

}




LuxDataCard.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(LuxDataCard);