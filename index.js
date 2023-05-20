const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;
const app = express();


app.use(cors())
app.use(express.json())

app.get('/', (req, res) =>{
    res.send('Toy Land is running..........')
})



const uri = `mongodb+srv://${process.env.TOY_LAND_USERNAME}:${process.env.TOY_LAND_PASS}@cluster0.xtu99cu.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const toyCollection = client.db('ToyLand').collection('alltoys')

    app.get('/alltoys', async(req, res) =>{
        const result = await toyCollection.find().toArray();
        res.send(result)
    })

    app.get('/alltoys/:id', async(req, res) =>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await toyCollection.findOne(query);
        res.send(result)
    })

    app.post('/alltoys', async(req, res) =>{
        const addToy = req.body;
        const result = await toyCollection.insertOne(addToy);
        res.send(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, ()=>{
    console.log(`Toy Server is running on port ${port}`);
})
