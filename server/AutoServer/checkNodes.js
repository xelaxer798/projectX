
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

      console.log(num + i)
      let ThenodeData = await db.nodes.findOne({

        where: {
          userId: users[i].dataValues.id
        },
        order: [['createdAt', 'DESC']]
      })

      myCache.get(users[i].dataValues.id, async (err, value) => {
        
        theTime = functions.getFormateTime(ThenodeData.dataValues.createdAt);

        if (!err) {
          console.log(err,'error on line 48');
          if (value == undefined) {
            console.log(`${value} is undifiend`);
          } else {
            // console.log(ThenodeData.dataValues.currentTime, `this is # ${testing}`)
            // console.log(users[i].dataValues.id,'nijdlsldklda')
            // console.log(value.time, 'kkkklol line 64');
            // console.log(ThenodeData.dataValues.currentTime, '')
            // console.log(ThenodeData.dataValues.currentTime === value.time, "")
            if (functions.getFormateTime(ThenodeData.dataValues.createdAt) === functions.getFormateTime(value.date)) {
              db.warnings.create({
                userId: users[i].dataValues.id,
                nodeId: ThenodeData.dataValues.nodeId,
                warning: `Node has not updated since ${functions.getFormateTime(value.date)}. Please check the node it may be offline`,
                time: `${functions.getFormateTime(theCurrentTime)}`
              })
              let ccEmail;
              if (users[i].dataValues.email !== 'growai798@gmail.com') {
                ccEmail = 'growai798@gmail.com';
              }
              let BccEmail
              if (users[i].dataValues.email === 'growai798@gmail.com') {
                BccEmail = 'lm@leafliftsystems.com';
              }

              const msg = {
                to: 'growai798@gmail.com',
               cc: BccEmail,
                bcc:ccEmail,
                from: 'LeafLiftSystems@donotreply.com',
                subject: 'Your Farm Has A Warning',
                text: 'Click me ',
                html: `${users[i].dataValues.firstName}. The Node has not updated since ${functions.getFormateTime(value.date)}. Please check the node it may be offline `,
              };
              sgMail.send(msg);


            } else {


            }
          }
        }
      });

      // console.log(`line 95. ${ThenodeData.dataValues.currentTime} ${testing}`)
      let obj = { date: theTime };

      myCache.set(users[i].dataValues.id, obj, function (err, success) {
        if (!err && success) {
          console.log(success, 'hyeyeyye');
          console.log(obj, "olpppp")
        }
      });


    }
  } catch (err) {
    console.log(err,'error line 106');

  }



}
export default checkNodes;
