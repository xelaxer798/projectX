import db from "../models";
import bcrypt from 'bcrypt';
import jwt, { verify } from 'jsonwebtoken';
import sgMail from '@sendgrid/mail';
import NodeCache from "node-cache";
import moment from 'moment';
import functions from '../Functions'
const myCache = new NodeCache();
// import sengridoToken from '../../sendgrid'
const secret = process.env.jwt || '5454554545';
const sengrido = process.env.sendgrid
sgMail.setApiKey(sengrido);
const saltRounds = 10;
// Defining methods for the booksController


const controller = {
  findAll: (req, res) => {
    db.Users.findAll({
      where: {
        inactive: false
      }
    })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  findById: function (req, res) {
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
    jwt.verify(req.body.userToken, secret, function (err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {

        //if everything is good, save to request for use in other routes
        req.decoded = decoded;
        authenticateUser = decoded.currentUser.currentUser.userId
        return authenticateUser
        //console.log(decoded.currentUser.currentUser.userId)


      }
    });
    console.log(authenticateUser)
    db.Users.findOne({
      where: {
        id: authenticateUser
      }
    })
      .then(user => {
        const createdAt = functions.getDateIso(user.dataValues.createdAt);
       
       
        const userInfo = {
          id: user.dataValues.id,
          email: user.dataValues.email,
          firstName: user.dataValues.firstName,
          lastName: user.dataValues.lastName,
          profilePic: user.dataValues.profilePic,
          phoneNumber: user.dataValues.phoneNumber,
          address: user.dataValues.address,
          verified: user.dataValues.verified,
          createdAt: createdAt,
          inactive: user.dataValues.inactive,
          subscription:user.dataValues.subscription
       
        }
        res.json(userInfo)
      })
      .catch(err => res.status(422).json(err));
  },
  signIn: function (req, res) {


    // console.log(req.body)
    db.Users.findOne({
      where: {
        email: req.body.email
      }
    }).then(function (userSign) {
      // console.log(userSign)
      if (userSign == null) {
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
          const homeZipCode = splitAddy[4]
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
            verified: userSign.verified,

          }

          const token = jwt.sign({
            auth: currentUser.userId,
            agent: req.headers['user-agent'],
            currentUser: { currentUser },
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
  create: function (req, res) {

    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
      if (err) {
        console.log(err)
      }
      db.Users.findOne({
        where: {
          email: req.body.email
        }
      }).then(function (data) {
        if (data != null) {

          res.send('already')


        }
        else {
          db.Users.create({
            email: req.body.email,
            password: hash,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            address: req.body.address,
            phone: req.body.phone,
            subscription: req.body.subscription,
              farmId: "2389d496-d2ee-11e8-a8d5-f2801f1b9fd1"
          })
            .then(dbModel => {

              db.Users.findOne({
                where: {
                  email: req.body.email
                }
              }).then(newUser => {
                console.log(newUser.dataValues.id)
                const name = newUser.dataValues.firstName + ' ' + newUser.dataValues.lastName
                const msg = {
                  to: req.body.email,
                  from: 'LeafLiftSystems@donotreply.com',
                  subject: 'Reqister Your Email With Leaf Lift Systems ',
                  text: 'Click me ',
                  html: name + ` <br><h2>This is your User Id ${newUser.dataValues.id}. You will need this to set up the Arduinos for your farm. <br>   <a href='https://theprofessor.herokuapp.com/verification/${newUser.dataValues.id}' +'><strong> <button>Please Click This Link to Register Your Email</button></a></strong>`,
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

    db.Users.update({
      verified: true
    }, {
        where: {
          id: req.params.id,
          inactive: false
        }
      })
      .then(dbModel => {

        db.Users.findOne({
          where: {
            id: req.params.id
          }
        }).then(verify => {

          const name = verify.dataValues.firstName + ' ' + verify.dataValues.lastName

          res.send(name)
        })

      })
      .catch(err => res.status(422).json(err));
  },
  ResetPassword: function (req, res) {
    console.log(req.body)

    db.Users.findOne({

      where: {
        email: req.body.email

      }

    })
      .then(forgottenUser => {
        // console.log(forgottenUser)
        const token = jwt.sign({
          auth: forgottenUser.userId,
          agent: req.headers['user-agent'],
          currentUser: { forgottenUser },
          exp: Math.floor(Date.now() / 1000) + (60 * 60) // Note: in seconds!
        }, secret);

        const name = forgottenUser.dataValues.firstName + ' ' + forgottenUser.dataValues.lastName
        const msg = {
          to: req.body.email,
          cc: 'growai798@gmail.com',
          from: 'LeafLiftSystems@donotreply.com',
          subject: 'Leaf Lift Systems Account Recovery',
          text: 'click me ',
          html: name + ` <br> <a href='https://theprofessor.herokuapp.com/reset/${token}'><strong><button style="color:blue">Reset Password</button></a></strong><br>Note:This link will expire in one hour`,

        };

        sgMail.send(msg);
        res.send('sent')

      })
      .catch(err => res.status(422).json(err));
  },
  authResetPass: function (req, res) {
    const CurrentTime = moment().tz("America/Los_Angeles").format("hh a");
    let authenticateUser;

    jwt.verify(req.body.jwt, secret, function (err, decoded) {
      if (err) {
        return res.json({ AuthStatus: 'noAuth' });
      } else {
        req.decoded = decoded;
        authenticateUser = decoded.currentUser





        res.json({ AuthStatus: 'AuthOkay', userId: decoded.currentUser.forgottenUser.id, email: decoded.currentUser.forgottenUser.email, name: `${decoded.currentUser.forgottenUser.firstName} ${decoded.currentUser.forgottenUser.lastName}` })





        //if everything is good, save to request for use in other routes

        let obj = { Auth: authenticateUser, Time: CurrentTime };


        return authenticateUser
        //console.log(decoded.currentUser.currentUser.userId)


      }
    });

  },
  ChangePassword: async function (req, res) {
    console.log(req.body)
    await req.body.userid
    bcrypt.hash(req.body.password, saltRounds, async function (err, hash) {
      if (err) {


        console.log(err)
      }
      db.Users.update({

        password: hash
      }, {
          where: {
            id: req.body.userid,
            inactive: false
          }
        })



      const msg = {
        to: req.body.email,
        from: 'LeafLiftSystems@donotreply.com',
        subject: 'Leaf Lift Systems Account Recovery',
        text: 'click me ',
        html: req.body.name + ' Your password has been changed sucsessfully, if you did not change your password, please contact support! '

      };

      sgMail.send(msg);
      res.done()

    })
  },
  remove: function (req, res) {
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
