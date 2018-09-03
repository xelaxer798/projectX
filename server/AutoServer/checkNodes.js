
import moment from 'moment';
import db from '../models';
import sgMail from '@sendgrid/mail';
import NodeCache from "node-cache";
import functions from '../Functions/index';
const sengrido = process.env.sendgrid
sgMail.setApiKey(sengrido);

const myCache = new NodeCache();
 

const checkNodes = async (id) => {


  const theCurrentTime = moment().tz("America/Los_Angeles").format();


  let users = await db.users.findAll({

    where: {

    },
    order: [['createdAt', 'DESC']]
  })

  let num = 0;
  try {

    for (let i = 0; i < users.length; i++) {
      let theTime;
      let testing = num + i;

      console.log(num + i);
      let ThenodeData = await db.nodes.findOne({

        where: {
          userId: users[i].dataValues.id
        },
        order: [['createdAt', 'DESC']]
      });
// console.log(ThenodeData)
      myCache.get(users[i].dataValues.id, async (err, value) => {
        //functions.getFormateTime()
        theTime = ThenodeData.dataValues.createdAt;
console.log( theTime,"line 46")
        if (!err) {
          console.log(err,'error on line 48');
          if (value == undefined) {
            console.log(`${value} is undifiend`);
          } else {
            // 2018-09-03T17:49:01.000Z
            // 2018-09-03T17:49:01.000Z
            // console.log(ThenodeData.dataValues.currentTime, `this is # ${testing}`)
            // console.log(users[i].dataValues.id,'nijdlsldklda')
            // console.log(value.time, 'kkkklol line 64');
            // console.log(ThenodeData.dataValues.currentTime, '')
            //  console.log(JSON.stringify(ThenodeData.dataValues.createdAt)=== JSON.stringify(value.date), "line 59")
            //  console.log(typeof JSON.stringify(theTime),"line 46")
            //  console.log(value.date,"line 57")
            //  console.log(typeof value.date,"line 57")
            if (JSON.stringify(ThenodeData.dataValues.createdAt)=== JSON.stringify(value.date)) {
              db.warnings.create({
                userId: users[i].dataValues.id,
                nodeId: ThenodeData.dataValues.nodeId,
                warning: `Node has not updated since ${functions.getFormateTime(value.date,'checkNodes')}. Please check the node it may be offline`,
                time: `${functions.getFormateTime(theCurrentTime,'checkNodes')}`
              });
              let emailToSend=users[i].dataValues.email;
              let ccEmail;
              if (users[i].dataValues.email === 'growai798@gmail.com') {
                emailToSend = 'lm@leafliftsystems.com';
              };
              if (users[i].dataValues.email !== 'growai798@gmail.com') {
                ccEmail = 'growai798@gmail.com';
              };
              if(users[i].dataValues.email === 'alexanderjnordstrom@gmail.com '){
                emailToSend=null
              };
              const msg = {
                to: emailToSend,
               cc: ccEmail,
            
                from: 'LeafLiftSystems@donotreply.com',
                subject: 'Your Farm Has A Warning',
                text: 'Click me ',
                html: `${users[i].dataValues.firstName}. The Node has not updated since ${functions.getFormateTime(value.date,'checkNodes')}. Please check the node it may be offline `,
              };
              if(users[i].dataValues.email === 'alexanderjnordstrom@gmail.com '){
        
                //sgMail.send(msg);
              }
              else {
                sgMail.send(msg);
              }
             


            } else {
            };
          };
        };
      });

      // console.log(`line 95. ${ThenodeData.dataValues.currentTime} ${testing}`)
      let obj = { date: theTime };

      myCache.set(users[i].dataValues.id, obj, function (err, success) {
        if (!err && success) {
          console.log(success, 'line 96');
          console.log(obj, "line 97")
        }else if(err){
          console.log(err,'error line 100');
        }
      });


    };
  } catch (err) {
    console.log(err,'error line 106');

  };
};
export default checkNodes;
