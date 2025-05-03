
// MongoDB connection
const {MongoClient} = require('mongodb');
const uri = "mongodb+srv://myDatabase:05Pm02UIuOyhuffX@cluster0.t7bkab6.mongodb.net/"
const client = new MongoClient(uri);

async function createUser(client, newUser) {

    const result = await client.db("test").collection("DoSomething").insertOne(newUser);
    console.log(`New user created with the following id: ${result.insertedId}`);
}