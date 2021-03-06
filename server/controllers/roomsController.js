import db from "../models";
import bcrypt from'bcrypt';
import jwt, { verify } from 'jsonwebtoken';
import sgMail from '@sendgrid/mail';
// import sengridoToken from '../../sendgrid'
const secret = process.env.jwt||'5454554545';
const sengrido =process.env.sendgrid 
sgMail.setApiKey(sengrido);
// Defining methods for the booksController
const saltRounds =10;
function getDbDate (data) {
  const split=JSON.stringify(data);
const dbDate = split.split(':')
const splitDate=dbDate[0].split('-')
const dayCreated =splitDate[2].split('T')
const removed=splitDate[0].split('"')

const dates=splitDate[1]+' '+dayCreated[0]+' '+removed[1]
return dates
}
const controller = {
    getRooms: function(req, res) {

        db.warnings.findAll({
          order: [ [ 'createdAt', 'DESC' ]],
          limit:25,
          where:{
    
            userId: req.params.id
          
          }
          })
          .then(dbModel => res.json(dbModel))
          .catch(err => res.status(422).json(err));
      },
      create: function(req, res) {
        console.log(req.params.userid,'hey cuntu')
        db.rooms.create({
        roomSize:req.body.roomSize,
        roomName:req.body.roomName,
        nodeList:req.body.nodeList
          })
          .then(dbModel => res.json(dbModel))
          .catch(err => res.status(422).json(err));
      },
};

export { controller as default };
