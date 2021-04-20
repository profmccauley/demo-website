import Card from "./Card.js";

export default class Hand{
    constructor() {
        this.cards = new Array();
        this.size
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
        return this.size;
    }

    find(card) {
        return this.cards.indexOf(card);
    }

    addCard(card) {
        this.cards.push(card);
    }

    // build hand
    createHand(hand) {
        // checking for invalid input
        /*if (!hand.isArray()) {
            console.log("Hand needs an array of cards");
            return 
        }
        */
        if (hand.length != 13) {
            console.log("Hands must start with 13 cards");
            return
        }
        // maybe -- check if cards passed in to hand are 
        // valid cards?
        this.cards = [...hand]; // copies (shallow) hand so as not to modify original
        this.size = this.cards.length;
    }

    // sort hand
    sort() {
        this.cards.sort(function (card, otherCard) {
            if (card.priority < otherCard.priority) {
              return -1;
            }
            if (card.priority > otherCard.priority) {
              return 1;
            }
            // a must be equal to b
            return 0;
          });
    }

    // remove a card from the hand
    removeCard(card) {
        // remove first instance of card from hand
        // there should only ever be one copy of a card
        let pos = this.cards.indexOf(card);
        this.cards.splice(pos, 1);

        // update size variable
        this.size = this.cards.length;
    }


}