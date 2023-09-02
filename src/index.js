import express from 'express';
import cors from 'cors';
import connect from './db.js';
import mongo from 'mongodb';
import auth from './auth';

const app = express(); // instanciranje aplikacije
const port = process.env.PORT || 3000; // port na kojem će web server slušati

app.use(cors());

app.use(cors({
    origin: 'http://localhost:8080/',
  }));

app.use(express.json()); // automatski dekodiraj JSON poruke

app.get('/tajna', [auth.verify], async (req, res) => {
        res.status(200).send('tajna korisnika ' + req.jwt.username);
});


app.post('/auth', async (req, res) => {
    let user = req.body;
    let username = user.username;
    let password = user.password;

    try {
        let result = await auth.authenticateUser(username, password);
        res.status(201).json(result);
    } catch (e) {
        res.status(500).json({
            error: e.message,
        });
    }
});

app.post('/users', async (req, res) => {
    let user = req.body;

    try {
        let result = await auth.registerUser(user);
        res.status(201).send();
    } catch (e) {
        res.status(500).json({
            error: e.message,
        });
    }
});


app.get('/clients/username/:username', [auth.verify],  async (req, res) => {
    let username = req.params.username;
    let db = await connect()
    let cursor = await db.collection("clients").find({'username': username}).sort({'clientName' : 1});
    let results = await cursor.toArray()
    res.json(results)
})


app.post('/clients',  [auth.verify],  async (req, res) => {
    let data= req.body;
    delete data._id;
  
    let db = await connect();
    let result= await db.collection("clients").insertOne(data);   

    if(result && result.insertedCount == 1){
        res.json(result.ops[0]);
    }
    else {
        res.json({
            status: "fail",
        });
    }
})


app.get('/clients/:id', [auth.verify], async (req, res) => {
    let id = req.params.id;
    let db = await connect();
    let document = await db.collection('clients').findOne({ _id: mongo.ObjectId(id) });
    res.json(document);
});


app.get('/suppliers/:clientId', [auth.verify],  async (req, res) => {
    let clientId = req.params.clientId;
    let db = await connect()
    let cursor = await db.collection("suppliers").find({'clientId': clientId}).sort({'supplierName' : 1});
    let results = await cursor.toArray()
    res.json(results)
})

app.post('/suppliers',  [auth.verify],  async (req, res) => {
    let data= req.body;
    delete data._id;
  
    let db = await connect();
    let result= await db.collection("suppliers").insertOne(data);   

    if(result && result.insertedCount == 1){
        res.json(result.ops[0]);
    }
    else {
        res.json({
            status: "fail",
        });
    }
})

app.get('/buyers/:clientId', [auth.verify],  async (req, res) => {
    let clientId = req.params.clientId;
    let db = await connect()
    let cursor = await db.collection("buyers").find({'clientId': clientId}).sort({'buyerName' : 1});
    let results = await cursor.toArray()
    res.json(results)
})

app.post('/buyers',  [auth.verify],  async (req, res) => {
    let data= req.body;
    delete data._id;
  
    let db = await connect();
    let result= await db.collection("buyers").insertOne(data);   

    if(result && result.insertedCount == 1){
        res.json(result.ops[0]);
    }
    else {
        res.json({
            status: "fail",
        });
    }
})

app.get('/ura/:clientId', [auth.verify],  async (req, res) => {
    let clientId = req.params.clientId;
    let db = await connect()
    let cursor = await db.collection("ura").find({'clientId': clientId}).sort({'rbr' : 1});
    let results = await cursor.toArray()
    res.json(results)
})

app.get('/ura/:clientId/:dateFrom/:dateTo', [auth.verify],  async (req, res) => {
    let clientId = req.params.clientId;
    let dateFrom = new Date(req.params.dateFrom);
    let dateTo = new Date(req.params.dateTo);
    let db = await connect()
    let cursor = await db.collection("ura").find(
        {'date': {
              $gte: dateFrom,
              $lte: dateTo,
            },
        'clientId': clientId}).sort({'rbr' : 1});
    let results = await cursor.toArray()
    res.json(results)
})

app.post('/ura',  [auth.verify],  async (req, res) => {
    let data= req.body;
    delete data._id;
    data.date = new Date(data.date);
    let db = await connect();
    let result= await db.collection("ura").insertOne(data);   

    if(result && result.insertedCount == 1){
        res.json(result.ops[0]);
    }
    else {
        res.json({
            status: "fail",
        });
    }
})

app.get('/ira/:clientId', [auth.verify],  async (req, res) => {
    let clientId = req.params.clientId;
    let db = await connect()
    let cursor = await db.collection("ira").find({'clientId': clientId}).sort({'rbr' : 1});
    let results = await cursor.toArray()
    res.json(results)
})

app.post('/ira',  [auth.verify],  async (req, res) => {
    let data= req.body;
    delete data._id;
    data.date = new Date(data.date)
    let db = await connect();
    let result= await db.collection("ira").insertOne(data);   

    if(result && result.insertedCount == 1){
        res.json(result.ops[0]);
    }
    else {
        res.json({
            status: "fail",
        });
    }
})

app.get('/ira/:clientId/:dateFrom/:dateTo', [auth.verify],  async (req, res) => {
    let clientId = req.params.clientId;
    let dateFrom = new Date(req.params.dateFrom);
    let dateTo = new Date(req.params.dateTo);
    let db = await connect()
    let cursor = await db.collection("ira").find(
        {'date': {
              $gte: dateFrom,
              $lte: dateTo,
            },
        'clientId': clientId}).sort({'rbr' : 1});
    let results = await cursor.toArray()
    res.json(results)
})


app.listen(port, () => console.log(`Slušam na portu ${port}!`));
