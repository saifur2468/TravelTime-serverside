const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.h6gmm7i.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        
        await client.connect();

        const db = client.db("travel");
        const spotsCollection = db.collection("countreyinforamtion");
        const postsCollection = db.collection("adddatapost-add");
        const visitedCollection = db.collection("visitedSpots");
        const favoriteCountryCollection = db.collection("favorite-country");

       
        app.get('/favorite-country', async (req, res) => {
            try {
                const result = await favoriteCountryCollection.find().toArray();
                res.send(result);
            } catch (error) {
                res.status(500).send({ message: "Error fetching data" });
            }
        });

       
        app.get('/favorite-country/:id', async (req, res) => {
            const id = req.params.id;
            if (!ObjectId.isValid(id)) {
                return res.status(400).send({ message: "Invalid ID format" });
            }
            const query = { _id: new ObjectId(id) };
            const result = await favoriteCountryCollection.findOne(query);
            res.send(result);
        });

        //  Top Rated Spot 
        app.get("/api/top-spots", async (req, res) => {
            const spots = await spotsCollection.find().sort({ rating: -1 }).limit(6).toArray();
            res.send(spots);
        });

        //  Create Post
        app.post("/tourist-spots", async (req, res) => {
            const result = await postsCollection.insertOne(req.body);
            res.send(result);
        });

        //  Show all Post data 
        app.get("/adddatapost-add/all", async (req, res) => {
            const posts = await postsCollection.find({}).toArray();
            res.send(posts);
        });

        //  Visited country routes
        app.post("/visited/add", async (req, res) => {
            res.send(await visitedCollection.insertOne(req.body));
        });

        app.get("/visited/:userId", async (req, res) => {
            const spots = await visitedCollection.find({ userId: req.params.userId }).toArray();
            res.send(spots);
        });

        app.delete("/visited/:id", async (req, res) => {
            res.send(await visitedCollection.deleteOne({ _id: new ObjectId(req.params.id) }));
        });

        
        await client.db("admin").command({ ping: 1 });
        console.log("MongoDB Connected Successfully!");

    } catch (error) {
        console.error("Connection Error:", error);
    }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Server running...");
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});