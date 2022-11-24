const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.BD_PASSWORD}@cluster0.gipirp7.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try{
        const collection = client.db("boibazar").collection("categories");


    }finally{

    }
    
}
run()
.catch(err=> console.log(err))

app.get('/', (req, res) => {
    res.send('boi bazar is running')
});
  app.listen(port, () => {
    console.log('start')
});