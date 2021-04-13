import Game from "./Game.js";
import Card from "./Card.js";

export default class pokerRules {
    constructor(game) {
        this.game = game;
        this.prevCards = null;
    }

    // get previously played hand

    isValid(cards) {
        // get the most recent cards. Will update every turn
        this.prevCards = this.game.getPreviousCards();

        // check if this is the start of a run
        if (this.prevCards == null) {
            // TODO: what?
        }
        else if (cards.length != this.prevCards.length) {
            // check currPlayer played the same number of cards as prevPlayer
            throw 'Must play same number of cards,', this.prevCards.length, 'as previous player';
        }

        // 
        let maxNormalCardsPlayed = 4;
        if (cards.length <= maxNormalCardsPlayed) {
            this.isNormalMoveValid(cards);
        }
    }

    isNormalMoveValid(cards) {
        const prioritySum = (accumulator, card) => accumulator + card.getPriority();
        let currPriority = cards.reduce(prioritySum);
        let prevPriority = this.prevCards.reduce(prioritySum);

        if (currPriority <= prevPriority) {
            throw 'Cards must be higher than previously played cards';
        }

        this.game.updateGame(cards);
    }
}

// what's the flow of a player taking a turn?

// 1.  player chooses cards to play
// 2.  check that the cards are in Player's hand
// 3.  check that the cards are valid. this is 100% based
//     on what was played by the previous player
//        * one card run
//              * must have played one card
//              * card must have higher priority
//        * two/three/four card run: 
//              * must have played two same cards
//              * cards must have higher summed priority
//        * special card run
//              * must have five cards
//              * must be one of the special card thingies
//              * must be either
//                  * the same special card thing with higher cards
//                  * a higher special card thing
//              * [this one will take the most manual logic]
// 4a. if cards are not valid, give user useful error 
// 4b. if cards are valid:
//        * update the current player to the next 
//          player in the list
//        * update the last player to the current player (above prev!!)
//        * update the previously played cards to the current
//          cards just played
//        * reduce the size of the player's hand by cards.length