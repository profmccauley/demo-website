import Hand from "./Hand.js";


export default class Player {
    constructor(name) {
        this.name = name || "Player";
        this.hand = new Hand();
        this.numCards = 0;
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

    getNumCards() {
        return this.numCards;
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
        this.numCards++;
    }

    // removes cards from the player's hand
    removeCards(cards) {
        for (let card of cards) {
            this.hand.removeCard(card);
            this.numCards--;
        }
    }

    clearCards() {
        this.hand.clearCards();

        this.numCards = 0;
    }

    // add one point for each card remaining in hand
    updatePoints() {
        this.points += this.numCards;
    }

    // sorts a player's hand
    sortHand() {
        this.hand.sort();
    }

    // parse JSON to rebuild a player from the server
    fromJSON(json) {
        this.name = json.name;
        this.hand = json.hand;
        this.numCards = json.numCards;
        this.points = json.points;
    }
}
