const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@genouscarmechanisc.imf7s.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// console.log(uri);

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = await client.db("carMechanic");
    const servicesCollection = await database.collection("services");

    //  POST Api
    app.post("/services", async (req, res) => {
      const service = req.body;
      console.log("hit the post api");
      const result = await servicesCollection.insertOne(service);
      //   console.log(result);
      res.send(result);
    });

    //   Delete Api
    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.deleteOne(query);
      res.json(result);
    });

    //   GET Api
    app.get("/services", async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    // GET Single Service
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.findOne(query);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running Genius Server");
});

app.get("/hello", (req, res) => {
  res.send("hello updated here");
});

app.listen(port, () => {
  console.log("Running genius server on port ", port);
});

/* 

once time:

1. heroku accounts open
2. install heroku software

Every projects

1. git init
2. .gitignore (node_modules, .env)
3. push everything to git
4. make sure you have this script : "start":" node index.js"
5. make sure put process.env.PORT in front of your port number
6. heroku loginfo 
7. heroku create (only one time for a projects)
8. command: heroku git push heroku 

-----------------

update:

1. save everything check locally
2. git add, git commit-m, git push
3. git push heroku main


*/
