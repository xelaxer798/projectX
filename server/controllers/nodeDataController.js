import db from "../models";

// Defining methods for the booksController
const controller = {
  findAll: (req, res) => {
    db.nodes.findAll({
      limit: 1,
      where: {
        //your where conditions, or without them if you need ANY entry
      },
      order: [ [ 'createdAt', 'DESC' ]]
      })
      .then(dbModel => {
  
        res.json(dbModel)
      }
  
    )

      .catch(err => res.status(422).json(err));
  },
  findById: function(req, res) {
    db.nodes.findAll({
      order: [ [ 'createdAt', 'DESC' ]],
      limit:10
      })
      .then(jeff => {
        console.log('dbModel')
          res.send(jeff);
      
  
      })
      .catch(err => res.status(422).json(err));
  },
  
  create: function(req, res) {
    console.log(req.body)
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
      })
      .then(dbModel => res.json(dbModel))
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
