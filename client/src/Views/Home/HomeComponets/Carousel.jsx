
import React, {Component} from 'react';
import './Carousel.css'
const Carousel  =require('react-responsive-carousel').Carousel;

class CarouselItem extends Component {
  
  render(){
    return(
      <div className='home'>
      {/* {nChange={onChange} onClickItem={onClickItem} onClickThumb={onClickThumb}} */}
     <Carousel style={{height:'30px'}}showArrows={true} >
                <div>
                    <img  height="42" width="42"src="http://qnimate.com/wp-content/uploads/2014/03/images2.jpg" />
                    <p className="legend">Legend 1</p>
                </div>
                <div>
                    <img src="http://qnimate.com/wp-content/uploads/2014/03/images2.jpg" />
                    <p className="legend">Legend 2</p>
                </div>
                <div>
                    <img src="http://qnimate.com/wp-content/uploads/2014/03/images2.jpg" />
                    <p className="legend">Legend 3</p>
                </div>
                <div>
                    <img src="http://qnimate.com/wp-content/uploads/2014/03/images2.jpg" />
                    <p className="legend">Legend 4</p>
                </div>
                <div>
                    <img src="https://www.google.com/url?sa=i&source=imgres&cd=&cad=rja&uact=8&ved=2ahUKEwjy38uEmLHcAhXLrVQKHSTgBeAQjRx6BAgBEAU&url=https%3A%2F%2Fwww.colourbox.com%2Fimage%2Fwild-blue-cornflower-on-the-green-meadow-with-sun-rays-image-1479358&psig=AOvVaw0IABrLfX9zJqiblW_j1WT-&ust=1532296630572869" />
                    <p className="legend">Legend 5</p>
                </div>
                <div>
                    <img src="https://www.google.com/url?sa=i&source=imgres&cd=&cad=rja&uact=8&ved=2ahUKEwjNrsGImLHcAhXLjlQKHRNyCLgQjRx6BAgBEAU&url=https%3A%2F%2Fwww.photos.com%2Fphoto%2Fking-cheetah-acinonyx-jubatus-in-a-forest-kapama-reserve-south-africa-id94451558&psig=AOvVaw0IABrLfX9zJqiblW_j1WT-&ust=1532296630572869" />
                    <p className="legend">Legend 6</p>
                </div>
            </Carousel>
    </div>
    )
  
  }


}
export default CarouselItem