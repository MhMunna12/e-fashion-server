const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const ObjectID = require('mongodb').ObjectID;
require('dotenv').config()

const port = 5560
const app = express()
app.use(cors());
app.use(bodyParser.json());



app.get('/', (req, res) => {
  res.send('Hello World! hhiii')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nwuix.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('connection err', err)
  const blogCollection = client.db("E-Fashion").collection("blogs");
  // const adminCollection = client.db("E-Fashion").collection("admin");

  app.get('/blogs',(req, res) =>{
    blogCollection.find()
    .toArray((err, items) =>{
      res.send(items);
    })
  })
  
  //add blog
  app.post('/addBlog', (req, res) => {
      const newBlog = req.body;
      console.log('add new blog: ', newBlog)
      blogCollection.insertOne(newBlog)
      .then(results =>{
          res.send(results.insertedCount > 0 )
      })
  })

  //blogDetails

  app.get('/blog/:id',(req, res) =>{
    const id = ObjectID(req.params.id)
    blogCollection.find({_id: id})
    .toArray((err, documents) =>{
      res.send(documents[0])
    })
  })

  //delete blog

  app.delete('/deleteBlog/:id', (req,res) =>{
    const id = ObjectID(req.params.id);
    blogCollection.deleteOne({_id: id})
    .then(result =>{
      res.send(result.deletedCount > 0)
    })
  })

  //admin
  // app.post('/isAdmin', (req,res) =>{
  //   const email = req.body.email;
  //   adminCollection.find({email: email})
  //     .toArray((err, admin) =>{
  //       res.send(admin.length > 0)
  //     })
  // })

});


app.listen(process.env.PORT || port)