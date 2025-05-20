console.log("js file loaded");

//Game Data
let pokemonList = [];
let gameInProgress = false;
let gameBoard = "";
let powerUpUsed = false;
let seconds;

let gameState = {
    numOfGames: 0,
    numOfpairs: 0,
    matches: 0,
    attempts: 0,
    totalPairs: 0,
    win: false,
    pairsLeft: 0
};

async function newGame() {

    gameState.numOfGames++;
    await resetGame();

    gameInProgress = true;
    const selected = document.querySelector('input[name="difficulty"]:checked').value;
    console.log(selected);

    let numPokemon;
    let time;
    switch (selected) {
        case 'easy':
            numPokemon = 3;
            gameState.totalPairs = 3;
            gameState.numOfpairs = 3;
            time = 30;
            break;
        case "medium":
            numPokemon = 6;
            gameState.totalPairs = 6;
            gameState.numOfpairs = 6;
            time = 60;
            break;
        case "hard":
            numPokemon = 12;
            gameState.totalPairs = 12;
            gameState.numOfpairs = 12;
            time = 90;
            break;
        default:
            console.log("Not valid difficulty");
    }
    const gameGrid = document.getElementById("game_grid");
    gameGrid.innerHTML = "";
    gameGrid.className = "";

    switch (selected) {
        case 'easy':
            gameGrid.classList.add("grid-easy");
            break;
        case 'medium':
            gameGrid.classList.add("grid-medium");
            break;
        case 'hard':
            gameGrid.classList.add("grid-hard");
            break;
    }

    pokemonList = await getPokemon(numPokemon);
    document.getElementById("totalPairs").innerHTML = `Pairs Left: ${gameState.totalPairs}`;

    console.log(pokemonList);

    await buildGameHtml(pokemonList);

    setup();

    startGame(time);
}

function resetGame() {

    clearInterval(timer);

    console.log("Game Reset");

    pokemonList = [];
    powerUpUsed = false;
    gameState.matches = 0;
    gameState.attempts = 0;
    gameState.totalPairs = 0;
    gameState.win = false;
    document.getElementById("gameState").innerHTML = "";
    document.getElementById("attempts").innerHTML = `Attempts: 0`;
    document.getElementById("timer").innerHTML = `Timer: 0`;
    document.getElementById("matches").innerHTML = `Matches: 0`;
    document.getElementById("totalPairs").innerHTML = `Pairs Left: ${gameState.totalPairs}`;
    document.getElementById("numOfGames").innerHTML = `Games: ${gameState.numOfGames}`;
}

function startGame(time) {
    seconds = time;
    const timerEl = document.getElementById("timer");

    timer = setInterval(() => {
        seconds--;
        timerEl.textContent = `Time: ${seconds}`;

        if (seconds <= 0) {
            clearInterval(timer);
            alert("Time's up!");
            document.getElementById("gameState").innerHTML = "Out of time, You Lose!";
        } else if (gameState.matches === gameState.numOfpairs) {
            clearInterval(timer);
            document.getElementById("gameState").innerHTML = "You won!";
        }
    }, 1000);

}

async function buildGameHtml(pokemonList) {

    let gameBoard = "";
    let count = 0;
    let image = [pokemonList.length];
    let name = [pokemonList.length];
    let id = [pokemonList.length];
    pokemonList = shufflePokemon(pokemonList);
    pokemonList = shufflePokemon(pokemonList);

    for (const pokemon of pokemonList) {
        image[count] = pokemon.sprites.other['official-artwork'].front_default;
        name[count] = pokemon.name;
        id[count] = pokemon.id;
        gameBoard += `      
            <div class="card">
                <img src="${image[count]}" class="front_face" id="${id[count]}" alt="${name[count]}" />
                <img src="back.webp" class="back_face" alt="Card Front"/>
            </div>                
            `;
        count++;
    }
    document.getElementById("game_grid").insertAdjacentHTML("beforeend", gameBoard);

}

function shufflePokemon(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

async function getPokemon(numPokemon) {
    console.log("Getting Pokemon");

    const pokemonList = [];

    for (let i = 0; i < numPokemon; i++) {

        const catchEm = Math.floor(Math.random() * 1000);

        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${catchEm}`);
        const data = await res.json();
        pokemonList.push(data);
    }
    count = pokemonList.length;

    for (let i = 0; i < count; i++) {
        pokemonList.push(pokemonList[i]);
        console.log(pokemonList.length);
    }
    return pokemonList;
}



function setup() {
    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;

    $(".card").off("click").on("click", function () {
        if (lockBoard) return;
        if ($(this).hasClass("flip")) return;

        $(this).addClass("flip");

        if (!firstCard) {
            firstCard = $(this);
            return;
        }

        secondCard = $(this);
        lockBoard = true;

        const firstImg = firstCard.find(".front_face")[0].src;
        const secondImg = secondCard.find(".front_face")[0].src;

        if (firstImg === secondImg) {
            console.log("Match!");
            firstCard.off("click");
            secondCard.off("click");

            gameState.attempts++;
            gameState.matches++;
            gameState.totalPairs -= 1;
            document.getElementById("attempts").innerHTML = `Attempts: ${gameState.attempts}`;
            document.getElementById("totalPairs").innerHTML = `Pairs Left: ${gameState.totalPairs}`;
            document.getElementById("matches").innerHTML = `Matches: ${gameState.matches}`;

            console.log(`Matches: ${gameState.matches} / ${gameState.totalPairs}`);

            if (gameState.matches == gameState.numOfpairs) {
                console.log("You win!");
            }

            resetTurn();
        } else {
            console.log("No match.");
            gameState.attempts++;
            setTimeout(() => {
                firstCard.removeClass("flip");
                secondCard.removeClass("flip");
                resetTurn();
            }, 1000);
            document.getElementById("attempts").innerHTML = `Attempts: ${gameState.attempts}`;

        }

    });

    function resetTurn() {
        [firstCard, secondCard] = [null, null];
        lockBoard = false;
    }
}

function powerUp(){
    console.log("Power Up");
    if(!powerUpUsed){
        seconds += 5;
        powerUpUsed = true;
    }
}

document.getElementById("themeToggle").addEventListener("click", () => {
    document.getElementById("pageBody").classList.toggle("dark-theme-main");
    document.getElementById("list").classList.toggle("dark-theme");
    document.getElementById("title").classList.toggle("title");

});

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("gameForm").addEventListener("submit", function (e) {
        e.preventDefault();
        newGame();
    });
});