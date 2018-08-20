
import moment from 'moment';
import db from '../models';
import sgMail from '@sendgrid/mail';
import NodeCache from "node-cache";
const sengrido = process.env.sendgrid
sgMail.setApiKey(sengrido);

const myCache = new NodeCache();
function timeToDecimal(t) {

  const arr = t.split(':');
  const arr2 = arr[1].split(' ');
  const time = [arr[0], arr2[0]];

  const dec = parseInt((time[1] / 6) * 10, 10);

  return parseFloat(parseInt(arr[0], 10) + '.' + (dec < 10 ? '0' : '') + dec);
}
function timeToNumber(t) {
  // lastNodeEntry.split('.')
  const arr = t.split(':');

  const time = parseInt(arr[0], 10);
  return time;
}

const checkNodes = async (id) => {


  const theCurrentTime = moment().tz("America/Los_Angeles").format("hh:mm a");


  let users = await db.users.findAll({

    where: {

    },
    order: [['createdAt', 'DESC']]
  })

let num=0;

  for (let i = 0; i < users.length; i++) {
    console.log(num+i)
    let nodes = await db.nodes.findAll({
      limit: 1,
      where: {
        userId: users[i].dataValues.id
      },
      order: [['createdAt', 'DESC']]
    })
    try {
      myCache.get(users[i].dataValues.id, async function (err, value) {
        if (!err) {
          if (value == undefined) {

          } else {
            console.log(value.time, 'kkkklol');
            console.log(nodes[0].dataValues.currentTime, 'fuck;;;;')
            console.log(nodes[0].dataValues.currentTime===value.time,"die")
            if (nodes[0].dataValues.currentTime === value.time) {
              let warningss = await db.warnings.create({
                userId: users[i].dataValues.id,
                nodeId: nodes[0].dataValues.nodeId,
                warning: `Node has not updated since ${value.time}. Please check the node it may be offline`,
                time: `${theCurrentTime}`
              })
              let ccEmail;
              if (users[i].dataValues.email !== 'growai798@gmail.com') {
                ccEmail = 'growai798@gmail.com'
              }
              // |users[i].dataValues.email
              const msg = {
                to: 'growai798@gmail.com',

                from: 'LeafLiftSystems@donotreply.com',
                subject: 'Your Farm Has A Warning',
                text: 'Click me ',
                html: `${users[i].dataValues.firstName}.The Node has not updated since ${value.time}. Please check the node it may be offline `,
              };
              // sgMail.send(msg);
            }
          }
        }
      });
      try {

        let obj = { time: nodes[0].dataValues.currentTime };

        myCache.set(users[i].dataValues.id, obj, function (err, success) {
          if (!err && success) {
            console.log(success, 'hyeyeyye');
          }
        });

      } catch (err) {

      }


    } catch (err) {
      console.log(err, 'you mom')
    }


  }

}
export default checkNodes;