

async function createUser(client, newUser) {

    const result = await client.db("test").collection("DoSomething").insertOne(newUser);
    console.log(`New user created with the following id: ${result.insertedId}`);
}