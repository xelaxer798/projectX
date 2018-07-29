import React from 'react';
import styled from 'styled-components';
import './Footer.css'
import { Col, Container, Row } from 'react-grid-system';
import { Link } from 'react-router-dom';

import Button from '@material-ui/core/Button';

const Copyright = styled.span`
  padding-right: 0.5em;
`;

const Separator = styled.span`
  padding-right: 0.5em;
  padding-left: 0.5em;
`;

const ExtLink = styled.a`
  &,
  &:hover,
  &:active,
  &:visited {
    color: rgba(0, 0, 0, 0.6);
    text-decoration: none;
  }

  &:hover {
    text-decoration: underline;
  }
`;

const footer = () => {
  return (
    <div style={{backgroundColor: '#3F51B5',position:'relative',
    left:0,
    bottom:0,
    right:0}}>
      <Container >
        <Row className='FooterRowOne'>
          <Col sm={4} style={{ display: 'inline-block', margin: 'auto'}}>

            {/* <div><Link to='/'><Button> Home </Button></Link></div>          
            <div><Link to='/registration'><Button>  Registration</Button> </Link> </div> */}
          
          </Col>
          <Col sm={4}>
            {/* <img src="https://i.imgur.com/heRuT1H.png" alt="TClogo" style={{ margin: '35px auto auto auto', maxWidth: '100%' }} /> */}
            {/* <h1  style={{ margin: '35px auto auto auto', maxWidth: '100%',color:'white'}}> Leaf Lift Systems</h1> */}
          </Col>
          <Col sm={4}>
            <div className="footer-icons">
              <ExtLink href="#"><i className="fa fa-facebook fa-2x"></i></ExtLink>
              <ExtLink href="#"><i className="fa fa-twitter fa-2x"></i></ExtLink>
              <ExtLink href="#"><i className="fa fa-linkedin fa-2x"></i></ExtLink>
              <ExtLink href="#"><i className="fa fa-github fa-2x"></i></ExtLink>
            </div>
          </Col>
        </Row>
        <Row style={{padding: '15px 0px'}}>
          <Col sm={12}>
            <Copyright css="padding-right: 0.5em"><b>&copy; 2017</b></Copyright>
            <ExtLink href="/">GrowAI</ExtLink>
            <Separator>|</Separator>
            <ExtLink href="/privacy">Privacy Policy</ExtLink>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default footer;