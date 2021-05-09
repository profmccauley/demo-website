import Card from "./Card.js";

/**
 * This class represents a player's hand in Moho Poker.
 * 
 * A hand consists of an array of Card objects. This class also stores
 * the size of the hand for ease of access.
 * 
 * Hand objects are created with no arguments, then cards can be added individually
 * with the addCard method or a complete hand can be generated through the createHand method.
 */
export default class Hand{
    // create empty hand
    constructor() {
        this.cards = new Array();
        this.size;
    }

    // getters
    getCards() {
        return this.cards;
    }

    getSize() {
        return this.size;
    }

    // get all cards by name
    getCardsString() {
        let cardList = new Array();

        for (let card of this.cards) {
            cardList.push(card.getCardString());
        }

        return cardList;
    }

    // return the index of a card in the hand
    find(card) {
        return this.cards.indexOf(card);
    }

    /**
     * Adds card to the hand. Currently no
     * error checking that card is valid.
     * 
     * @param {Card} card Card object
     */
    addCard(card) {
        this.cards.push(card);

        this.size++;
    }

    /**
     * Replace current hand with new hand of 13 cards. Will not work
     * if hand is not size 13.
     * 
     * @param {Array} hand An array of 13 Cards
     */
    createHand(hand) {
        if (hand.length != 13) {
            console.log("Hands must start with 13 cards");
            return;
        }

        this.cards = [...hand]; // copies hand so as not to modify original
        this.size = this.cards.length;
    }

    // sort hand based on card priority
    sort() {
        this.cards.sort(function (card, otherCard) {
            if (card.priority < otherCard.priority) {
              return -1;
            }
            if (card.priority > otherCard.priority) {
              return 1;
            }
            // technically, card cannot be equal to other card
            return 0;
          });
    }

    clearCards() {
        this.cards.length = 0;
    }

    // remove a card from the hand
    removeCard(card) {
        // remove first instance of card from hand
        // there should only ever be one copy of a card
        let pos = this.find(card);
        this.cards.splice(pos, 1);

        // update size variable
        this.size = this.cards.length;
    }


}