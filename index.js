const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;
require('dotenv').config();
var cors = require('cors');

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q3bebek.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// ✅ Collections বাইরে declare করুন
const coffeesCollection = client.db("espressoDB").collection("coffees");
const usersCollection = client.db("espressoDB").collection("users");

// ✅ সব Route বাইরে — synchronously register হবে
app.get('/', (req, res) => {
    res.send("Espresso Emporium server is running");
});

app.get('/coffees', async (req, res) => {
    const result = await coffeesCollection.find().toArray();
    res.send(result);
});

app.get('/coffees/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await coffeesCollection.findOne(query);
    res.send(result);
});

app.post('/coffees', async (req, res) => {
    const newCoffee = req.body;
    const result = await coffeesCollection.insertOne(newCoffee);
    res.send(result);
});

app.put('/updateCoffee/:id', async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const updatedCoffee = req.body;
    const updateDoc = { $set: updatedCoffee };
    const result = await coffeesCollection.updateOne(filter, updateDoc);
    res.send(result);
});

app.delete('/coffees/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await coffeesCollection.deleteOne(query);
    res.send(result);
});

app.get('/users', async (req, res) => {
    const result = await usersCollection.find().toArray();
    res.send(result);
});

app.post("/users", async (req, res) => {
    const userProfile = req.body;
    const result = await usersCollection.insertOne(userProfile);
    res.send(result);
});

app.patch('/user', async (req, res) => {
    const { email, lastSignInTime } = req.body;
    const filter = { email: email };
    const updateDoc = { $set: { lastSignInTime: lastSignInTime } };
    const result = await usersCollection.updateOne(filter, updateDoc);
    res.send(result);
});

app.delete("/users/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await usersCollection.deleteOne(query);
    res.send(result);
});

app.listen(port, () => {
    console.log(`Espresso Emporium server is running on port ${port}`);
});

module.exports = app;