
const express = require('express');

const app = express();
const port = process.env.PORT || 8000;

app.set('view engine', 'ejs');

const path = require('path');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// const {newGame} = require("./public/js/main");



function setup () {
  let firstCard = undefined
  let secondCard = undefined
  $(".card").on(("click"), function () {
    $(this).toggleClass("flip");

    if (!firstCard)
      firstCard = $(this).find(".front_face")[0]
    else {
      secondCard = $(this).find(".front_face")[0]
      console.log(firstCard, secondCard);
      if (
        firstCard.src
        ==
        secondCard.src
      ) {
        console.log("match")
        $(`#${firstCard.id}`).parent().off("click")
        $(`#${secondCard.id}`).parent().off("click")
      } else {
        console.log("no match")
        setTimeout(() => {
          $(`#${firstCard.id}`).parent().toggleClass("flip")
          $(`#${secondCard.id}`).parent().toggleClass("flip")
        }, 1000)
      }
    }
  });
}


// $(document).ready(setup)

app.get('/', (req, res) => {
    res.render('pages/index');
});

// app.post('/newGame', newGame, (req, res) => {
//     // res.render('pages/index');
// });

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});