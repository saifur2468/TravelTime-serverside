// const express = require("express");
// const cors = require("cors");
// const app = express();
// require("dotenv").config();
// const port = process.env.PORT || 5000;
// const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// app.use(cors());
// app.use(express.json());

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.h6gmm7i.mongodb.net/?appName=Cluster0`;

// const client = new MongoClient(uri, {
//     serverApi: {
//         version: ServerApiVersion.v1,
//         strict: true,
//         deprecationErrors: true,
//     }
// });

// async function run() {
//     try {
        
//         await client.connect();

//         const db = client.db("travel");
//         const spotsCollection = db.collection("countreyinforamtion");
//         const postsCollection = db.collection("adddatapost-add");
//         const visitedCollection = db.collection("visitedSpots");
//         const favoriteCountryCollection = db.collection("favorite-country");

       
//         app.get('/favorite-country', async (req, res) => {
//             try {
//                 const result = await favoriteCountryCollection.find().toArray();
//                 res.send(result);
//             } catch (error) {
//                 res.status(500).send({ message: "Error fetching data" });
//             }
//         });

       
//         app.get('/favorite-country/:id', async (req, res) => {
//             const id = req.params.id;
//             if (!ObjectId.isValid(id)) {
//                 return res.status(400).send({ message: "Invalid ID format" });
//             }
//             const query = { _id: new ObjectId(id) };
//             const result = await favoriteCountryCollection.findOne(query);
//             res.send(result);
//         });

//         //  Top Rated Spot 
//         app.get("/api/top-spots", async (req, res) => {
//             const spots = await spotsCollection.find().sort({ rating: -1 }).limit(6).toArray();
//             res.send(spots);
//         });

//         //  Create Post
//         app.post("/tourist-spots", async (req, res) => {
//             const result = await postsCollection.insertOne(req.body);
//             res.send(result);
//         });

//         //  Show all Post data 
//         app.get("/adddatapost-add/all", async (req, res) => {
//             const posts = await postsCollection.find({}).toArray();
//             res.send(posts);
//         });

//         //  Visited country routes
//         app.post("/visited/add", async (req, res) => {
//             res.send(await visitedCollection.insertOne(req.body));
//         });

//         app.get("/visited/:userId", async (req, res) => {
//             const spots = await visitedCollection.find({ userId: req.params.userId }).toArray();
//             res.send(spots);
//         });

//         app.patch("/visited/:id", async (req, res) => {
//   const id = req.params.id;
//   const updatedData = req.body;

//   try {
//     const filter = { _id: new ObjectId(id) };

//     const updateDoc = {
//       $set: {
//         image: updatedData.image,
//         tourists_spot_name: updatedData.tourists_spot_name,
//         country_Name: updatedData.country_Name,
//         location: updatedData.location,
//         short_description: updatedData.short_description,
//         average_cost: updatedData.average_cost,
//         seasonality: updatedData.seasonality,
//         travel_time: updatedData.travel_time,
//         totalVisitorsPerYear: updatedData.totalVisitorsPerYear,
//         user_email: updatedData.user_email,
//         user_name: updatedData.user_name,
//       },
//     };

//     const result = await visitedCollection.updateOne(filter, updateDoc);

//     res.send(result);
//   } catch (error) {
//     res.status(500).send({ message: "Update failed", error });
//   }
// });
//         app.delete("/visited/:id", async (req, res) => {
//             res.send(await visitedCollection.deleteOne({ _id: new ObjectId(req.params.id) }));
//         });

        
//         await client.db("admin").command({ ping: 1 });
//         console.log("MongoDB Connected Successfully!");

//     } catch (error) {
//         console.error("Connection Error:", error);
//     }
// }
// run().catch(console.dir);

// app.get("/", (req, res) => {
//     res.send("Server running...");
// });

// app.listen(port, () => {
//     console.log(`Server running on port ${port}`);
// });






























// server.js
const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

app.use(cors());
app.use(express.json());

// MongoDB connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.h6gmm7i.mongodb.net/?appName=Cluster0`;
const client = new MongoClient(uri, {
    serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
});

