import db from "../models";
import moment from 'moment';
import sgMail from '@sendgrid/mail';
import functions from '../Functions/index';
const sengrido = process.env.sendgrid
sgMail.setApiKey(sengrido);
// Defining methods for the booksController
const controller = {
  findAll: function (req, res) {
    const CurrentTime = moment().tz("America/Los_Angeles").format("hh a");
    // const endTime = moment().tz("America/Los_Angeles").format("hh:mm a");
    // // console.log('heyyyy',moment('2018-08-13T22:11:06.000Z').format('MMMM Do YYYY, h:mm:ss a'))
    // const split = CurrentTime.split(' ');
    // let change = false;
    // if (split[0].includes("0")) {

    //   change = split[0].split('');

    // }
    // let number;
    // let timeStart;
    // if (change != false) {

    //   number = Number(change[1]) - 1
    //   timeStart = `0${number}:00 ${split[1]} `
    // } else {
    //   number = Number(split[0]) - 1
    //   timeStart = `0${number}:00 ${split[1]} `
    // }


    // let start = timeStart;
    // let end = endTime;
    db.nodes.findAll({
      order: [['createdAt', 'DESC']],

      where: {
        userId: req.params.id
        // currentTime: {
        //     $between: [start, end]
        // }
      }
    })
      .then(jeff => {

        if (req.params.graph === 'temperature') {

          try {
            const testx = [];
            const testy = [];
            for (let i = 0; i < jeff.length; i++) {

            };
            for (let i = 0; i < jeff.length; i++) {
              testx.push(functions.convertTimeZonesNonGuess(jeff[i].createdAt));
              testy.push(JSON.parse(jeff[i].dataValues.temperature));
            };
            const x = testx;
            const y = testy;
            const data = [{
              x,
              y,
              type: 'scatter',
              mode: 'lines',
              marker: { color: 'red' },
              xaxes: ['12:00 am', '10:00 am', '12:00 pm', '3:00 pm', '8:00 pm', '11:59 pm']
            }];
            res.send(data );
          } catch (err) {
            console.log(err);
          }

        }
        else if (req.params.graph === 'humidity') {
          try {
            const humidityx = [];
            const humidityy = [];
            for (let i = 0; i < jeff.length; i++) {
              humidityx.push(functions.convertTimeZonesNonGuess(jeff[i].dataValues.createdAt));
              humidityy.push(JSON.parse(jeff[i].dataValues.humidity));
            };
            const x = humidityx;
            const y = humidityy;
            const data = [{
              x,
              y,
              type: 'scatter',
              mode: 'lines',
              marker: { color: 'red' },
              xaxes: ['12:00 am', '10:00 am', '12:00 pm', '3:00 pm', '8:00 pm', '11:59 pm']
            }];
            res.send(data);
          } catch (err) {
            console.log(err);
          };
        } 
        else if (req.params.graph === 'RGB') {
          try {
            const rXArray = [];
            const rYArray = [];
            const gXArray = [];
            const gYArray = [];
            const bXArray = [];
            const bYArray = [];
            for (let i = 0; i < jeff.length; i++) {
              rXArray.push(functions.convertTimeZonesNonGuess(jeff[i].dataValues.createdAt));
              rYArray.push(JSON.parse(jeff[i].dataValues.r));
              gXArray.push(functions.convertTimeZonesNonGuess(jeff[i].dataValues.createdAt));
              gYArray.push(JSON.parse(jeff[i].dataValues.g));
              bXArray.push(functions.convertTimeZonesNonGuess(jeff[i].dataValues.createdAt));
              bYArray.push(JSON.parse(jeff[i].dataValues.b));
            };
            const data = [{
              x:rXArray,
              y:rYArray,
              name:'R',
              type: 'scatter',
              mode: 'lines',
              marker: { color: 'red' },
             
            },
          {
            x:gXArray,
            y:gYArray,
            name:'G',
            type: 'scatter',
            mode: 'lines',
            marker: { color: 'green' },
          },
          {
            x:bXArray,
            y:bYArray,
            name:'B',
            type: 'scatter',
            mode: 'lines',
            marker: { color: 'blue' },
          }];
            res.send(data);
          } catch (err) {
            console.log(err);
          };
        }else if(req.params.graph ==='Lux,IR'){
          try {
            const luxX = [];
            const luxY = [];
            const irX=[];
            const irY=[];
            for (let i = 0; i < jeff.length; i++) {
              luxX.push(functions.convertTimeZonesNonGuess(jeff[i].dataValues.createdAt));
              luxY.push(JSON.parse(jeff[i].dataValues.lux));
              irX.push(functions.convertTimeZonesNonGuess(jeff[i].dataValues.createdAt));
              irY.push(JSON.parse(jeff[i].dataValues.ir));
            };
            const data = [{
              x:luxX,
              y:luxY,
              name:'Lux',
              type: 'scatter',
              mode: 'lines',
              marker: { color: 'blue' },
            },
            {
              x:irX,
              y:irY,
              name:'Infrared',
                yaxis: "y2",
              type: 'scatter',
              mode: 'lines',
              marker: { color: 'red' },
            }
          ];
            res.send(data);
          } catch (err) {
            console.log(err)
          };
        };
      })
      .catch(err => res.status(422).json(err));
  },
  findById: (req, res) => {
    // console.log(req.params)
    db.nodes.findAll({
      limit: 1,
      where: {
        userId: req.params.id
      },
      order: [['createdAt', 'DESC']]
    })
      .then(dbModel => {

        res.json(dbModel);
      }

      )

      .catch(err => res.status(422).json(err));
  },
  adminViewAllData: (req, res) => {
    // console.log(req.params)
    if (req.params.number === '1') {
      db.nodes.findAll({
        limit: 1,
        where: {
          userId: req.params.id
        },
        order: [['createdAt', 'DESC']]
      })
        .then(dbModel => {
          res.json(dbModel);
        }
        )
        .catch(err => res.status(422).json(err));
    }
    else if (req.params.number === 'many') {
      db.nodes.findAll({

        where: {
          userId: req.params.id
        },
        order: [['createdAt', 'DESC']]
      })
        .then(dbModel => {
          res.json(dbModel);
        }
        )
        .catch(err => res.status(422).json(err));
    }

  },

  findByDate: (req, res) => {
    // console.log(req.params)
    let start = '2018-08-12T21:00:46.000Z';
    let end = 'endTime';
    db.nodes.findAll({
      order: [['createdAt', 'DESC']],
      limit: 24,
      where: {
        userId: req.params.id,
        createdAt: {
          $between: [start, end]
        }
      }

    })
      .then(dbModel => {

        res.json(dbModel);
      }

      )

      .catch(err => res.status(422).json(err));
  },


  create: async function (req, res) {

    const CurrentTime =   moment().tz("America/Los_Angeles").format("hh:mm:ss a");
    const timeToFormat =   moment().tz("America/Los_Angeles").format();

    let user = await db.users.findOne({
      where: {
        id: req.body.userId
      }
    });

    console.log(user.dataValues);
    // console.log(time)
    // console.log({CurrentTime})
    db.nodes.create({
      nodeId: req.body.nodeId,
      userId: req.body.userId,
      nodeType: req.body.nodeType,
      temperature: req.body.temperature,
      humidity: req.body.humidity,
      r: req.body.r,
      g: req.body.g,
      b: req.body.b,
      lux: req.body.lux,
      full: req.body.full,
      visible: req.body.visible,
      ir: req.body.ir,
      roomId: req.body.roomId,
      currentTime: CurrentTime
    })
      .then(dbModel => {
       // console.log(dbModel.dataValues, "heyyyyyyyyyynhmn\bhjbj");
        let Tempature = null;
        let Humidity = null;
        let RGB = null;
     let emailToSend=user.dataValues.email;
        let ccEmail = '';
        let BccEmail = '';
        if (user.dataValues.email !== 'growai798@gmail.com') {
          BccEmail = 'growai798@gmail.com';
        }
        else if(user.dataValues.email === 'growai798@gmail.com'){
          emailToSend='lm@leafliftsystems.com';
          BccEmail = 'growai798@gmail.com';
        };
        
        if (dbModel.dataValues.temperature >= 110) {
          db.warnings.create({
            userId: req.body.userId,
            nodeId: req.body.nodeId,
            warning: `Temperature high ${req.body.temperature}`,
            time: `at ${functions.getFormateTime(timeToFormat)}`
          });
          Tempature = req.body.temperature;

        }
        else if (dbModel.dataValues.temperature <= 50) {
          db.warnings.create({
            userId: req.body.userId,
            nodeId: req.body.nodeId,
            warning: `Temperature was low ${req.body.temperature}`,
            time: `at ${functions.getFormateTime(timeToFormat)}`
          });
          Tempature = req.body.temperature;
        };
        if (dbModel.dataValues.humidity >= 85) {
          db.warnings.create({
            userId: req.body.userId,
            nodeId: req.body.nodeId,
            warning: `Humidity was high ${req.body.humidity}`,
            time: `at ${functions.getFormateTime(timeToFormat)}`
          });
          Humidity = req.body.Humidity;
        }
        else if (dbModel.dataValues.humidity <= 30) {
          db.warnings.create({
            userId: req.body.userId,
            nodeId: req.body.nodeId,
            warning: `Humidity was low ${req.body.humidity}`,
            time: `at ${functions.getFormateTime(timeToFormat)}`
          });
          Humidity = req.body.Humidity;
        }
        if (dbModel.dataValues.r === dbModel.dataValues.g && dbModel.dataValues.g === dbModel.dataValues.b && dbModel.dataValues.b === dbModel.dataValues.r && dbModel.dataValues.r >= 100) {
          db.warnings.create({
            userId: req.body.userId,
            nodeId: req.body.nodeId,
            warning: `Node is detecting the RGB was the same with a value of ${req.body.r}`,
            time: `at ${functions.getFormateTime(timeToFormat)}`
          });


          RGB = req.body.r;
        }
        let TempHighLow;
        let HumidityHighLow;
        if (req.body.temperature >= 110) {
          TempHighLow = 'spiked';
        }
        else if (req.body.temperature <= 60) {
          TempHighLow = 'dropped';
        }
        if (req.body.humidity >= 85) {
          HumidityHighLow = 'spiked';
        }
        else if (req.body.humidity <= 30) {
          HumidityHighLow = 'dropped';
        }
        if (Tempature !== null && Humidity !== null && RGB == null) {


          const msg = {
            to: emailToSend,
            cc: BccEmail,

            from: 'LeafLiftSystems@donotreply.com',
            subject: 'Your Farm Has A Warning',
            text: 'Click me ',
            html: `${user.dataValues.firstName} Your Farm had a couple warnings on ${functions.getFormateTime(timeToFormat)}. The Temperature ${TempHighLow}. The Temperature was ${req.body.temperature} °.
     Your farms humidity ${HumidityHighLow}. The Humidity was ${req.body.humidity} %.
     `,
          };

          sgMail.send(msg);
        }
        else if (Tempature != null && Humidity !== null && RGB !== null) {
          const msg = {
            to: emailToSend,
            cc: BccEmail,
            from: 'LeafLiftSystems@donotreply.com',
            subject: 'Your Farm Has A Warning',
            text: 'Click me ',
            html: `${user.dataValues.firstName} Your Farm had a couple warnings on ${functions.getFormateTime(timeToFormat)}. The Temperature ${TempHighLow}. The Temperature was ${req.body.temperature} °.
     Your farms humidity ${HumidityHighLow}. The Humidity was ${req.body.humidity} %. The RGB sensors are reporting the same value. This value is ${req.body.r}.
     `,
          };

          sgMail.send(msg);
        }
        else if (Tempature !== null && Humidity === null && RGB === null) {
          const msg = {
            to: emailToSend,

            cc: BccEmail,
            from: 'LeafLiftSystems@donotreply.com',
            subject: 'Your Farm Has A Warning',
            text: 'Click me ',
            html: `${user.dataValues.firstName} Your Farm had a warning on ${functions.getFormateTime(timeToFormat)}. The Temperature ${TempHighLow}. The Temperature was ${req.body.temperature} °.
     
     `,
          };

          sgMail.send(msg);
        }
        else if (Humidity !== null && Tempature === null && RGB === null) {
          const msg = {
            to: emailToSend,

            cc: BccEmail,
            from: 'LeafLiftSystems@donotreply.com',
            subject: 'Your Farm Has A Warning',
            text: 'Click me ',
            html: `${user.dataValues.firstName} Your Farm had a warning on ${functions.getFormateTime(timeToFormat)}. Your farms humidity ${HumidityHighLow}. The Humidity was ${req.body.humidity} %.
     `,
          };

          sgMail.send(msg);
        }
        else if (Humidity !== null && RGB !== null && Tempature == null) {
          const msg = {
            to: emailToSend,
            cc: BccEmail,

            from: 'LeafLiftSystems@donotreply.com',
            subject: 'Your Farm Has A Warning',
            text: 'Click me ',
            html: `${user.dataValues.firstName} Your Farm had a couple warnings  on ${functions.getFormateTime(timeToFormat)}. Your farms humidity ${HumidityHighLow}. The Humidity was ${req.body.humidity} %. The RGB sensors are reporting the same value. This value is ${req.body.r}.
     `,
          };

          sgMail.send(msg);
        }
        else if (Tempature !== null && RGB !== null && Humidity === null) {
          const msg = {
            to: emailToSend,

            cc: BccEmail,
            from: 'LeafLiftSystems@donotreply.com',
            subject: 'Your Farm Has A Warning',
            text: 'Click me ',
            html: `${user.dataValues.firstName} Your Farm had couple warnings on ${functions.getFormateTime(timeToFormat)}. The Temperature ${TempHighLow}. The Temperature was ${req.body.temperature} °. %. The RGB sensors are reporting the same value. This value is ${req.body.r}.`,
          };

          sgMail.send(msg);
        }
        else if (RGB !== null && Humidity === null && Tempature == null) {
          const msg = {
            to: emailToSend,

            cc: BccEmail,
   
            from: 'LeafLiftSystems@donotreply.com',
            subject: 'Your Farm Has A Warning',
            text: 'Click me ',
            html: `${user.dataValues.firstName} Your Farm had a warning on ${functions.getFormateTime(timeToFormat)}. The RGB sensors are reporting the same value. This value is ${dbModel.dataValues.r}.
     
     `,
          };

          sgMail.send(msg);
        };

        res.json(dbModel);
      })
      .catch(err => res.status(422).json(err));
  },
  update: function (req, res) {
    db.nodes.update({
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
  remove: function (req, res) {
    console.log(req.params.userid)
    db.nodes.destroy({
      where: {
        userId: req.params.userid
      }
    })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },

  removeOne: function (req, res) {
    console.log(req.params.id)
    db.nodes.destroy({
      where: {
        id: req.params.id
      }
    })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  }
};

export { controller as default };
