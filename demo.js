const {MongoClient} = require('mongodb');


async function main() {
    const uri = "mongodb+srv://myDatabase:05Pm02UIuOyhuffX@cluster0.t7bkab6.mongodb.net/"

    const client = new MongoClient(uri);

    try {
        // Connect the client to the server
        await client.connect();
        console.log("Connected to MongoDB");

        // await deleteAllUsersWithAgeLessThan(client, 30);

        // await deleteUser(client, "John Doe");

        // await updateAllUsersToHaveHobby(client);

        // await upsertUser(client, "Manny Thomson", 25);

        // await updateUser(client, "John Doe", 30);

        // await findAllUserAndAge(client, {
        //     minimumAge: 27,
        //     maxAge: 31,
        //     maxResults: 5,
        //     nameCheck: "Frank Brown"
        // });

        // await findOneUser(client, "John Doe");

        // createUser(client, {
        //     name: "John Doe",
        //     age: 25,
        //     password: "password123"
        // });

        await createMultipleUsers(client, [
            {
                name: "Frank Brown",
                age: 30,
                password: "password456"
            },
            {
                name: "Blair White",
                age: 30,
                password: "password456"
            },
            {
                name: "Alice Smith",
                age: 29,
                password: "password789"
            }
        ]);

        // await listDatabases(client);


    }
    catch (err) {
        console.error("Error connecting to MongoDB:", err);
    } finally {
        // Close the connection
        await client.close();
        console.log("Connection closed");
    }
}

main().catch(console.error);

async function deleteAllUsersWithAgeLessThan(client, age) {
    const result = await client.db("test").collection("DoSomething").deleteMany({age: {$lt: age}});
    console.log(`${result.deletedCount} document(s) deleted`);
}

async function deleteUser(client, name) {
    const result = await client.db("test").collection("DoSomething").deleteOne({ name: name });
    if (result.deletedCount === 1) {
        console.log(`Successfully deleted one document with the name '${name}'`);
    } else {
        console.log(`No documents matched the name '${name}'`);
    }
}

async function updateAllUsersToHaveHobby(client){
    const result = await client.db("test").collection("DoSomething").updateMany(
        { hobby: { $exists: false } },
        { $set: { hobby: "not sure" } }
    );

    console.log(`${result.matchedCount} document(s) matched the query, updated ${result.modifiedCount} document(s)`);
    console.log(`${result.modifiedCount} document(s) updated with the new hobby 'not sure'`);
}

async function upsertUser(client, name, age) {
    const result = await client.db("test").collection("DoSomething").updateOne(
        { name: name },
        { $set: { age: age } },
        { upsert: true }
    );

    console.log(`${result.matchedCount} document(s) matched the query, updated ${result.modifiedCount} document(s)`);
    if (result.upsertedCount > 0) {
        console.log(`A new user was inserted with the id: ${result.upsertedId}`);
    } else {
        console.log(`No new user was inserted`);
    }
    }

async function updateUser(client, name, newAge) {
    const result = await client.db("test").collection("DoSomething").updateOne(
        { name: name },
        { $set: { age: newAge } }
    );

    console.log(`${result.matchedCount} document(s) matched the query, updated ${result.modifiedCount} document(s)`);
    console.log(`${result.modifiedCount} document(s) updated with the new age '${newAge}'`);
}
async function findOneUser(client, name) {
    const result = await client.db("test").collection("DoSomething").findOne({ name: name });
    if (result) {
        console.log(`Found a user in the collection with the name '${name}':`);
        console.log(result);
    } else {
        console.log(`No user found with the name '${name}'`);
    }
}

async function findAllUserAndAge(client, { 
    minimumAge = 27,
    maxAge = 30,
    maxResults = 5,
    nameCheck = "John Doe"
    } = {}) {
    const cursor = await client.db("test").collection("DoSomething").find({ 
        age: { $gt: minimumAge, $lt: maxAge },
        name: nameCheck
    }).sort({ _id: -1 })
        .limit(maxResults);

    const result = await cursor.toArray();
    if (result.length > 0) {
        console.log(`Found ${result.length} users in the collection with the name '${nameCheck}' and age between '${minimumAge}' and '${maxAge}':`);
        result.forEach(user => {
            console.log(user);
        });
    } else {
        console.log(`No user found with the name '${nameCheck}' and age between '${minimumAge}' and '${maxAge}'`);
    }

}

async function createUser(client, newUser) {

    const result = await client.db("test").collection("DoSomething").insertOne(newUser);
    console.log(`New user created with the following id: ${result.insertedId}`);
}

async function createMultipleUsers(client, newUsers) {
    const result = await client.db("test").collection("DoSomething").insertMany(newUsers);

    console.log(`${result.insertedCount} new users created with the following ids:`);
    console.log(result.insertedIds);
}

async function listDatabases(client) {
    const databasesList = await client.db().admin().listDatabases();

    console.log("Databases:");
    databasesList.databases.forEach(db => {
        console.log(` - ${db.name}`);
    });
}

