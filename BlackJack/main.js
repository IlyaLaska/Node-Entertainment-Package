//find a good solution that will show dealer's 2 cards if he is over 17 and does not draw more
// (either a parameter in a .show...() method or plain text in dealerGetsCards() seem awkward)
//look into cleaning up wholeGame() and replace it's Promise with a callback like in Durak.js
//move remaining cards check and deck.newDeck() method call from User.addCard() to deck.getCard()

//DONE//clean up playersGetCards()
//DONE//do not ask for players amount before the start of consecutive games ???
//DONE//keep the same deck between games
//ask dealer to get cards only if there are players without status

'use strict';
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let playersGetCards = function(i) {
    let maxI = players.length-1;
    let cont = false;
    let dealerNeeded = false;
    if(!players[i].status) {//if this player has no status
        rl.question(`Does ${players[i].name} want another card?`, (ans) => {
            if (ans === 'Y' || ans === 'y' || ans === 'Yes' || ans === 'yes') cont = true;
            if (cont) {//if player wants another card
                console.log(`You want another card, ${players[i].name}!`);
                console.log(`//----------------------------------//`);
                players[i].dealCard();
                if(players[i].score >= 21) {
                    cont = false;
                }
                if(players[i].score > 21) {
                    players[i].status = 'Bust!';
                    console.log(`I'm sorry ${players[i].name}, but alas You Bust!`);
                }
            }
            if (cont) {//if player can get another card should he wish to
                playersGetCards(i);
            } else {//if this player can no longer get new cards
                if (i < maxI) {//if there are still unasked players
                    return playersGetCards(i + 1);//next player gets asked
                }
                else {//if this is the last player
                    // dealersPromise.resolve(1);
                    players.forEach((value) => {
                       if(!value.status) dealerNeeded = true;
                    });
                    if(dealerNeeded) dealerGetsCards();
                    console.log(`//----------------------------------//`);
                    showScores();
                    console.log(`//----------------------------------//`);
                    return askForNewRound();
                }
            }

        });
    } else {//if this player has some status already
        if (i < maxI) {//if there are still unasked players
            return playersGetCards(i + 1);//next player gets asked
        }
        else {//if this was the last player
            players.forEach((value) => {
                if(!value.status) dealerNeeded = true;
            });
            if(dealerNeeded) dealerGetsCards();
            showScores();
            return askForNewRound();
        }
    }
};

let dealerGetsCards = function() {
    console.log(`//----------------------------------//`);
    dealer.showScore('show');
    dealer.showCards('show');
    while(dealer.score <= 17) {
        console.log(`//----------------------------------//`);
        console.log(`Dealer draws another card`);
        dealer.dealCard();
    }
    if(dealer.score > 21) {
        dealer.status = 'Bust!';
        console.log(`The Dealer Bust!`);
    }
};

let showScores = function() {
    for (let i = 0; i < players.length; i++) {
        if(!players[i].status) {
            if(players[i].score < dealer.score && !dealer.status) {
                players[i].status = 'Lose!';
                console.log(`I'm sorry, ${players[i].name}, but You Lose!`);
            } else if(players[i].score === dealer.score) {
                players[i].status = 'Draw!';
                console.log(`Well, ${players[i].name}, You and Dealer are in a Draw!`);
            } else {
                players[i].status = 'Win!';
                console.log(`Congratulations, ${players[i].name}, You Win!`);
            }
        } else if(players[i].status === 'BlackJack!' && dealer.status === 'BlackJack!') {
            players[i].status = 'Draw!';
            console.log(`Well, ${players[i].name}, You and Dealer are in a Draw!`);
        }
    }
    console.log(`//----------------------------------//`);
    console.log(`And so, the final scores are:`);
    for (let j = 0; j < players.length; j++) {
        players[j].showStatus();
    }
};

let askForNewRound = function() {
    rl.question(`Do you want to play another round?`, (ans) => {
        if (ans === 'Y' || ans === 'y' || ans === 'Yes' || ans === 'yes') {
            return wholeGame();
        } else {
            console.log(`Thanks for playing!`);
            return rl.close();
        }
    });
};

