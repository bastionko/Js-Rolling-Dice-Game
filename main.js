let roundNumberBox = document.querySelector(".round-number");
const btnNew = document.querySelector('.btn--new');
let settingsConfirmButton = document.getElementById('modal-confirm');
maxRoundInput = document.getElementById('rounds-number');
let playerOneName = document.getElementById('first-player-name');
let playerTwoName = document.getElementById('second-player-name');

let dices = [
    null,
    "images/dice-1.png",
    "images/dice-2.png",
    "images/dice-3.png",
    "images/dice-4.png",
    "images/dice-5.png",
    "images/dice-6.png",
]

let playerOne = {
    id:1,
    name:"",
    score:0,
    throwDices:[],
    playerBox:document.querySelector(".player--0"),
    currentDice: document.querySelector(".dice"),
    throwDicesBox: document.querySelector(".rolled-player-one")
}
let playerTwo = {
    id:2,
    name: "",
    score:0,
    throwDices:[],
    playerBox:document.querySelector(".player--1"),
    currentDice: document.querySelector(".dice"),
    throwDicesBox: document.querySelector(".rolled-player-two")
}


let maxRound = 0;
let roundCounter = 1;
let players = [playerOne, playerTwo];
let currentPlayer = null;
let playersIndex = null;
let roundSpeed = 0;

document.querySelector('.dice').classList.add('hidden');

function reset() {
    playerOne.score = 0;
    playerTwo.score = 0;
    maxRound = 0;
    playerOne.throwDices = [];
    playerTwo.throwDices = [];
    document.getElementById(`score--${playerOne.id}`).textContent = 0;
    document.getElementById(`score--${playerTwo.id}`).textContent = 0;
    document.getElementById(`current--${playerOne.id}`).textContent = 0;
    document.getElementById(`current--${playerTwo.id}`).textContent = 0;
    roundCounter = 1;
    document.querySelector('.round-number').innerHTML=0;
}

function confirmStart(){
    reset();
    document.querySelector(`.winner-looser--1`).innerHTML = "";
    document.querySelector(`.winner-looser--2`).innerHTML="";
    document.getElementById('modal').classList.remove('active');
    document.getElementById('modal-overlay').classList.remove('active');
    maxRound = maxRoundInput.value;
    playerOne.name = playerOneName.value;
    playerTwo.name = playerTwoName.value;
    roundSpeed = document.getElementById('round-speed').value*1000;
    document.querySelector('.dice').classList.remove('hidden');
    document.querySelector('.rolled-player-one').classList.remove('hidden');
    document.querySelector('.rolled-player-two').classList.remove('hidden');
    document.querySelector('.rolled-player-one').innerHTML = "";
    document.querySelector('.rolled-player-two').innerHTML = "";

    if (!playerOneName.value=="" && !playerTwoName.value=="" && !Number(maxRoundInput.value)<1) {

        document.getElementById('name--1').innerHTML=playerOne.name;
        document.getElementById('name--2').innerHTML=playerTwo.name;
        startGame()

    } else{
        openModal();
        if (playerOneName.value==""){
        document.querySelector('.first-player-name-notice').innerHTML="This field is required!";
        document.querySelector('.second-player-name-notice').innerHTML="This field is required!";
        confirmStart();
        } else if (playerTwoName.value==""){
            document.querySelector('.first-player-name-notice').innerHTML="";
            document.querySelector('.second-player-name-notice').innerHTML="This field is required!";
            confirmStart();
        } else if (maxRoundInput.value=="" || Number(maxRoundInput.value)<1){
            document.querySelector('.first-player-name-notice').innerHTML="";
            document.querySelector('.second-player-name-notice').innerHTML="";
            document.querySelector('.maxround-notice').innerHTML="Cannot be empty or zero, must be 1 or greater!";
            confirmStart();
        }
    }
}

settingsConfirmButton.addEventListener('click', confirmStart);

