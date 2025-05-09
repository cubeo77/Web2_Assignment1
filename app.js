require('dotenv').config();

const express = require('express');
const path = require('path');
const app = express();
const session = require('express-session');
const port = process.env.PORT || 8000;

// MongoDB connection
const MongoStore = require('connect-mongo');
const mongoUri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`;

const { MongoClient } = require('mongodb');

// Session store MongoClient (used by connect-mongo only, internally managed)
const sessionStore = MongoStore.create({
    mongoUrl: mongoUri,
    crypto: {
        secret: process.env.MONGODB_SESSION_SECRET
    }
});

// Application logic MongoClient (used by your routes)
const appClient = new MongoClient(mongoUri); // you manage connection manually



// Bcrypt for password hashing
const bcrypt = require('bcrypt');
const saltRounds = 12;

// Joi for validation
const Joi = require('joi');
const loginSchema = Joi.object({
    username: Joi.string().min(4).max(25).required(),
    password: Joi.string().min(6).max(25).required()
});


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.NODE_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
}));


// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Set public folder for static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static('public'));
app.use(express.static('public/images'));

(async () => {
    try {
        await appClient.connect();
        console.log("App MongoClient connected");

        // Start server only after DB connection
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    } catch (err) {
        console.error("MongoDB connection failed:", err);
        process.exit(1); // stop the app
    }
})();


// Routes
app.get('/', (req, res) => {



    if (req.session.user) {
        console.log(`User ${req.session.user} is already signed in.`);
        return res.redirect('/members');
    }
    console.log('User is not signed in, rendering index page.');

    res.render('index', { title: 'Welcome to my Site!' });
});

app.get('/form/signup', (req, res) => {
    res.render('partials/form-signUp');
});

app.get('/form/signin', (req, res) => {
    res.render('partials/form-signIn');
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.clearCookie('connect.sid');
        console.log('Session destroyed and cookie cleared.');
        res.redirect('/');
    });
});



app.get('/members', (req, res) => {
    if (req.session.user) {
        res.render('members', { title: req.session.user });
    } else {
        res.redirect('/');
    }
});

app.get('/invalid', (req, res) => {
    res.render('invalid');
}
);


app.post('/signin', async (req, res) => {

    const { error, value } = loginSchema.validate(req.body);

    if (error) {
        console.warn('Validation failed:', error.details);
        return res.status(400).send('Invalid input');
    }

    const { username, password } = value;

    if (username && password) {
        console.log(`Received sign in request for user ${username}`);
        try {
            const result = await appClient.db("Assignment1").collection("users").findOne({ username: username });

            if (result) {
                console.log(`User ${username} found in database.`);
                const match = await bcrypt.compare(password, result.password);

                if (match) {
                    console.log(`Password for user ${username} is correct.`);
                    req.session.user = username;
                    res.redirect('/members');
                } else {
                    console.log(`Incorrect password for user ${username}.`);

                    res.redirect('/invalid');
                }
            } else {
                console.log(`User ${username} not found in database.`);
                res.redirect('/invalid');
            }
        } catch (err) {
            console.error("Error connecting to MongoDB:", err);
        }
        finally {
            // Close the connection
            console.log("Connection closed");
        }
    } else {
    }


    // if (username === 'admin' && password === 'password') {
    //     req.session.user = username;

    //     console.log(`User ${username} signed in successfully.`);

    //     res.redirect('/members');
    // } else {

    //     console.log(`Failed sign in attempt for user ${username}.`);
    //     res.redirect('/');
    // }
});

app.post('/signup', async (req, res) => {
    const { username, password, email } = req.body;

    if (username && password && email) {
        try {
            console.log("Connected to MongoDB");

            hashedPassword = await bcrypt.hash(password, saltRounds);
            const newUser = {
                username: username,
                password: hashedPassword,
                email: email
            };

            const result = await appClient.db("Assignment1").collection("users").insertOne(newUser);
            console.log(`New user created with the following id: ${result.insertedId}`);

            req.session.user = username;
            res.redirect('/members');
        } catch (err) {
            console.error("Error creating user:", err);
            res.status(500).send('Internal Server Error');
        } finally {
        }
    } else {
        console.log('Username, password, or email not provided.');
        res.redirect('/');
    }
});


app.get("*dummy", (req, res) => {
    res.status(404);
    res.send("Page not found - 404");
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
