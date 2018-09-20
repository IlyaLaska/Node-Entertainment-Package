//DONE//decide on allowing several players and/or several bots
//DONE//fix infinite loop on empty deck
//DONE//check whether defender wants to take cards
//DONE//add letter support in checkBeatPossibility()
//DONE//add bot numbers and perhaps split playercount into playercount and botcount
//DONE//make it impossible to throw more cards than needed
//add win position to users and call last victor a loser
//clean up beatMove()
//maybe add questions in askForBots() and wholeGame() to a separate function
//add bot intellect and reprogram makeMove() and beatMove() to let bots play
//sort out that large cards object. It probably does not need used and one of unused sections

'use strict';

let playWithBots = true;

const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let drawLine = () => console.log(`//----------------------------------//`);

let sorter = function(a, b) {
    let pos = ['2', '3', '4', '5', '6', '7', '8', '9', '1', 'J', 'Q', 'K', 'A'];
    if(pos.indexOf(a.slice(0, 1)) < pos.indexOf(b.slice(0, 1))) {
        return -1;
    } else if(pos.indexOf(a.slice(0, 1)) > pos.indexOf(b.slice(0, 1))) {
        return 1;
    } else {
        return 0;
    }
};

let askForBots = function(players) {
    rl.question(`How many bots do You want to add to the game? (0-${Math.floor(deck.size/6)-players})`, (ans) => {
        console.log(`${ans} bot(s) will be added to the game`);
        if(typeof +ans === 'number') {//answer is a number
            if(+ans <= (Math.floor(deck.size/6)-players) && +ans >= 0 ) {//correct amount of players
                // console.log(`correct amount of bots`);
                return beginGame(players, +ans);
            } else {//incorrect amount of players
                console.log(`How can ${ans} bots and ${players} players play with ${deck.size} cards??? Did You think of that, genius?`);
                return askForBots(players);
            }
        } else {//answer is not a number
            console.log(`You had to enter a number!`);
            return askForBots(players);
        }
    })
};

let beginGame = function(people, computers) {
    for (let i = 0; i < people; i++) {
        players[i] = new User(false, `Player ${playercount + 1}`);
    }
    for (let i = 0; i < computers; i++) {
        bots[i] = new User(true, `Bot ${botcount + 1}`);
    }
    deck.prepareDeck();
    for (let i = 0; i < players.length; i++) {
        players[i].startGame();
        drawLine();
    }
    // drawLine();
    for (let i = 0; i < bots.length; i++) {
        bots[i].startGame();
        drawLine();
    }
    User.showTrumpCard();
    drawLine();
    //DEBUG LINE// deck.empty = true;///////////////////////////////////////////////////////////////////////////////////
    makeMove(0);
};

let playersGetCards = function() {
    // let maxI = players.length-1;
    // let cont = false;
    // let dealerNeeded = false;
    // if(!players[i].status) {//if this player has no status
    //     rl.question(`Does ${players[i].name} want another card?`, (ans) => {
    //         if (ans === 'Y' || ans === 'y' || ans === 'Yes' || ans === 'yes') cont = true;
    //         if (cont) {//if player wants another card
    //             console.log(`You want another card, ${players[i].name}!`);
    //             drawLine();
    //             players[i].dealCard();
    //             if(players[i].score >= 21) {
    //                 cont = false;
    //             }
    //             if(players[i].score > 21) {
    //                 players[i].status = 'Bust!';
    //                 console.log(`I'm sorry ${players[i].name}, but alas You Bust!`);
    //             }
    //         }
    //         if (cont) {//if player can get another card should he wish to
    //             playersGetCards(i);
    //         } else {//if this player can no longer get new cards
    //             if (i < maxI) {//if there are still unasked players
    //                 return playersGetCards(i + 1);//next player gets asked
    //             }
    //             else {//if this is the last player
    //                 // dealersPromise.resolve(1);
    //                 players.forEach((value) => {
    //                     if(!value.status) dealerNeeded = true;
    //                 });
    //                 if(dealerNeeded) dealerGetsCards();
    //                 drawLine();
    //                 showScores();
    //                 drawLine();
    //                 return askForNewRound();
    //             }
    //         }
    //
    //     });
    // } else {//if this player has some status already
    //     if (i < maxI) {//if there are still unasked players
    //         return playersGetCards(i + 1);//next player gets asked
    //     }
    //     else {//if this was the last player
    //         players.forEach((value) => {
    //             if(!value.status) dealerNeeded = true;
    //         });
    //         if(dealerNeeded) dealerGetsCards();
    //         showScores();
    //         return askForNewRound();
    //     }
    // }
    while(1) {//break on deck.empty
        for (let i = 0; i < players.length; i++) {
            if(!players[i].status) {
                console.log(`Make your move, ${players[i].name}`);
            }
        }
    }
};

