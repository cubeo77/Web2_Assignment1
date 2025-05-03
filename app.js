const express = require('express');
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

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
