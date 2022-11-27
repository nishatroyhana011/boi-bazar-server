const express = require('express');
const cors = require('cors');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.BD_PASSWORD}@cluster0.gipirp7.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try{
        const categoriesCollection = client.db("boibazar").collection("categories");
        const userCollection = client.db("boibazar").collection("users");
        const bookCollection = client.db("boibazar").collection("books");
        const bookingCollection = client.db("boibazar").collection("bookings");

        //create user
        app.post('/users', async(req, res)=>{
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result);
        });

        //create category
        app.post('/categories', async(req, res)=>{
            const cate = req.body;
            const result = await categoriesCollection.insertOne(cate);
            res.send(result);
        });

        //post a book
        app.post('/products', async(req, res)=>{
            const book = req.body;
            const result = await bookCollection.insertOne(book);
            res.send(result);
        });

        //get my products
        app.get('/mybooks', async(req, res)=>{
            const email = req.query.email;
            const query = {email:email}
            const result = await bookCollection.find(query).toArray();
            res.send(result)
        });

        //get categories
        app.get('/categories', async(req, res)=>{
            const query = {};
            const result = await categoriesCollection.find(query).toArray();
            res.send(result)
        });

        //get category by id
        app.get('/category/:id', async(req, res)=>{
            const id = req.params.id;
            
            const query = {category:id}
            const result = await bookCollection.find(query).toArray();
            res.send(result)
        });

        //post a booking
        app.post('/bookings', async(req, res)=>{
            const product = req.body;
            const result = await bookingCollection.insertOne(product);
            res.send(result);
        });

        //get my booked products
        app.get('/myorders', async(req, res)=>{
            const email = req.query.email;
            const query = {email:email}
            const result = await bookingCollection.find(query).toArray();
            res.send(result)
        });

        //create token
        app.get('/jwt',async (req, res)=>{
            const email = req.query.email;
            const query = {email:email}
            const user = await userCollection.findOne(query);
            if(user){
                const token = jwt.sign({email}, process.env.ACCESS_TOKEN, {expiresIn: '2h'}) ;
                return res.send({accessToken: token})
            }
            res.status(403).send({accessToken: ''})
        });

        //checking for Admin
        app.get('/users/admin/:email', async(req, res)=>{
            const email = req.params.email;
            const query = {email:email};
            const user = await userCollection.findOne(query);
            res.send({isAdmin: user?.role === 'Admin'});
        });

        //checking for seller
        app.get('/users/seller/:email', async(req, res)=>{
            const email = req.params.email;
            const query = {email:email};
            const user = await userCollection.findOne(query);
            res.send({isSeller: user?.role === 'Seller'});
        });

        //get user by email
        app.get('/users', async(req, res)=>{
            const email = req.query.email;
            const query = {email: email};
            const user = await userCollection.findOne(query);
            res.send(user)
        });

        app.delete('/book/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await bookCollection.deleteOne(query);
            res.send(result)
        });

        //get all sellers
        app.get('/allsellers', async(req, res)=>{
            const query = {};
            const seller = [];
            const users = await userCollection.find(query).toArray();
            users.forEach(user => {
                if(user.role==='Seller'){
                     seller.push(user);
                }
            })
            res.send(seller)
        });

        //get all buyers
        app.get('/allbuyers', async(req, res)=>{
            const query = {};
            const seller = [];
            const users = await userCollection.find(query).toArray();
            users.forEach(user => {
                if(user.role==='Buyer'){
                     seller.push(user);
                }
            })
            res.send(seller)
        });
       
        //seller delete
        app.delete('/seller/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await userCollection.deleteOne(query);
            res.send(result)
        });

        //buyer delete
        app.delete('/buyer/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await userCollection.deleteOne(query);
            res.send(result)
        });

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