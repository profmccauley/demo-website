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