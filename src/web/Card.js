/**
 * This class represents a card object. 
 * 
 * Instances of this class have a rank and suit like normal playing cards,
 * as well as a priority and file extension. The priority is a number from 1 to 52 based
 * on the rank of cards in Moho Poker. The file extension is used to determine which card
 * image to display on the front end.
 * 
 * Objects of this class can be created with a rank between 2 and 14 and a suit between 1 and 4. 
 * However, there is currently no error checking that the rank and suit are between these numbers
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
        // if attempting to create an empty card object, do not update instance variables
        if (rank === undefined) {
            return;
        }

        this.rank = rank;
        this.suit = suit;
        this.priority = this.generatePriority(); // generate priority based on card number
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

    // string getters, used for file name
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

    getCardString() {
        return this.getRankString() + this.getSuitString();
    }

    /**
     * Generate the priority for a card based on rules of Moho Poker
     * priority will be a number from 1 - 52. In Moho Poker, the 
     * lowest card is the 3 of diamonds and the highest the 2 of spades.
     * 
     * returns the priority for this card
     * */ 
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

      // parse JSON to rebuild a card from the server
      fromJSON(json) {
          this.rank = json.rank;
          this.suit = json.suit;
          this.priority = json.priority;
          this.file = json.file;
      }
  };