btnNew.addEventListener('click', function () {
    openModal();
    closeModal();
    playerOneName.value = "";
    playerTwoName.value = "";
    maxRoundInput.value = "";
    document.querySelector('.maxround-notice').innerHTML="";
    roundSpeed = document.getElementById('round-speed');
    roundSpeed.value="";

});

function openModal(){
    document.getElementById('modal').classList.add('active');
    document.getElementById('modal-overlay').classList.add('active');

}

function closeModal(){
    let closeModalButton = document.querySelector('.modal-close');
    let closeModalOverlay = document.querySelector('#modal-overlay');
    closeModalButton.addEventListener('click', function () {
        closeModalButton.closest('#modal').classList.remove('active');
        closeModalOverlay.closest('#modal-overlay').classList.remove('active');
    });
}

function switchPlayer(){
    players.reverse();
    currentPlayer=players[playersIndex]
}

function displayWinner(){
    if (playerOne.score > playerTwo.score){

        document.querySelector(`.winner-looser--${playerOne.id}`).outerHTML= '<h3 class="winner-looser--1">Win</h3>';

        document.querySelector(`.winner-looser--${playerTwo.id}`).outerHTML= '<h3 class="winner-looser--2">Lost</h3>';
    } else if(playerOne.score < playerTwo.score){

        document.querySelector(`.winner-looser--${playerTwo.id}`).outerHTML= '<h3 class="winner-looser--2">Win</h3>';
        document.querySelector(`.winner-looser--${playerOne.id}`).outerHTML= '<h3 class="winner-looser--1">Lost</h3>';
    } else{
        document.querySelector(`.winner-looser--${playerOne.id}`).outerHTML= '<h3 class="winner-looser--1">Draw</h3>';
        document.querySelector(`.winner-looser--${playerTwo.id}`).outerHTML= '<h3 class="winner-looser--2">Draw</h3>';
    }
}

function renderThrowDices() {
    let textHtml = "";
    currentPlayer.throwDices.forEach(function(diceNumber){
        textHtml += `<img src="${dices[diceNumber]}" />`
    })
    currentPlayer.throwDicesBox.innerHTML = textHtml;
}

function renderRoundCounter() {
    roundNumberBox.innerHTML = roundCounter;
}

function saveThrow(currentDice) {
    document.getElementById(`current--${currentPlayer.id}`).innerHTML=currentDice;
    currentPlayer.score += currentDice;
    document.getElementById(`score--${currentPlayer.id}`).textContent =
        currentPlayer.score;
    currentPlayer.throwDices.push(currentDice);
    renderThrowDices()
    renderRoundCounter()
    if(playerOne.throwDices.length === playerTwo.throwDices.length){
        roundCounter++;
    }
    switchPlayer()
    if(playerOne.throwDices.length==maxRound && playerTwo.throwDices.length==maxRound){
        displayWinner()
    } else{
        rollDice()
    }
}

function rollDice() {

    if (currentPlayer.id === 1){
        document.querySelector(`.player--${playerOne.id}`).classList.add('player--active');
        document.querySelector(`.player--${playerTwo.id}`).classList.remove('player--active');
    } else if(currentPlayer.id === 2){
        document.querySelector(`.player--${playerTwo.id}`).classList.add('player--active');
        document.querySelector(`.player--${playerOne.id}`).classList.remove('player--active');
    }
    let currentDice = randomNum(1, 7);
    let interval = setInterval(function (){
        currentPlayer.currentDice.setAttribute("src",dices[randomNum(1, 7)]);
    }, 1000);
    setTimeout(function (){
        clearInterval(interval);
        currentPlayer.currentDice.setAttribute("src",dices[currentDice]);
        saveThrow(currentDice)
    }, roundSpeed)
}

function startGame() {
    playersIndex = randomNum(0, 2);
    currentPlayer = players[playersIndex];
    rollDice()
}

function randomNum(min, max){
    return Math.floor(Math.random() * (max - min) + min);
}