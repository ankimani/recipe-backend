const express= require('express');
const mongoose = require('mongoose');
const Recipe= require('./models/recipe');
const bodyParser= require('body-parser')
const app = express();

//middleware to connect to the db
mongoose.connect('mongodb+srv://albertnjane:k26YyjdFlSLpTkUR@cluster0-aplkd.mongodb.net/test?retryWrites=true&w=majority')
.then(()=>{
  console.log('Succesfully Connected to Mongo Db Atlas!');
})
.catch((error)=>{
  console.log('Unable to Connect to MongoDb Atlas!')
  console.error(error);
});

//adding headers to prevent CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

//endpoint to post recipes
app.use(bodyParser.json());
app.post('/api/recipes',(req, res, next)=>{
    const recipe= new Recipe({
        title: req.body.title,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions,
        difficulty: req.body.difficulty,
        time: req.body.time
      });
      recipe.save().then(()=>{
          res.status(201).json({
              message: "New Recipe Created successfully!"
          })
      }).catch((error)=>{
          res.status(400).json({
              error: error
          });
      });
});
// getting a single recipe
app.get('/api/recipes/:id',(req, res, next)=>{
    Recipe.findOne({_id : req.params.id})
    .then((recipe)=>{
        res.status(200).json(recipe)
    })
    .catch((error)=>{
        res.status(404).json({
            error: error
        });
    });
});

//endpoint to delete a recipe
app.delete('/api/recipes/:id',(req, res, next)=>{
    Recipe.deleteOne({
        _id: req.params.id
    })
    .then(()=>{
        res.status(200)
        .json({
            message: "Deleted Successfully"
        });
    })
    .catch((error)=>{
        res.status(400).json({
            error: error
        });
    });
});

//endpoint to update the endpoints
app.put('/api/recipes/:id',(req, res, next)=>{
    const recipe= new Recipe({
        _id: req.params.id,
        title: req.body.title,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions,
        difficulty: req.body.difficulty,
        time: req.body.time
    });
    Recipe.updateOne({_id: req.params.id},recipe).then(()=>{
        res.status(200).json({
            message: "Recipe Updated Successfully"
        });
    }).catch((error)=>{
        res.status(400).json({
            error: error
        });
    });
});
//endpoint to get all the recipes
app.use('/api/recipes',(req, res, next) => {
    Recipe.find().then((thing)=> {
        res.status(200).json(thing)
    }).catch((error)=> {
        res.status(400).json({
            error: error
        });
    });
});
module.exports = app;
