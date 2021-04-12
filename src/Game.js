import Deck from "./Deck.js";
import Player from "./Player.js";

export default class Game {
    constructor(numPlayers) {
        if (numPlayers < 2 || numPlayers > 4) {
            throw 'Number of players must be between 2 and 4';
        }
        this.numPlayers = numPlayers;
        this.players = new Array();
        this.playerOrder = new Array();
        this.createPlayers(); // add players 
        
        this.lastPlayer = null;
        this.currentPlayer = null;

        this.previousCards = null; 
        this.deck = new Deck();
        // should above be an array of cards? or a hand?

    }
    // getters
    getNumPlayers() {
        return this.numPlayers;
    }

    getPlayers() {
        return this.players;
    }

    // create players
    createPlayers() {
        for (let i = 0; i < this.numPlayers; i++) {
            let name = "Player" + (i + 1);
            this.players.push(new Player(name));
            this.playerOrder.push(this.players[i]);
        }
    }

    // start game - does initialization
    startGame() {
        // initialize deck for the game
        this.deck.shuffleDeck();

        // deal cards to the players
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
}

