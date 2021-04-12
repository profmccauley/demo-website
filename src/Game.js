import Deck from "./Deck.js";
import Player from "./Player.js";

export default class Game {
    constructor(numPlayers) {
        if (numPlayers < 2 || numPlayers > 4) {
            throw 'Number of players must be between 2 and 4';
        }
        this.numPlayers = numPlayers;
        this.players = new Array();
        this.createPlayers(); // add players 
        this.playerOrder = new Array();
        
        this.currentPlayer = null
        this.lastPlayer = null;

        // below could also be a hand? but may convolute purpose
        this.previousCards = new Array(); 
        this.deck = new Deck();
    }

    // getters
    getNumPlayers() {
        return this.numPlayers;
    }

    getPlayers() {
        return this.players;
    }

    getCurrentPlayer() {
        return this.currentPlayer;
    }

    // create players
    createPlayers() {
        for (let i = 0; i < this.numPlayers; i++) {
            let name = "Player" + (i + 1);
            this.players.push(new Player(name));
        }
    }

    // start game - does initialization
    startGame() {
        // initialize deck for the game
        this.deck.shuffleDeck();

        // deal cards to the players
        // cards will automatically be sorted
        this.dealCards();

        // start with player with the lowest card
        this.findPlayerLowestCard();
    }

    // deal 13 cards to each player
    dealCards() {
        let min = 0;
        let max = 13;
        let numCards = 13;

        for (let player of this.players) {
            while (min < max) {
                player.addCard(this.deck.getCardByIndex(min));
                min++;
            }
            player.sortHand();
            // increment max to get the next 13 indices
            max = max + numCards;
        }
    }

    // find the player with the lowest card
    findPlayerLowestCard() {
        // get the first card of each of the players
        // the card with the lowest priority is the lowest
        
        // start by assuming the first player has the lowest card
        this.currentPlayer = this.players[0];

        for (let i = 1; i < this.numPlayers; i++) {
            if (this.players[i].getHand()[0].getPriority() < this.currentPlayer.getHand()[0].getPriority()) {
                this.currentPlayer = this.players[i];
            }
        }
    }
    
}

