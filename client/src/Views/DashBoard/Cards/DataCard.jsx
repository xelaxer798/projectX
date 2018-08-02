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


    class CardData extends Component{
        state={
r:0,
g:0,
b:0,
time:''
        }
    
        componentDidMount = () => {
            Data.getAll().then(data => {
console.log(data.data[0].r)
this.setState({
    r:data.data[0].r,
    g:data.data[0].g,
    b:data.data[0].b,
    time:data.data[0].currentTime
})
            })
        }
        render(){
            const { classes } = this.props;
            return (
              <div>
                  {console.log(this.state)}
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
                     TIme: {this.state.time}
                    </Typography>
                  </CardContent>
                
                </Card>
              </div>
            );
          }
          
        }
        
   
      

    CardData.propTypes = {
        classes: PropTypes.object.isRequired,
      };
export default withStyles(styles)(CardData);