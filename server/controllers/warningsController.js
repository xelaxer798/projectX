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
    warnings: function(req, res) {

        db.warnings.findAll({
          order: [ [ 'createdAt', 'DESC' ]],
          limit:25,
          where:{
    
            userId: req.params.id
      
          }
          })
          .then(data => {
            const tempatureWarnings = [];
            const humidityWarnings = [];
      
            const deviceWarnings = [];
            // console.log(data[0].dataValues)
             for (let i = 0; i < data.length; i++) {
               let num = i;
               let warningsObj;
               try {
                 let tellwhich = data[i].dataValues.warning.split(' ');
                 if (tellwhich[0] === 'Temperature') {
                   warningsObj = {
                     warning: `The ${data[i].dataValues.warning} °`,
                     time: data[i].dataValues.time,
                     num: num + 1
                   }
                   tempatureWarnings.push(warningsObj)
                 }
                 else if (tellwhich[0] === 'Humidity') {
                   warningsObj = {
                     warning: `The ${data[i].dataValues.warning} %`,
                     time: data[i].dataValues.time,
                     num: num + 1
                   }
                   humidityWarnings.push(warningsObj)
                 }
                 else if (tellwhich[0] === 'Node') {
                   warningsObj = {
                     warning: `The ${data[i].dataValues.warning}`,
                     time: data[i].dataValues.time,
                     num: num + 1
                   }
                   deviceWarnings.push(warningsObj)
                 }
               }
               catch (err) {
                 console.log(err)
               }
             }
             const dWarnings=deviceWarnings.slice(0, 5);
             const hWarnings=humidityWarnings.slice(0, 5);
             const tWarnings=tempatureWarnings.slice(0, 5);
            res.json({device:dWarnings,humidity:hWarnings,tempature:tWarnings})}
          )
          .catch(err => res.status(422).json(err));
      },
      removeWarning: function(req, res) {
    
        db.warnings.destroy({
         where:{
       userId:req.params.userid
         }
          })
          .then(dbModel => res.json(dbModel))
          .catch(err => res.status(422).json(err));
      },
};

export { controller as default };
