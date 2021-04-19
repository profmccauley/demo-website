/**
 * 
 */
export default class Card {
    static DIAMONDS = 1;
    static CLUBS = 2;
    static HEARTS = 3;
    static SPADES = 4;

    static JACK = 11;
    static QUEEN = 12;
    static KING = 13; 
    static ACE = 14;


    constructor(rank, suit, cardImageFolder = "classic") {
        // consider adding error catching for incorrect rank/suit values?
        this.rank = rank;
        this.suit = suit;
        this.priority = this.generatePriority();
        this.file = cardImageFolder + "/" + this.getCardString() + ".jpg";
    }

    // basic getters
    getRank() {
        return this.rank;
    }

    getSuit() {
        return this.suit;
    }

    getPriority() {
        return this.priority;
    }

    getFilePath() {
        return this.file;
    }

    getSuitString() {
        switch(this.suit) {
            case Card.DIAMONDS: return "D";
            case Card.CLUBS: return "C";
            case Card.HEARTS: return "H";
            case Card.SPADES: return "S";
            default: return "invalid suit"
        }
    }


    getRankString() {
        switch(this.rank) {
            case Card.ACE: return "A";
            case Card.JACK: return "J";
            case Card.QUEEN: return "Q";
            case Card.KING: return "K";
            default: return this.rank.toString();
        }
    }

    // string getters
    /*
    getSuitString() {
        switch(this.suit) {
            case Card.DIAMONDS: return "diamonds";
            case Card.CLUBS: return "clubs";
            case Card.HEARTS: return "hearts";
            case Card.SPADES: return "spades";
            default: return "invalid suit"
        }
    }
    */

    /*
    getRankString() {
        switch(this.rank) {
            case Card.ACE: return "Ace";
            case Card.JACK: return "Jack";
            case Card.QUEEN: return "Queen";
            case Card.KING: return "King";
            default: return this.rank.toString();
        }
    }
    */
    /*
    getCardString() {
        return this.getRankString() + " of " + this.getSuitString();
    }
    */

    getCardString() {
        return this.getRankString() + this.getSuitString();
    }

    // set priority -- can I make this a private method?
    generatePriority() {
        var twoCardLowestVal = 48;
        var lowestVal = 3;
        var cardMultipleVal = 4;

        if (this.rank == 2) {
            return twoCardLowestVal + this.suit;
        }
        else {
            return cardMultipleVal * (this.rank - lowestVal) + this.suit;
        }
    }

    // rule on how to compare cards
    compare(otherCard) {
        if (this.priority < otherCard.priority) {
          return -1;
        }
        if (this.priority > otherCard.priority) {
          return 1;
        }
        // a must be equal to b
        return 0;
      }
  };