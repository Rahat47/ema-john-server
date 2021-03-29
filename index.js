import express from "express"
import mongodb from "mongodb";
import cors from "cors"
import dotenv from 'dotenv'

dotenv.config()
//Variables
const port = process.env.PORT
const dbUser = process.env.DB_USER
const dbName = process.env.DB_NAME
const dbPass = process.env.DB_PASSWORD
let productDB
let shipmentDB
const app = express()

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: false }))


//MongoDB


const MongoClient = mongodb.MongoClient;
const uri = `mongodb+srv://${dbUser}:${dbPass}@cluster0.77zrg.mongodb.net/${dbName}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    productDB = client.db(dbName).collection("products");
    shipmentDB = client.db(dbName).collection("shipments")
    console.log(`${dbName} database is connected`);
    app.listen(port, () => {
        console.log(`App Running at ${port}`)
    })
});


//! ROUTES
app.get("/", (req, res) => {
    res.send("Hello from Ema John Backend API.")
})

app.post("/add-product", async (req, res) => {
    const product = req.body
    try {
        const result = await productDB.insertOne(product)
        const data = result.ops[0]
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json(error)
    }
})


app.get("/products", async (req, res) => {
    try {
        const results = await productDB.find().limit(20).toArray()
        res.status(200).json(results)
    } catch (error) {
        res.status(500).json(error)
    }
})

app.get("/product/:key", async (req, res) => {
    try {
        const result = await productDB.find({ key: req.params.key }).toArray()
        res.status(200).send(result[0])

    } catch (error) {
        res.status(500).send(error)
    }
})


app.post("/products-by-key", async (req, res) => {
    const productKeys = req.body

    try {
        const data = await productDB.find({ key: { $in: productKeys } }).toArray()
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json(error)
    }

})

app.post("/shipment", async (req, res) => {
    const shipmentData = req.body
    try {
        const response = await shipmentDB.insertOne(shipmentData)
        const data = response.ops[0]
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json(error)
    }
})

