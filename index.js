const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;
const app = express();

app.use(cors())
app.use(express.json())



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
        // await client.connect(); 

        const toyCollection = client.db('ToyLand').collection('alltoys')

        app.get('/alltoys', async (req, res) => {
            const result = await toyCollection.find({}).toArray();
            res.send(result)
        })

        app.get('/alltoys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await toyCollection.findOne(query);
            res.send(result)
        })

        app.get('/toybycategory/:sub_category', async (req, res) => {
            const id = req.params.sub_category;
            const result = await toyCollection.find({sub_category: id}).toArray()
            res.send(result)
        })

        app.post('/alltoys', async (req, res) => {
            const addToy = req.body;
            const result = await toyCollection.insertOne(addToy);
            res.send(result)
        })

        app.get('/myToys', async (req, res) => {
            console.log('inside query', req.query.email);
            let query = {}
            if (req.query?.email) {
                query = { email: req.query.email }
            }
            const result = await toyCollection.find(query).toArray()
            res.send(result)
        })

        app.get('/myToys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await toyCollection.findOne(query)
            res.send(result)
        })

        // update
        app.put('/myToys/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const updatedToy = req.body;
            console.log(id, updatedToy);
            const newToy = {
                $set: {
                    toy_name: updatedToy.toy_name,
                    sub_category: updatedToy.sub_category,
                    price: updatedToy.price,
                    rating: updatedToy.rating,
                    available_quantity: updatedToy.available_quantity,
                    toy_img: updatedToy.toy_img,
                    seller_name: updatedToy.seller_name,
                    email: updatedToy.email,
                    description: updatedToy.description
                }
            }
            const result = await toyCollection.updateOne(filter, newToy, options);
            res.send(result)
        })

        app.delete('/myToys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await toyCollection.deleteOne(query)
            res.send(result)
        })

        // search 
        app.get('/alltoys', async (req, res) => {
            const sort = req.query.sort;
            const search = req.query.search;
            console.log(sort, search);
            const query = {title: { $regex: search, $options: 'i'}}
            const options = {
                sort: { 
                    "price": sort === 'asc' ? 1 : -1
                }
            };
            const cursor = toyCollection.find(query, options);
            const result = await cursor.toArray();
            res.send(result);
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

app.get('/', (req, res) => {
    res.send('Toy Land is running..........')
})

app.listen(port, () => {
    console.log(`Toy Server is running on port ${port}`);
})
