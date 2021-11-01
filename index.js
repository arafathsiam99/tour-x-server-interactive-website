const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const e = require("express");

const port = process.env.PORT || 8000;
const app = express();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hahq7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// console.log(uri);

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/", (req, res) => {
  res.send("Tour X server is running");
});

client.connect((err) => {
  const packageCollection = client.db("tourx").collection("packcages");
  const orderCollection = client.db("tourx").collection("orders");

  //   Add packages
  app.post("/addpackage", async (req, res) => {
    const packages = req.body;

    const result = await packageCollection.insertOne(packages);
    res.send(result);
  });
  // Add orders
  app.post("/placeorders", async (req, res) => {
    const orders = req.body;
    const result = await orderCollection.insertOne(orders);
    res.send(result);
    console.log(orders);
    console.log(result);
  });
  // Get packages
  app.get("/packages", async (req, res) => {
    const result = packageCollection.find({});
    const packages = await result.toArray();
    res.send(packages);
  });
  // Get Orders
  app.get("/allorders", async (req, res) => {
    const result = orderCollection.find({});
    const allOrders = await result.toArray();
    res.send(allOrders);
  });

  // Get Single Service
  app.get("/placebooking/:id", async (req, res) => {
    const id = req.params.id;
    console.log("getting specific package", id);
    const query = { _id: ObjectId(id) };
    const result = await packageCollection.findOne(query);
    res.send(result);
  });

  // Get my booking
  app.get("/booking/:id", async (req, res) => {
    const id = req.params.id;
    console.log("getting sp", id);
    const query = { email: id };
    console.log(query);
    const orders = orderCollection.find(query);
    const result = await orders.toArray();
    res.send(result);
    console.log(result);
  });

  // DELETE API
  app.delete("/deleteOrders/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await orderCollection.deleteOne(query);
    res.json(result);
    console.log(result);
  });
  // Manage All Package Api
  app.get("/allpackage", async (req, res) => {
    const result = orderCollection.find({});
    const order = await result.toArray();
    res.json(order);
  });
  // confirm package Api
  app.put("/confirmOrders/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const update = "Confirm";
    const result = await orderCollection.updateOne(query, {
      $set: {
        status: update,
      },
    });
    res.send(result);
    console.log(result);
  });
});

app.listen(port, () => {
  console.log("Running server on port", port);
});
