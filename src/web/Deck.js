import Card from "./Card.js";

/**
 * Represents a deck of 52 cards.
 * 
 * The deck holds an array of all the cards and a tag for
 * which deck images will be used. A deck will automatically
 * generate cards -- they do not need to be passed in.
 */
export default class Deck {
    constructor(deckType = "classic") {
        this.cards = new Array();  // initialize with no cards
        this.deckType = deckType;

        // generate deck of 52 standard cards
        this.generateDeck();
    }

    // getters
    getCards() {
        return this.cards;
    }

    getCardsString() {
        let cardList = new Array();
        for (let card of this.cards) {
            cardList.push(card.getCardString());
        }
        return cardList;
    }

    getSize() {
        return this.cards.length;
    }

    // get a card based on its index
    getCardByIndex(i) {
        return this.cards[i];
    }

    // find index of a given card
    find(card) {
        return this.cards.indexOf(card);
    }

    // generate deck of 52 cards
    generateDeck() {
        let lowestRank = 2;
        let highestRank = 14;
        let lowestSuit = 1;
        let highestSuit = 4;

        for (let rank = lowestRank; rank <= highestRank; rank++) {
            for (let suit = lowestSuit; suit <= highestSuit; suit++) {
                this.cards.push(new Card(rank, suit, this.deckType));
            }
        }
    }

    // shuffle the deck by randomly swapping card
    shuffleDeck() {
        // code taken from: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }
}