let ansProcessor = function(cardsPos, player) {
    if(!cardsPos[0]) cardsPos.shift();
    if(!cardsPos[cardsPos.length-1]) cardsPos.pop();
    for (let j = 0; j < cardsPos.length; j++) {
        if(!+cardsPos[j] || cardsPos[j] < 1 || cardsPos[j] > player.cards.length) return 0;
    }
    cardsPos.sort((a, b) => a-b);
    // console.log(cardsPos);
    let cards = [];
    cardsPos.forEach((value) => {
        cards.push(player.cards[value-1]);
    });
    return cards;
};

let timeForEndGame = function() {
    let activePlayers = 0;
    for (let i = 0; i < players.length; i++) {
    if(!players[i].status) activePlayers++;
    }
    // for (let i = 0; i < bots.length; i++) {
    //     if(!bots[i].status) activePlayers++;
    // }
    if(activePlayers < 2) return true;
    return false;
};

let makeMove = function(offender) {
    if(timeForEndGame()) {
        showScores();
        return askForNewRound();
    }
    let maxOffender = players.length-1;
    if(offender > maxOffender) offender -= players.length;
    if(!players[offender].status) {
        console.log(`Make your move, ${players[offender].name}`);
        rl.question(`Which cards do you throw on the table, ${players[offender].name}? (1-${players[offender].cards.length})`, (ans) => {
            let cardsPos = ans.split(/[ ,.]+/);
            let moveCards = ansProcessor(cardsPos, players[offender]);
            if(!checkCompatibility(moveCards)) return makeMove(offender);
            for (let j = cardsPos.length-1; j >= 0; j--) {//removing move cards from offenders deck
                players[offender].cards.splice(cardsPos[j]-1, 1);
            }
            console.log(`${players[offender].name} throws ${moveCards} on the table`);
                return beatMove(offender, offender+1, moveCards);
        })
    } else {//this player cannot make a move
            return makeMove(offender + 1);
    }
};

let beatMove = function(offender, defender, moveCards) {
    // for (let i = 0; i < players.length; i++) {
    //     console.log(`${players[i].name} has such status: ${players[i].status}`);
    // }
    let maxDefender = players.length-1;
    if(defender > maxDefender) defender -= players.length;
    if(!players[defender].status) {//defender can defend
        rl.question(`What shall You beat with, ${players[defender].name}? (1-${players[defender].cards.length})\nType 'take' if you want to take these cards\n`, (ans) => {
            if(ans === 'take') {                                                  //defender decided to take
                console.log(`You decided to take all these cards, ${players[defender].name}`);
                moveCards.forEach((value) => {
                    players[defender].cards.push(value);
                });
                players[offender].showCards();
                players[defender].showCards();
                User.showTrumpCard();
                refillHand(players[offender]);
                /*if(defender < maxDefender)*/ return makeMove(defender+1);
                // else return makeMove(0);
            }
            let beatCardsPos = ans.split(/[ ,.]+/);
            let beatCards = ansProcessor(beatCardsPos, players[defender]);
            let cards = checkBeatPossibility(moveCards, beatCards);
            if(!cards) return beatMove(offender, defender, moveCards);
            // if(bea)//if you throw 2 to beat 3
            console.log(`${players[defender].name} throws ${beatCards} on the table`);
            if (cards.unused.move.length) {                                         //defender did not beat all cards
                cards.unused.move.forEach((value) => {
                    console.log(`You did not beat ${value}, ${players[defender].name}!`);
                });
                console.log(`That means You get to keep all the cards!`);
                refillHand(players[offender]);
                moveCards.forEach((value) => {
                    players[defender].cards.push(value);
                });
                players[offender].showCards();
                players[defender].showCards();
                User.showTrumpCard();
                makeMove(defender + 1);
            } else {                                                                //defender beat all cards
                for (let j = beatCardsPos.length-1; j >= 0; j--) {
                    players[defender].cards.splice(beatCardsPos[j]-1, 1);
                }
                // if (cards.unused.beat.length) {//if defender threw some unneeded cards
                //     cards.unused.beat.forEach((value) => {
                //         console.log(`You did not need ${value}, ${players[defender].name}!`);
                //         players[defender].cards.push(value);
                //     });
                // }
                refillHand(players[offender]);
                refillHand(players[defender]);
                players[offender].showCards();
                players[defender].showCards();
                User.showTrumpCard();
                return makeMove(defender);
            }
        })
    } else {
        // if(defender < maxDefender) {//some players can still defend
            return beatMove(offender, defender+1, moveCards);
        // } else {
        //     //dealer moves?? or player 1 defends
        // }
    }
};

