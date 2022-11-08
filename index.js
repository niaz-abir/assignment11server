const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();

app.use(cors());
app.use(express());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.icnwzoy.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const servicecollection = client.db("photography").collection("services");
    app.get("/services", async (req, res) => {
      const query = {};
      const limit = parseInt(req.query.limit) || 0;
      const cursor = await servicecollection.find(query).limit(limit).toArray();

      res.send(cursor);
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
