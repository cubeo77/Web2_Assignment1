const express = require('express');
const path = require('path');
const app = express();
const session = require('express-session');
const port = 8000;



// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 } // 1 min
}));

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Set public folder for static files
app.use(express.static('public'));

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

    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.clearCookie('connect.sid');
        console.log('Session destroyed successfully.');

        res.redirect('/');
    })
});

app.get('/members', (req, res) => {
    if (req.session.user) {
        res.render('members', { title: req.session.user });
    } else {
        res.redirect('/');
    }
});


app.post('/signin', (req, res) => {
    const { username, password } = req.body;

    if (username === 'admin' && password === 'password') {
        req.session.user = username;

        console.log(`User ${username} signed in successfully.`);

        res.redirect('/members');
    } else {

        console.log(`Failed sign in attempt for user ${username}.`);
        res.redirect('/');
    }
});



app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