let botLevel1 = function (moveCards, bot) {
    let nonTrumpCards;
    bot.cards.forEach((card) => {
        if(card.slice(-2) !== deck.trumpCard.slice(-2)) nonTrumpCards.push(card);
    });

};

let refillHand = function (player) {
    let addCardCount = 6 - player.cards.length;
    if(addCardCount > 0) {//offender used up some of his cards
        for (let i = 0; i < addCardCount; i++) {
            if(!deck.empty) player.addCard();
        }

    }
    if(!player.cards.length) {
        console.log(`You have won, ${player.name}!`);
        player.status = `Victor ${++victorcount}`;
        // if(victorcount === (players.length + bots.length)) player.status = `Loser!`;
    }
};

let checkCompatibility = function(cards) {
    if(!cards) return false;
    for (let i = 0; i < cards.length-1; i++) {//compare cards[i] and cards[i+1]
        if( !( cards[i].slice(0, 1) === cards[i+1].slice(0, 1) /*|| cards[i].slice(-2) === cards[i+1].slice(-2)*/ ) ) {
            console.log(`${cards[i]} and ${cards[i+1]} cannot be thrown on the table together!`);
            return false;
        }
    }
    return true;
};

let checkBeatPossibility = function(moveCards, beatCards) {
    if(!beatCards || moveCards.length !== beatCards.length) return false;
    console.log(moveCards);
    console.log(beatCards);
    let cards = {
        used: {
            move: [],
            beat: []
        },
        unused: {
            move: [],
            beat: []
        }
    };
    for (let i = 0; i < moveCards.length; i++) {
        for (let j = 0; j < beatCards.length; j++) {
            if( (moveCards[i].slice(-2) === beatCards[j].slice(-2) && sorter(moveCards[i], beatCards[j]) < 0)//normal cards//what about letters
                || beatCards[i].slice(-2) === deck.trumpCard.slice(-2) ) {//beatCard is a trump cards
                cards.used.move.push(moveCards[i]);
                cards.used.beat.push(beatCards[j]);
            }
        }
    }
    moveCards.forEach((value) => {
        if(!cards.used.move.includes(value)) {
            cards.unused.move.push(value);
        }
    });
    beatCards.forEach((value) => {
        if(!cards.used.beat.includes((value))) {
            cards.unused.beat.push(value);
        }
    });
    console.dir(cards);
    return cards;
};

let dealerGetsCards = function() {
    drawLine();
    dealer.showScore('show');
    dealer.showCards('show');
    while(dealer.score <= 17) {
        drawLine();
        console.log(`Dealer draws another card`);
        dealer.dealCard();
    }
    if(dealer.score > 21) {
        dealer.status = 'Bust!';
        console.log(`The Dealer Bust!`);
    }
};

