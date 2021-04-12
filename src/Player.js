import Hand from "./Hand.js";


export default class Player {
    constructor(name) {
        this.name = name || "Player";
        this.hand = new Hand();
        this.points = 0;
    }

    // getters
    getHand() {
        return this.hand.getCards();
    }

    getHandString() {
        return this.hand.getCardsString();
    }

    getName() {
        return this.name;
    }

    getPoints() {
        return this.points;
    }

    // player plays a hand
    // takes an array of cards to be played
    // throws error if the cards are not in the hand
    // passes on thrown error if the cards are not valid
    playHand(cards) {
        // check if the cards are in the hand
        for (let card of cards) {
            if (this.hand.find(card) == -1) {
                throw 'At least one card is not in the hand';
            }
        }

        // check if the cards are valid to play based
        // on previously played cards -->
        // this will be done in the Game class

        // removes cards from hand
        for (let card of cards) {
            this.hand.removeCard(card);
        }
    }

    // temporary method to give player a hand -- will eventually move to game
    makeHand(hand) {
        this.hand.createHand(hand);
    }

    addCard(card) {
        this.hand.addCard(card);
    }

    // sorts a player's hand
    sortHand() {
        this.hand.sort();
    }
}