let User = class {
    constructor(isDealer, name) {
        this.isDealer = isDealer;
        this.name = name;
        this.cards = [];
        this.score = 0;
        this.firstCardScore = 0;
        this.status = '';
        playercount++;
    }
    _getCardValue(card) {
        if(+card.slice(0, 2)) {
            return +card.slice(0,2 );
        } else if(card.slice(0, 3) !== 'Ace') {
            return 10;
        } else {
            if(this.score <= 10) {
                return 11;
            } else {
                return 1;
            }
        }
    }

    showStatus() {
        console.log(`${this.name} has such status:`);
        console.log(this.status);
    }
    showCards(deobfuscator) {
        console.log(`${this.name} has such cards: `);
        if(this.isDealer && this.cards.length < 3 && !deobfuscator) {
            console.log(`${this.cards[0]}, ?`);
        } else {
            console.log(this.cards);
        }
    }
    showScore(deobfuscator) {
        console.log(`${this.name} has such score: `);
        if(this.isDealer && this.cards.length < 3 && !deobfuscator) {
            console.log(`${this.firstCardScore} + ?`);
        } else {
            console.log(this.score);
        }
    }
    addCard() {
        if(52 - deck.usedCards.size < players.length*2) {
            deck.newDeck();
            console.log('Deck was just replaced with a new one');
        }
        let card = deck.getCard();
        this.score += this._getCardValue(card);
        if(!this.cards[0]) this.firstCardScore = this.score;
        this.cards.push(card);
    }
    get2Cards() {
        for (let i = 0; i < 2; i++) this.addCard();
    }
    checkBlackJack() {
        if(this.score === 21) {
            this.status = 'BlackJack!';
            if (this.isDealer) {
                console.log(`Dealer has just got a BlackJack!`);
                for (let i = 0; i < players.length; i++) {
                    if (!players[i].status) players[i].status = 'Lose!';
                    console.log(`Unfortunately  ${players[i].name}, You Lose!`);
                }
                // players.splice
            } else {
                console.log(`Congratulations, ${this.name}, You have got a BlackJack!`);
            }
        }
    }
    startGame() {
        this.get2Cards();
        this.showScore();
        this.showCards();
        this.checkBlackJack();
    }
    dealCard() {
        this.addCard();
        this.showScore();
        this.showCards();
    }
};

let deck = {
    ranks: ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'],
    suits: ['of Hearts', 'of Diamonds', 'of Spades', 'of Clubs'],
    usedCards: new Set(),
    getCard() {
        let rank = Math.round(Math.random() * 12);
        let suit = Math.round(Math.random() * 3);
        let card = `${this.ranks[rank]} ${this.suits[suit]}`;
        if(this.usedCards.has(card)) {
            return this.getCard();
        } else {
            this.usedCards.add(card);
            return card;
        }
    },
    newDeck() {
        this.usedCards = new Set();
    }

};

// let continuePlay-ing = async function() {
//     let cont = 0;
//     let promise;
//     for (let i = 0; i < players.length; i++) {
//         await promise;
//         if(!players[i].status) do {
//             await promise;
//             promise = new Promise((resolve, reject) => {
//                 rl.question(`Does ${players[i].name} want another card?`, (ans) => {
//                     if(ans === 'Y' || ans === 'y' || ans === 'Yes' || ans === 'yes') cont = 1;
//                     console.log(`Answer: ${ans}, continue: ${cont}`);
//                     rl.close();
//                     resolve(cont);
//                 });
//             }).then(result => {
//                 if (cont) {
//                     console.log(`You want another card, ${players[i].name}!`);
//                     players[i].addCard();
//                     players[i].showScore();
//                     players[i].showCards();
//                     if(players[i].score > 21) {
//                         players[i].status = 'Bust!';
//                         console.log(`I'm sorry ${players[i].name}, but alas You Bust!`);
//                         cont = 0;
//                     }
//
//                 }
//                 console.log(`Continue value: ${cont}`);
//             });
//         } while (cont);
//     }
// };

let playercount = 0;
let dealer;// = new User(true, 'Dealer');
let players;// = [];
let humans;

let wholeGame = function() {
    //playercount = 0;
    dealer = new User(true, 'Dealer');
    players = [];

    new Promise((resolve, reject) => {
        if(playercount > 1) {//if this is not the first round to be played
            // console.log(deck.usedCards);
            humans = playercount - 2;//playercount is incremented on dealer creation, so on restart it is incremented again for  the same dealer
            playercount = 1;
            for (let i = 0; i < humans; i++) {
                players[i] = new User(false, `Player ${playercount}`);
            }
            resolve(playercount);
        } else {//if it is the first round
            rl.question(`How many players wish to play?`, ans => {
                console.log(`${ans} player(s) wish(es) to play`);
                if (!+ans) reject(`You had to enter a number!`);
                if (+ans > 25) reject(`How can ${ans} people play with 52 cards??? Did You think of that, genius?`);
                for (let i = 0; i < +ans; i++) {
                    players[i] = new User(false, `Player ${playercount}`);
                }
                resolve(ans);
            });
        }
    }).then(
        result => {
            for (let i = 0; i < players.length; i++) {
                console.log(`//----------------------------------//`);
                players[i].startGame();
            }
            console.log(`//----------------------------------//`);
            dealer.startGame();
            console.log(`//----------------------------------//`);
            let i = 0;
            playersGetCards(i);
            return result;
        },
        error => {
            console.log(`An error occurred: ${error}`);
            playercount = 0;
            return wholeGame();
        }
    )
};


wholeGame();