let showScores = function() {
    // for (let i = 0; i < players.length; i++) {
    //     if(!players[i].status) {
    //         if(players[i].score < dealer.score && !dealer.status) {
    //             players[i].status = 'Lose!';
    //             console.log(`I'm sorry, ${players[i].name}, but You Lose!`);
    //         } else if(players[i].score === dealer.score) {
    //             players[i].status = 'Draw!';
    //             console.log(`Well, ${players[i].name}, You and Dealer are in a Draw!`);
    //         } else {
    //             players[i].status = 'Win!';
    //             console.log(`Congratulations, ${players[i].name}, You Win!`);
    //         }
    //     } else if(players[i].status === 'BlackJack!' && dealer.status === 'BlackJack!') {
    //         players[i].status = 'Draw!';
    //         console.log(`Well, ${players[i].name}, You and Dealer are in a Draw!`);
    //     }
    // }
    players.forEach((player) => {
        if(!player.status) player.status = 'Loser!';
    });
    drawLine();
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
    constructor(isBot, name) {
        this.isBot = isBot;
        this.name = name;
        this.cards = [];
        this.score = 0;
        this.status = '';
        if(isBot) botcount++;
        else playercount++;
    }
    static showTrumpCard() {
        drawLine();
        console.log(`The TRUMP CARD is ${deck.trumpCard}`);
        drawLine();
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

    sortCards() {
        this.cards.sort(sorter);
    }
    showStatus() {
        console.log(`${this.name} has such status:`);
        console.log(this.status);
    }
    showCards() {
        this.sortCards();
        console.log(`${this.name} has such cards: `);
        console.log(this.cards);
    }
    showScore() {
        console.log(`${this.name} has such score: `);
            console.log(this.score);
    }
    addCard() {
        if(deck.empty) {
            console.log(`The deck is empty!`);
            return false;
        }
        let card = deck.getCard();
        this.score += this._getCardValue(card);
        this.cards.push(card);
        // this.cards.sort();
    }
    add6Cards() {
        for (let i = 0; i < 6; i++) this.addCard();
    }
    startGame() {
        this.add6Cards();
        // this.sortCards();
        // this.showScore();
        this.showCards();
    }
    dealCard() {
        this.addCard();
        // this.sortCards();
        // this.showScore();
        this.showCards();
    }
};

let deck = {
    size: 36,
    ranks: ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'],
    suits: ['of Hearts', 'of Diamonds', 'of Spades', 'of Clubs'],
    usedCards: new Set(),
    trumpCard: '',
    empty: false,
    getCard() {
        if(this.usedCards.size === this.size) {
            console.log(`Deck has just run out of cards!`);
            let card = this.trumpCard;
            this.empty = true;
            // this.trumpCard = '';
            return card;
        }
        let rank = Math.round( Math.random() * (this.ranks.length-1) );
        let suit = Math.round( Math.random() * (this.suits.length-1) );
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
        this.trumpCard = '';
        this.empty = false;
    },
    selectTrumpCard() {
        this.trumpCard = this.getCard();
    },
    prepareDeck() {
        if(this.size === 36) {
            for (let i = 0; i < 4; i++) this.ranks.shift();
        }
        deck.selectTrumpCard();
    }
};

let playercount = 0;
let botcount = 0;
// let dealer;// = new User(true, 'Dealer');
let players;// = [];
let bots;
let victorcount;
// let humans;

let wholeGame = function() {
    //playercount = 0;
    // dealer = new User(true, 'Dealer');
    players = [];
    bots = [];
    victorcount = 0;
    if(playercount > 1) {//if this is not the first round to be played
        // console.log(deck.usedCards);
        // humans = playercount - 2;//playercount is incremented on dealer creation, so on restart it is incremented again for  the same dealer
        // playercount = 1;//decreased to 1 since each new iteration of User increments playercount
        console.log(`playing the game again`);
        let humans = playercount;
        let machines = botcount;
        playercount = 0;
        botcount = 0;
        deck.newDeck();
        beginGame(humans, machines);
    } else {//if it is the first round
            rl.question(`How many players wish to play?`, ans => {
                console.log(`${ans} player(s) wish(es) to play`);
                if(+ans) {//answer is a number
                    if(+ans <= Math.floor(deck.size/6) && +ans > 0 ) {//correct amount of players
                        // console.log(`correct amount of players`);
                        if(playWithBots) return askForBots(+ans);
                        else return beginGame(+ans);
                    } else {//incorrect amount of players
                        console.log(`How can ${ans} people play with ${deck.size} cards??? Did You think of that, genius?`);
                        playercount = 0;
                        return wholeGame();
                    }
                } else {//answer is not a number
                 console.log(`You had to enter a number!`);
                    playercount = 0;
                 return wholeGame();
                }
            });
        }
 };

wholeGame();