async function run() {
    try {
        await client.connect();
        console.log("MongoDB Connected Successfully!");

        const db = client.db("travel");
        const spotsCollection = db.collection("countreyinforamtion"); // Spots data
        const postsCollection = db.collection("adddatapost-add");     // User Posts
        const visitedCollection = db.collection("visitedSpots");      // Visited spots
        const favoriteCountryCollection = db.collection("favorite-country"); // Favorites
        const visitRequestsCollection = db.collection("visitRequests");     // Request to visit

        // ========== FAVORITE COUNTRY ==========
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
            if (!ObjectId.isValid(id)) return res.status(400).send({ message: "Invalid ID format" });
            const query = { _id: new ObjectId(id) };
            const result = await favoriteCountryCollection.findOne(query);
            res.send(result);
        });

        // ========== TOP SPOTS ==========
        app.get("/api/top-spots", async (req, res) => {
            const spots = await spotsCollection.find().sort({ rating: -1 }).limit(6).toArray();
            res.send(spots);
        });

        // ========== USER POSTS ==========
        app.post("/tourist-spots", async (req, res) => {
            const result = await postsCollection.insertOne(req.body);
            res.send(result);
        });

        app.get("/adddatapost-add/all", async (req, res) => {
            const posts = await postsCollection.find({}).toArray();
            res.send(posts);
        });

        // ========== VISITED SPOTS ==========
        app.post("/visited/add", async (req, res) => {
            const result = await visitedCollection.insertOne(req.body);
            res.send(result);
        });

        app.get("/visited/:userId", async (req, res) => {
            const spots = await visitedCollection.find({ userId: req.params.userId }).toArray();
            res.send(spots);
        });

        app.patch("/visited/:id", async (req, res) => {
            const id = req.params.id;
            const updatedData = req.body;
            try {
                const filter = { _id: new ObjectId(id) };
                const updateDoc = { $set: updatedData };
                const result = await visitedCollection.updateOne(filter, updateDoc);
                res.send(result);
            } catch (error) {
                res.status(500).send({ message: "Update failed", error });
            }
        });

        app.delete("/visited/:id", async (req, res) => {
            const result = await visitedCollection.deleteOne({ _id: new ObjectId(req.params.id) });
            res.send(result);
        });

        // ========== REQUEST TO VISIT ==========
        // User Request
        app.post("/visit-request", async (req, res) => {
            try {
                const { userId, userName, userEmail, spotId, spotName, spotImage } = req.body;
                const exists = await visitRequestsCollection.findOne({ userId, spotId });
                if (exists) return res.status(400).send({ message: "Request already sent" });

                const result = await visitRequestsCollection.insertOne({
                    userId,
                    userName,
                    userEmail,
                    spotId,
                    spotName,
                    spotImage,
                    status: "Pending",
                    requestedAt: new Date()
                });
                res.send(result);
            } catch (error) {
                res.status(500).send({ message: "Error sending request", error });
            }
        });

        // Check request status (frontend)
        app.get("/visit-request/status", async (req, res) => {
            const { userId, spotId } = req.query;
            try {
                const request = await visitRequestsCollection.findOne({ userId, spotId });
                if (!request) return res.send({ status: "Not Requested" });
                res.send({ status: request.status });
            } catch (error) {
                res.status(500).send({ message: "Error checking status", error });
            }
        });

        // Admin get all requests
        app.get("/admin/visit-requests", async (req, res) => {
            try {
                const requests = await visitRequestsCollection.find().toArray();
                res.send(requests);
            } catch (error) {
                res.status(500).send({ message: "Error fetching requests", error });
            }
        });

        // Admin accept request
        app.patch("/admin/visit-request/:id", async (req, res) => {
            try {
                const id = req.params.id;
                const result = await visitRequestsCollection.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: { status: "Accepted" } }
                );
                res.send(result);
            } catch (error) {
                res.status(500).send({ message: "Error approving request", error });
            }
        });

        // Get all visit requests
app.get("/visit-request/all", async (req, res) => {
  try {
    const requests = await visitRequestsCollection.find().toArray();
    res.send(requests);
  } catch (err) {
    res.status(500).send({ message: "Failed to fetch requests" });
  }
});

// Admin Accept request
app.patch("/visit-request/:id/accept", async (req, res) => {
  const id = req.params.id;

  try {
    const result = await visitRequestsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: "Accepted", acceptedAt: new Date() } }
    );
    res.send(result);
  } catch (err) {
    res.status(500).send({ message: "Failed to update status" });
  }
});

        // Mongo ping
        await client.db("admin").command({ ping: 1 });

    } catch (error) {
        console.error("Connection Error:", error);
    }
}

run().catch(console.dir);

// Root Route
app.get("/", (req, res) => {
    res.send("Server running...");
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});