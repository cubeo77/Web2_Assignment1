const express = require('express');
const path = require('path');
const app = express();
const port = 8000;

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Set public folder for static files
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
    res.render('index', { title: 'Welcome to my Site!' });
});

app.get('/form/signup', (req, res) => {
    res.render('partials/form-signUp');
});

app.get('/form/signin', (req, res) => {
    res.render('partials/form-signIn');
});


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
