import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Data from '../../../Data/nodes-api'
const styles = {
  card: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
};


    class TempCardData extends Component{
        state={
lux:0,
ir:0,
visable:0,
full:0,
time:''
        }
    
        componentDidMount = () => {
          setInterval(this.getData, 3000);
          
        }
        getData=()=>{
          Data.getAll().then(data => {
            console.log(data.data)
            this.setState({
                lux:data.data[0].lux,
                ir:data.data[0].ir,
                visable:data.data[0].visable,
full:data.data[0].full,
                time:data.data[0].currentTime
            })
                        })
        }
        render(){
            const { classes } = this.props;
            return (
              <div>
           
                <Card className={classes.card}>
                
                  <CardContent>
                    <Typography gutterBottom variant="headline" component="h2">
                  Lux, Infrared, Visable, Full
                    </Typography>
                    <Typography component="p">
                      Lux: {this.state.lux}
                    </Typography>
                    <Typography component="p">
                    Infrared: {this.state.it}
                    </Typography>
                    <Typography component="p">
                   Visable: {this.state.visable }
                    </Typography>
                    <Typography component="p">
                    Full: {this.state.full }
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
        
   
      

        TempCardData.propTypes = {
        classes: PropTypes.object.isRequired,
      };
export default withStyles(styles)( TempCardData);