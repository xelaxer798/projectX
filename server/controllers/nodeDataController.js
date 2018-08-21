import db from "../models";
import moment from 'moment';
import sgMail from '@sendgrid/mail';

const sengrido =process.env.sendgrid 
sgMail.setApiKey(sengrido);
// Defining methods for the booksController
const controller = {
  findAll: (req, res) => {
  // console.log(req.params)
    db.nodes.findAll({
      limit: 1,
      where:{
        userId:req.params.id
              },
      order: [ [ 'createdAt', 'DESC' ]]
      })
      .then(dbModel => {
  
        res.json(dbModel);
      }
  
    )

      .catch(err => res.status(422).json(err));
  },
  findByDate: (req, res) => {
    // console.log(req.params)
    let start= '2018-08-12T21:00:46.000Z';
    let end='endTime';
      db.nodes.findAll({
        order: [ [ 'createdAt', 'DESC' ]],
        limit: 24,
        where:{
          userId:req.params.id,
          createdAt:{
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
     
  findById: function(req, res) {
    const CurrentTime = moment().tz("America/Los_Angeles").format("hh a");
    const endTime = moment().tz("America/Los_Angeles").format("hh:mm a");
  // console.log('heyyyy',moment('2018-08-13T22:11:06.000Z').format('MMMM Do YYYY, h:mm:ss a'))
  const split=  CurrentTime.split(' ');
  let change =false;
  if(split[0].includes("0")){
    // console.log({endTime},'hey')
    // console.log(split[1])
    // console.log(split[0])
    change=split[0].split('');
    // console.log(change[1])
  }
  let number;
  let timeStart;
  if(change != false){
 
    number =Number(change[1])-1
    timeStart=`0${number}:00 ${split[1]} `
  }else {
   number =Number(split[0])-1
   timeStart=`0${number}:00 ${split[1]} `
  }


    let start= timeStart;
    let end=endTime;
    db.nodes.findAll({
      order: [ [ 'createdAt', 'DESC' ]],
      // limit:24,
      
      where:{
userId:req.params.id
// currentTime: {
//     $between: [start, end]
  

// }
 


    
    }
      })
      .then(jeff => {
     
          res.send(jeff);
      
  
      })
      .catch(err => res.status(422).json(err));
  },
  
  create: async function(req, res) {
 
  const CurrentTime = moment().tz("America/Los_Angeles").format("hh:mm a");
 let user=await  db.users.findOne({
    where: {
      id: req.body.userId
    }
  })

  console.log(user.dataValues)
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
        currentTime:CurrentTime
      })
      .then(dbModel => {
    console.log(dbModel.dataValues,"heyyyyyyyyyynhmn\bhjbj")
    let Tempature=null;
    let Humidity=null;
    let RGB=null;
    let ccEmail=''
if(user.dataValues.email !=='growai798@gmail.com'){
ccEmail= 'growai798@gmail.com'
}
if(dbModel.dataValues.temperature>=110){
  db.warnings.create({
    userId:req.body.userId,
    nodeId: req.body.nodeId,
    warning:`Temperature high ${req.body.temperature}`,
    time:`at ${CurrentTime}`
  })
 Tempature=req.body.temperature

}
else if(dbModel.dataValues.temperature<=60){
  db.warnings.create({
    userId:req.body.userId,
    nodeId: req.body.nodeId,
    warning:`Temperature was low ${req.body.temperature}`,
    time:`at ${CurrentTime}`
  })
  Tempature=req.body.temperature
}
if(dbModel.dataValues.humidity>=85){
  db.warnings.create({
    userId:req.body.userId,
    nodeId: req.body.nodeId,
    warning:`Humidity was high ${req.body.humidity}`,
    time:`at ${CurrentTime}`
  })
  Humidity=req.body.Humidity
}
else if(dbModel.dataValues.humidity<=30){
  db.warnings.create({
    userId:req.body.userId,
    nodeId: req.body.nodeId,
    warning:`Humidity was low ${req.body.humidity}`,
    time:`at ${CurrentTime}`
  })
  Humidity=req.body.Humidity
}
if(dbModel.dataValues.r===dbModel.dataValues.g&&dbModel.dataValues.g===dbModel.dataValues.b&&dbModel.dataValues.b===dbModel.dataValues.r){
  db.warnings.create({
    userId:req.body.userId,
    nodeId: req.body.nodeId,
    warning:`Node is detecting the RGB was the same with a value of ${req.body.r}`,
    time:`at ${CurrentTime}`
  })
  

  RGB=req.body.r
}
let TempHighLow;
let HumidityHighLow;
if(req.body.temperature>=110){
  TempHighLow= 'spiked'
}
else if(req.body.temperature<=60){
  TempHighLow='dropped'
}
if(req.body.humidity>=85){
  HumidityHighLow='spiked'
}
else if(req.body.humidity<=30){
  HumidityHighLow='dropped'
}
if(Tempature !== null&&Humidity !== null){
 

  const msg = {
    to: user.dataValues.email,
    cc:ccEmail,
    from: 'LeafLiftSystems@donotreply.com',
    subject: 'Your Farm Has A Warning',
    text: 'Click me ',
     html: `${user.dataValues.firstName} Your Farm had a couple warnings at ${CurrentTime}. The Temperature ${TempHighLow}. The Temperature was ${req.body.temperature} °.
     Your farms humidity ${HumidityHighLow}. The Humidity was ${req.body.humidity} %.
     `,
  };
  
  sgMail.send(msg);
}
else if(Tempature !=null&&Humidity !== null &&RGB !== null){
  const msg = {
    to: user.dataValues.email,
    cc:ccEmail,
    from: 'LeafLiftSystems@donotreply.com',
    subject: 'Your Farm Has A Warning',
    text: 'Click me ',
     html: `${user.dataValues.firstName} Your Farm had a couple warnings at ${CurrentTime}. The Temperature ${TempHighLow}. The Temperature was ${req.body.temperature} °.
     Your farms humidity ${HumidityHighLow}. The Humidity was ${req.body.humidity} %. The RGB sensors are reporting the same value. This value is ${req.body.r}.
     `,
  };
  
  sgMail.send(msg);
}
else if( Tempature !== null&&Humidity === null){
  const msg = {
    to: user.dataValues.email,
    cc:ccEmail,
   
    from: 'LeafLiftSystems@donotreply.com',
    subject: 'Your Farm Has A Warning',
    text: 'Click me ',
     html: `${user.dataValues.firstName} Your Farm had a warnings at ${CurrentTime}. The Temperature ${TempHighLow}. The Temperature was ${req.body.temperature} °.
     
     `,
  };
  
  sgMail.send(msg);
} 
else if(Humidity !== null&&Tempature === null){
  const msg = {
    to: user.dataValues.email,
    cc:ccEmail,
    from: 'LeafLiftSystems@donotreply.com',
    subject: 'Your Farm Has A Warning',
    text: 'Click me ',
     html: `${user.dataValues.firstName} Your Farm had a warnings at ${CurrentTime}. Your farms humidity ${HumidityHighLow}. The Humidity was ${req.body.humidity} %.
     `,
  };
  
  sgMail.send(msg);
}
else if(Humidity !== null &&RGB !==null&&Tempature ==null){
  const msg = {
    to: user.dataValues.email,
    cc:ccEmail,
    from: 'LeafLiftSystems@donotreply.com',
    subject: 'Your Farm Has A Warning',
    text: 'Click me ',
     html: `${user.dataValues.firstName} Your Farm had a warnings at ${CurrentTime}. Your farms humidity ${HumidityHighLow}. The Humidity was ${req.body.humidity} %. The RGB sensors are reporting the same value. This value is ${req.body.r}.
     `,
  };
  
  sgMail.send(msg);
}
else if(Tempature !== null &&RGB !==null &&Humidity === null){
  const msg = {
    to: user.dataValues.email,
    cc:ccEmail,
    from: 'LeafLiftSystems@donotreply.com',
    subject: 'Your Farm Has A Warning',
    text: 'Click me ',
     html: `${user.dataValues.firstName} Your Farm had a warnings at ${CurrentTime}. The Temperature ${TempHighLow}. The Temperature was ${req.body.temperature} °. %. The RGB sensors are reporting the same value. This value is ${req.body.r}.`,
  };
  
  sgMail.send(msg);
}
else if(RGB !==null &&Humidity === null&&Tempature ==null){
  const msg = {
    to: user.dataValues.email,
    Bcc:ccEmail,
    cc:'lm@leafliftsystems.com',
    from: 'LeafLiftSystems@donotreply.com',
    subject: 'Your Farm Has A Warning',
    text: 'Click me ',
     html: `${user.dataValues.firstName} Your Farm had a warnings at ${CurrentTime}. The RGB sensors are reporting the same value. This value is ${dbModel.dataValues.r}.
     
     `,
  };
  
  sgMail.send(msg);
}

        res.json(dbModel)
      })
      .catch(err => res.status(422).json(err));
  },
  update: function(req, res) {
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
  remove: function(req, res) {
    console.log(req.params.userid)
    db.nodes.destroy({
     where:{
   userId:req.params.userid
     }
      })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },

  removeOne: function(req, res) {
    console.log(req.params.id)
    db.nodes.destroy({
     where:{
      id:req.params.id
     }
      })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  }
};

export { controller as default };
