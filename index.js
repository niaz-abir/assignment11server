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
  } catch {}
}
run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("genius server is running");
});
app.listen(port, () => {
  console.log(`genius car server running on ${port}`);
});
