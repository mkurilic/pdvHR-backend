import mongo from 'mongodb';
import connect from './db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Kreiranje indeksa pri pokretanju aplikacije (ukoliko već ne postoji)
(async () => {
    let db = await connect();
    db.collection('users').createIndex({ username: 1 }, { unique: true });
    db.collection('clients').createIndex({oib: 1}, {unique: true})
    db.collection('suppliers').createIndex({clientId:1, oib:1, konto:1}, {unique:true})
    db.collection('buyers').createIndex({clientId:1, oib:1, konto:1}, {unique:true})
    db.collection('ura').createIndex({clientId:1, rbr:1}, {unique:true})
    db.collection('ira').createIndex({clientId:1, rbr:1}, {unique:true})

})();

export default {
    async registerUser(userData) {
        let db = await connect();

        let result;
        try {
            let doc = {
                username: userData.username,
                password: await bcrypt.hash(userData.password, 8),
                email: userData.email,
                name: userData.name,
            };

            result = await db.collection('users').insertOne(doc);
        } catch (e) {
            if (e.name == 'MongoError' && e.code == 11000) {
                    throw new Error('Username already exists');
            }
        }
        if (result && result.insertedCount == 1) {
            return result.insertedId;
        } else {
            throw new Error('Cannot register user');
        }
    },
    async authenticateUser(username, password) {
        let db = await connect();
        let user = await db.collection('users').findOne({ username: username });

        if (user && user.password && (await bcrypt.compare(password, user.password))) {
            delete user.password; // ne želimo u tokenu, token se sprema na klijentu
            let token = jwt.sign(user, process.env.JWT_SECRET, {
                algorithm: 'HS512',
                expiresIn: '1 week',
            });
            return {
                token,
                username: user.username,
            };
        } else {
            throw new Error('Cannot authenticate');
        }
    },
    // express.js middleware function
    verify(req, res, next) {
        if (req.headers['authorization']) {
            try {
                let authorization = req.headers['authorization'].split(' ');
                if (authorization[0] !== 'Bearer') {
                    return res.status(401).send(); // HTTP invalid requets
                } else {
                    let token = authorization[1];
                    req.jwt = jwt.verify(authorization[1], process.env.JWT_SECRET);
                    return next();
                }
            } catch (err) {
                return res.status(401).send(); // HTTP not-authorized
            }
        } else {
            return res.status(401).send(); // HTTP invalid request
        }
    },
};
