const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.icnwzoy.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const servicecollection = client.db("photography").collection("services");
    const reviewcollection = client.db("photography").collection("reviews");
    const amountsection = client.db("photography").collection("amount");
    const studiocollection = client.db("photography").collection("studio");

    app.get("/services", async (req, res) => {
      const query = {};
      const limit = parseInt(req.query.limit) || 0;
      const cursor = await servicecollection.find(query).limit(limit).toArray();

      res.send(cursor);
    });

    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await servicecollection.findOne(query);
      res.send(service);
    });

    app.post("/reviews", async (req, res) => {
      const review = req.body;
      const result = await reviewcollection.insertOne(review);
      res.send(result);
    });

    app.get("/reviews", async (req, res) => {
      const query = {};
      const cursor = reviewcollection.find(query);
      const orders = await cursor.toArray();
      res.send(orders);
    });

    app.delete("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await reviewcollection.deleteOne(query);
      console.log(result);
      res.send(result);

      //   console.log("trying to delete", id);
    });
    app.get("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await reviewcollection.findOne(query);
      res.send(result);
    });

    app.put("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const user = req.body;
      const option = { upsert: true };
      const updateduser = {
        $set: {
          name: user.name,
          rating: user.rating,
          message: user.message,
        },
      };
      const result = await reviewcollection.updateOne(
        filter,
        updateduser,
        option
      );
      res.send(result);
    });

    app.get("/amount", async (req, res) => {
      const query = {};
      const cursor = amountsection.find(query);
      const service = await cursor.toArray();
      res.send(service);
    });

    app.get("/studio", async (req, res) => {
      const query = {};
      const cursor = studiocollection.find(query);
      const service = await cursor.toArray();
      res.send(service);
    });
  } catch {}
}
run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("genius server is running");
});
app.listen(port, () => {
  console.log(`genius car server running on ${port}`);
});
