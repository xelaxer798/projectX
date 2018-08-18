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
  findAll: (req, res) => {
    db.nodeData.findAll({
        where: {
          inactive: false
        }
      })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  findById: function(req, res) {
    db.nodeData.findOne({
        where: {
          id: req.params.id,
          inactive: false
        }
      })
      .then(dbModel => {
        if (dbModel) {
          res.json(dbModel);
        } else {
          res.status(404).json({
            message: 'Id not found.'
          });
        }
      })
      .catch(err => res.status(422).json(err));
  },
  authUser: (req, res) => {
    // console.log(req.body)
    let authenticateUser;
     jwt.verify(req.body.userToken, secret, function(err, decoded) {      
     if (err) {
       return res.json({ success: false, message: 'Failed to authenticate token.' });    
     } else {

      //if everything is good, save to request for use in other routes
       req.decoded = decoded;    
      authenticateUser= decoded.currentUser.currentUser.userId  
        return authenticateUser
    //console.log(decoded.currentUser.currentUser.userId)
      
        
     }
   });
  console.log( authenticateUser)
    db.users.findOne({
      where: {
        id:authenticateUser
      }
    })
      .then(user => {
     
  const createdAt=getDbDate(user.dataValues.createdAt)
         
       const userInfo={
id:user.dataValues.id,
email:user.dataValues.email,
firstName:user.dataValues.firstName,
lastName:user.dataValues.lastName,
profilePic:user.dataValues.profilePic,
phoneNumber:user.dataValues.phoneNumber,
address:user.dataValues.address,
verified:user.dataValues.verified,
createdAt:createdAt,
active:user.dataValues.active
        }
        res.json(userInfo)
      })
      .catch(err => res.status(422).json(err));
  },
  signIn: function(req, res) {
    

    console.log(req.body)
    db.users.findOne({
      where: {
        email: req.body.email
      }
    }).then(function (userSign) {
      console.log(userSign)
      if(userSign == null){
        res.send('noUser')
      }
         //if the database enycrpted password and non enypyted email from the database 
       //match create a JWT token and send it to the front end for storage
      bcrypt.compare(req.body.password, userSign.dataValues.password).then(function (pass) {
        if (pass === true && req.body.email === userSign.email) {

         const splitAddy = userSign.dataValues.address.split(' ');
         const homeAdress = splitAddy[0] + ' ' + splitAddy[1];
         const homeCity = splitAddy[2];
         const homeState = splitAddy[3];
        const  homeZipCode = splitAddy[4]
         const fullName = userSign.dataValues.firstName + ' ' + userSign.dataValues.lastName;
          const currentUser = {
            userId: userSign.dataValues.id,
            email: userSign.dataValues.email,
            firstName: userSign.dataValues.firstName,
            lastName: userSign.dataValues.lastName,
            fullName: fullName,
            
            phoneNumber: userSign.dataValues.phone,
            address: homeAdress,
            city: homeCity,
            state: homeState,
            zipCode: homeZipCode,
            verified:userSign.verified,
            
          }
        
          const token = jwt.sign({
            auth: currentUser.userId,
            agent: req.headers['user-agent'],
            currentUser:{ currentUser },
            exp: Math.floor(new Date().getTime() / 1000) + 7 * 24 * 60 * 60, // Note: in seconds!
          }, secret);
          res.send(token)
         
         //if the database enycrpted password and non enypyted email from the database don't match
         //send the front end a string of noMatch telling the front end to prompt the user to retry 
        } else {
          res.send("noMatch");
        }
      });

    })
  },
  create: function(req, res) {
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
      if (err) {


        console.log(err)
      }
      db.users.findOne({
        where: {
          email: req.body.email
        }
      }).then(function (data) {
        if (data != null) {

          res.send('already')


        }
else{
 db.users.create({
    email: req.body.email,
    password: hash,
    firstName:req.body.firstName,
    lastName:req.body.lastName,
    address:req.body.address,
    phone:req.body.phone,
    subscription:req.body.subscription
  })
    .then(dbModel => {
 
      db.users.findOne({
        where: {
          email: req.body.email
        }
        }).then(newUser=>{
          console.log(newUser.dataValues.id)
          const name = newUser.dataValues.firstName + ' ' + newUser.dataValues.lastName
          const msg = {
            to: req.body.email,
            from: 'LeafLiftSystems@donotreply.com',
            subject: 'Reqister Your Email With Leaf Lift Systems ',
            text: 'Click me ',
             html: name +` <br><h2>This is your User Id ${newUser.dataValues.id}. You will need this to set up the Arduinos for your farm. <br>   <a href='+'https://theprofessor.herokuapp.com/verification/${newUser.dataValues.id}' +'><strong> <button>Please Click This Link to Register Your Email</button></a></strong>`,
          };
  
          sgMail.send(msg);
          res.send(newUser.dataValues.id)
        })

   })
     .catch(err => res.status(422).json(err));
    }
  })
    })

  },
  verification: function (req, res) {
   
        db.users.update({
          verified:true
        }, {
            where: {
              id: req.params.id,
              inactive: false
            }
          })
          .then(dbModel => {
           
            db.users.findOne({
              where:{
                id:req.params.id
              }
            }).then(verify=>{
             
           const name =verify.dataValues.firstName+ ' '+verify.dataValues.lastName
      
              res.send(name)
            })
    
          })
          .catch(err => res.status(422).json(err));
      },
  update: function(req, res) {
    db.nodeData.update({
        name: req.body.name,
        description: req.body.description
      }, {
        where: {
          id: req.params.id,
          inactive: false
        }
      })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  remove: function(req, res) {
    db.nodeData.update({
        inactive: true
      }, {
        where: {
          id: req.params.id
        }
      })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  }
};

export { controller as default };
