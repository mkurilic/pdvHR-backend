import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import storage from './memory_storage.js';
import cors from 'cors';
import connect from './db.js';
import mongo from 'mongodb';
import auth from './auth';

const app = express(); // instanciranje aplikacije
const port = 3000; // port na kojem će web server slušati

app.use(cors());
app.use(express.json()); // automatski dekodiraj JSON poruke

app.get('/tajna', [auth.verify], async (req, res) => {
    // nakon što se izvrši auth.verify middleware, imamo dostupan req.jwt objekt
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



app.listen(port, () => console.log(`Slušam na portu ${port}!`));
