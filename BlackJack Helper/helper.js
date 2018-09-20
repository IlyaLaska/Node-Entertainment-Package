'use strict';

let multideck = false;

let readline = require('readline');

let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.setPrompt('>>');

let decide = function (string) {
    string = string.toUpperCase();
    let cards = string.split(/[ ,]+/);
    console.log(cards);
    if(cards.length === 1) {//if only one card is entered
        let err = `You have entered the wrong amount of cards`;
        // console.log(err);
        return err;
    }
    if(+cards[0] > 10) {//if dealer's card is > 10
        let err = `You have entered the wrong card for the Dealer`;
        // console.log(err);
        return err;
    }
    if(cards[3] && !+cards[1] && !+cards[2]) {//if player has 2 10+ value cards and then some
        let err = `You do not need a helper at this point`;
        // console.log(err);
        return err;
    }
    if((cards[1] === 'A' && cards[2] === '10') || (cards[1] === '10' && cards[2] === 'A')) {//if player has a blackjack
        let err = `You got a blackjack, you need no helper`;
        // console.log(err);
        return err;
    }
    // if(cards[0] === 'J' || cards[0] === 'K' || cards[0] === 'Q') cards[0] = '10';//convert to 10s
    // if(cards[1] === 'J' || cards[1] === 'K' || cards[1] === 'Q') cards[1] = '10';//convert to 10s
    // if(cards[2] === 'J' || cards[2] === 'K' || cards[2] === 'Q') cards[2] = '10';//convert to 10s
    for (let i = 0; i < cards.length; i++) {
        if(cards[i] === 'J' || cards[i] === 'K' || cards[i] === 'Q') cards[i] = '10';//convert to 10s
        if((!+cards[i] && cards[i] !== 'A') || +cards[i] < 2) {//break on any number < 2  or > 10
            // and unknown letter on any position since only valid letter is now 'A'
            let err = `There is no such card`;
            // console.log(err);
            return err;
        }
    }
    let scoreString = '';
    let score = 0;
    let ace = false;
    for (let i = 1; i < cards.length; i++) {//Counting the players score
        if(cards[i] === 'A') ace = true;
        else score += +cards[i];
    }
    cards.forEach(value => {
        if(value < 7) cardcounter--;
        if(value > 9 || value === 'A') cardcounter++;
    });
    truecount = cardcounter/decks;
    if((score > 20 && ace) || score > 21) {//if players score is over 21
        let err = `You do not need a helper at this point`;
        // console.log(err);
        return err;
    }
    if(ace) {
        if(score < 2) score = 2;
        if(score > 9) score = 9 ;
        scoreString = 'A,' + score;
    } else {
            if(score > 17) score = 17;
            if(score < 8) score = 8;
            scoreString = '' + score;
    }
    console.log(`Player scoreString: ${scoreString}`);
    let yPos;
    for (let i = 0; i < answers.length; i++) {
        if(answers[i][0] === cards[0]) {
            yPos = i;
            break;
        }
    }
    let xPos = answers[0].indexOf(scoreString);
    // console.log(yPos, xPos);
    return answers[yPos][xPos];
};

let answers = [
    ['',  '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', 'A,2', 'A,3', 'A,4', 'A,5', 'A,6', 'A,7', 'A,8', 'A,9'],
    ['2', 'H', 'H',  'D',  'D',  'H',  'S',  'S',  'S',  'S',  'S',   'H',   'H',   'H',   'H',   'H',  'Ds',   'S',   'S'],
    ['3', 'H', 'D',  'D',  'D',  'H',  'S',  'S',  'S',  'S',  'S',   'H',   'H',   'H',   'H',   'D',  'Ds',   'S',   'S'],
    ['4', 'H', 'D',  'D',  'D',  'S',  'S',  'S',  'S',  'S',  'S',   'H',   'H',   'D',   'D',   'D',  'Ds',   'S',   'S'],
    ['5', 'H', 'D',  'D',  'D',  'S',  'S',  'S',  'S',  'S',  'S',   'D',   'D',   'D',   'D',   'D',  'Ds',   'S',   'S'],
    ['6', 'H', 'D',  'D',  'D',  'S',  'S',  'S',  'S',  'S',  'S',   'D',   'D',   'D',   'D',   'D',  'Ds',  'Ds',   'S'],
    ['7', 'H', 'H',  'D',  'D',  'H',  'H',  'H',  'H',  'H',  'S',   'H',   'H',   'H',   'H',   'H',   'S',   'S',   'S'],
    ['8', 'H', 'H',  'D',  'D',  'H',  'H',  'H',  'H',  'H',  'S',   'H',   'H',   'H',   'H',   'H',   'S',   'S',   'S'],
    ['9', 'H', 'H',  'D',  'D',  'H',  'H',  'H',  'H',  'H',  'S',   'H',   'H',   'H',   'H',   'H',   'H',   'S',   'S'],
   ['10', 'H', 'H',  'H',  'D',  'H',  'H',  'H',  'H',  'H',  'S',   'H',   'H',   'H',   'H',   'H',   'H',   'S',   'S'],
    ['A', 'H', 'H',  'H',  'D',  'H',  'H',  'H',  'H',  'H',  'S',   'H',   'H',   'H',   'H',   'H',   'H',   'S',   'S']
];

let cardcounter = 0;
let truecount = 0;
let decks = 0;

let askDeckAmount = function() {
    rl.question(`How mny decks are used in your game?`, ans => {
        if(!+ans) {
            console.log(`Please enter a valid number`);
            return askDeckAmount();
        } else {
            decks = ans;
            console.log(`so, You are using ${ans} decks`);
        }
        console.log(`Please input the Dealer's card and your cards in one go
(enter each card individually if you want card counter to be accurate)\n`);
        console.log(`Type 'restart' to reset card counter back to 0`);
        rl.prompt();
    });
};

if(multideck) {
    askDeckAmount();
} else {
    console.log(`Please input the Dealer's card and your cards in one go
(enter each card individually if you want card counter to be accurate)\n`);
    console.log(`Type 'restart' to reset card counter back to 0`);

    rl.prompt();
}



rl.on('line', (line) => {
    if(line === 'restart') {
        cardcounter = 0;
        console.log(`Card counter has been restarted`);
    } else {
        let result = decide(line);
        console.log(`${result}`);
        if(multideck) console.log(`Card counter value: ${cardcounter}, True count value: ${truecount}`);
        else console.log(`Card counter value: ${cardcounter}`);
    }
    rl.prompt();
});