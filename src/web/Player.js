import Hand from "./Hand.js";

/**
 * This class represents player objects in Moho Poker.
 * 
 * Each player keeps track of their name, their hand (cards) and its
 * size, and the number of points they have.
 * 
 * A player is initialized only with a name, and their cards and points
 * are added and changed as the game progresses.
 */
export default class Player {
    constructor(name) {
        this.name = name || "Player"; // default to player if no name passed in
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

    // add a card to a player's hand
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

    // reset player's hand to no cards
    clearCards() {
        this.hand.clearCards();

        this.numCards = 0;
    }

    // add one point for each card remaining in hand
    updatePoints() {
        this.points += this.numCards;
    }

    // sort a player's hand
    sortHand() {
        this.hand.sort();
    }

    // parse JSON to rebuild a player object from the server
    fromJSON(json) {
        this.name = json.name;
        this.hand = json.hand;
        this.numCards = json.numCards;
        this.points = json.points;
    }
}
