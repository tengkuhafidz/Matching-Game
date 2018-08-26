/*
 * Create a list that holds all of your cards
 */
const uniqueCards = [
	'diamond',
	'paper-plane-o',
	'anchor',
	'leaf',
	'bicycle',
	'bomb',
	'cube',
	'bolt'
];

const deck = document.getElementById('deck');
const restart = document.getElementById('restart');
const timer = document.getElementById('timer');

const openedCardsId = [];
const lockedCardsId = [];
let hasStarted = false;
let moveCount = 0; 
let timerInSeconds = 0;
let timerInterval;
const THREE_STARS_MARK = 15;
const TWO_STARS_MARK = 25;
// const ONE_STAR_MARK = 35;
let ratings = 3;


renderCards();

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

function prepareCards() {
	const allCards = uniqueCards.concat(uniqueCards);
	return shuffle(allCards);
}

function renderCards() {
	const cards = prepareCards();

	for(let i = 0; i < cards.length; i++) {
		const cardElement = document.createElement('li');
		cardElement.className = 'card';
		cardElement.id = i;
		const cardSymbol = document.createElement('i');
		cardSymbol.className = 'fa fa-' + cards[i];
		cardSymbol.setAttribute('name', cards[i]);		
		cardElement.append(cardSymbol);
		deck.appendChild(cardElement);
	}
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

deck.addEventListener('click', function(evt) {
	if(evt.target.id && evt.target.id !== 'deck' && !openedCardsId.includes(evt.target.id)) {
		if(!hasStarted) renderTimer();

		if(openedCardsId.length < 2) {
			hasStarted = true;
			openCard(evt);
			addCardToOpenedCardsArr(evt);
			if (openedCardsId.length == 2) checkMatch(evt);
			renderMoveCounter();
			updateStars();
		}
	}
});

function openCard(evt) {
    evt.target.classList.add('open');
    evt.target.classList.add('show');
}

function addCardToOpenedCardsArr(evt) {
	openedCardsId.push(event.target.id);
	console.log('event.target.id', event.target.id)
}

// check if cards chosen matches and determine action
function checkMatch(evt) {
	moveCount++;
	const card1 = document.getElementById(openedCardsId[0]);
	const card2 = document.getElementById(openedCardsId[1]);

	if (card1.children[0].getAttribute("name") === card2.children[0].getAttribute("name")) {
		lockCards(card1, card2);
	} else {
		closeCards(card1, card2);
	}
	openedCardsId.length = 0;
}

// store completed cards
function lockCards(card1, card2) {
	lockedCardsId.push(openedCardsId[0]);
	lockedCardsId.push(openedCardsId[1]);
	card1.classList.add('match')
	card2.classList.add('match')
	if (lockedCardsId.length === uniqueCards.length * 2) hasCompleted();
}

// close wrongly matched cards
function closeCards(card1, card2) {
	setTimeout(function() {
		card1.classList.remove('open');
		card1.classList.remove('show');
		card2.classList.remove('open');
		card2.classList.remove('show');
	}, 500)	
}

// check if the game has completed
function hasCompleted() {
	//stop timer
	clearInterval(timerInterval);
	//completion modal
	swal({
	  title: "Good job!",
	  content: generateSwalRemarks(),	  
	  icon: "success",
	  button: "Restart!",
	}).then((value) => {
	  restartGame();
	});
}
restart.addEventListener('click', function(evt) {
	clearInterval(timerInterval);
	restartGame();
});

// generate star element for sweet alert 
function generateSwalRemarks() {
	const starDiv = document.createElement('div');

	// make filled stars (actual stars)
	for(let i = 0; i < ratings; i++) {
		const star = document.createElement('i');
		star.className = 'fa fa-star fa-lg';
		star.style.fontSize = '3em';
		starDiv.appendChild(star);
	}

	// make hollow stars
	for(let i = 0; i < 3 - ratings; i++) {
		const star = document.createElement('i');
		star.className = 'fa fa-star-o fa-lg';
		star.style.fontSize = '3em';
		starDiv.appendChild(star);
	}

	//textual remarks
	const remarks = "You completed the game with " + moveCount + " moves in " + timerInSeconds + " seconds.";
	const para = document.createElement('p');
	para.textContent = remarks;
	starDiv.appendChild(para);

	return starDiv;
}

function restartGame() {
	ratings = 3;
	hasStarted = false;
	timerInSeconds = 0;
	timer.innerHTML = 0;
	moveCount = 0;
	openedCardsId.length = 0;
	lockedCardsId.length = 0;
	rerenderCards();
	renderMoveCounter();
	resetStars();
}

function rerenderCards() {
	const cards = prepareCards();
	for(let i = 0; i < cards.length; i++) {		
		const cardElement = document.getElementById(i);
		cardElement.className = 'card';
		cardElement.children[0].className = 'fa fa-' + cards[i];
		cardElement.children[0].setAttribute('name', cards[i]);		
	}
}

function renderMoveCounter() {
	const moveCounter = document.getElementById('moves');
	moveCounter.innerHTML = moveCount;
}

function updateStars() {
	if (moveCount > THREE_STARS_MARK && moveCount <= TWO_STARS_MARK) {
		document.getElementById('star_three').className = 'fa fa-star-o';
		ratings = 2;
	} else if (moveCount > TWO_STARS_MARK) {
		document.getElementById('star_two').className = 'fa fa-star-o';
		ratings = 1;
	}
}

function resetStars() {
	document.getElementById('star_one').className = 'fa fa-star';
	document.getElementById('star_two').className = 'fa fa-star';
	document.getElementById('star_three').className = 'fa fa-star';
}

function renderTimer() {
    timerInterval = setInterval(function(){
        timerInSeconds++;
        var newTime = timerInSeconds;
        timer.innerHTML = newTime;
    }, 1000);
}








