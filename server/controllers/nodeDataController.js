import db from "../models";
import moment from 'moment'
// Defining methods for the booksController
const controller = {
  findAll: (req, res) => {
  console.log(req.params)
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
  findById: function(req, res) {
   
    db.nodes.findAll({
      order: [ [ 'createdAt', 'DESC' ]],
      limit:18,
      where:{
userId:req.params.id
      }
      })
      .then(jeff => {
       
          res.send(jeff);
      
  
      })
      .catch(err => res.status(422).json(err));
  },
  warnings: function(req, res) {
    console.log(req.params)
    db.warnings.findAll({
      order: [ [ 'time', 'DESC' ]],
      limit:4,
      where:{

        userId: req.params.id
      
      }
      })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  create: function(req, res) {
 
  const CurrentTime = moment().tz("America/Los_Angeles").format("hh:mm:ss ");
  let time =moment()
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
        console.log(dbModel.dataValues)
       if(dbModel.dataValues.temperature>=120||dbModel.dataValues.temperature<=60){
if(dbModel.dataValues.temperature>=110){
  db.warnings.create({
    userId:req.body.userId,
    nodeId: req.body.nodeId,
    warning:`high ${req.body.temperature}`,
    time:CurrentTime
  })
  console.log('to high')
}else if(dbModel.dataValues.temperature<=60){
  db.warnings.create({
    userId:req.body.userId,
    nodeId: req.body.nodeId,
    warning:`low ${req.body.temperature}`,
    time:CurrentTime
  })
}
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
    db.nodes.destroy({
     where:{
   
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
