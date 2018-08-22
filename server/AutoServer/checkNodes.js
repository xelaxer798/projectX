
import moment from 'moment';
import db from '../models';
import sgMail from '@sendgrid/mail';
import NodeCache from "node-cache";
const sengrido = process.env.sendgrid
sgMail.setApiKey(sengrido);

const myCache = new NodeCache();
// function timeToDecimal(t) {

//   const arr = t.split(':');
//   const arr2 = arr[1].split(' ');
//   const time = [arr[0], arr2[0]];

//   const dec = parseInt((time[1] / 6) * 10, 10);

//   return parseFloat(parseInt(arr[0], 10) + '.' + (dec < 10 ? '0' : '') + dec);
// }
// function timeToNumber(t) {
//   // lastNodeEntry.split('.')
//   const arr = t.split(':');

//   const time = parseInt(arr[0], 10);
//   return time;
// }

const checkNodes = async (id) => {


  const theCurrentTime = moment().tz("America/Los_Angeles").format("hh:mm a");


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

        theTime = ThenodeData.dataValues.currentTime;

        if (!err) {
          console.log(err)
          if (value == undefined) {
            console.log(`${value} is undifiend`)
          } else {
            // console.log(ThenodeData.dataValues.currentTime, `this is # ${testing}`)
            // console.log(users[i].dataValues.id,'nijdlsldklda')
            // console.log(value.time, 'kkkklol line 64');
            // console.log(ThenodeData.dataValues.currentTime, 'fuck;;;;')
            // console.log(ThenodeData.dataValues.currentTime === value.time, "die")
            if (ThenodeData.dataValues.currentTime === value.time) {
              db.warnings.create({
                userId: users[i].dataValues.id,
                nodeId: ThenodeData.dataValues.nodeId,
                warning: `Node has not updated since ${value.time}. Please check the node it may be offline`,
                time: `${theCurrentTime}`
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
                ccEmail,
                BccEmail,
                from: 'LeafLiftSystems@donotreply.com',
                subject: 'Your Farm Has A Warning',
                text: 'Click me ',
                html: `${users[i].dataValues.firstName}.The Node has not updated since ${value.time}. Please check the node it may be offline `,
              };
              sgMail.send(msg);


            } else {


            }
          }
        }
      });

      // console.log(`line 95.-hey fucker0 ${ThenodeData.dataValues.currentTime} ${testing}`)
      let obj = { time: theTime };

      myCache.set(users[i].dataValues.id, obj, function (err, success) {
        if (!err && success) {
          console.log(success, 'hyeyeyye');
          console.log(obj, "olpppp")
        }
      });


    }
  } catch (err) {
    console.log(err)

  }



}
export default checkNodes;