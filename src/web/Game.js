import Deck from "./Deck.js";
import Player from "./Player.js";

export default class Game {
    // numPlayers is an int
    // playerNames is an array with the names of the player
    constructor(numPlayers, playerNames = false, deckType = 'classic', playRounds = 3, playPoints = null) {
        if (numPlayers < 2 || numPlayers > 4) {
            throw 'Number of players must be between 2 and 4';
        }

        this.numPlayers = numPlayers;

        this.players = new Array();
        this.createPlayers(playerNames); // sets up players
        
        this.currentPlayer = null;
        this.lastPlayer = null;
        
        this.previousCards = null; 
        this.deckType = deckType;
        this.deck = new Deck(deckType);
        this.startNewRound = false;
        this.lessThanThree = false;

        this.currentRound = 0;
        this.playRounds = playRounds;
        this.playPoints = playPoints;
        this.gameOver = false;

        this.startGame();
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

    getPreviousCards() {
        return this.previousCards;
    }

    isGameOver() {
        return this.gameOver;
    }

    // create players
    createPlayers(playerNames) {
        // will hold current player's name on most recent iteration
        var name;

        for (let i = 0; i < this.numPlayers; i++) {
            if (!playerNames) {
                name = "Player" + (i + 1);
            }
            else {
                name = playerNames[i];
            }
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

    // called from PlayerView, updates game
    // updates the game
    //    * update the current player to the next 
    //      player in the list
    //    * update the last player to the current player (above prev!!)
    //    * update the previously played cards to the current
    //      cards just played
    // CALL With either list of cards or nothing
    updateGame(cards = 'pass') {
        // changes if player didn't pass
        this.lessThanThree = false;
	this.playerLessThanThree = null;
        this.startNewRound = false;

        if (!(cards === 'pass')) {
            // update previous cards by copying array 
            // do not update cards if the player passed
            this.previousCards = [...cards];

            // TODO: remove cards from player's hand
            this.currentPlayer.removeCards(cards);

            console.log("update game ************************ before new round");
            console.log(this.currentPlayer);
            console.log(this.currentPlayer.getNumCards());
            console.log("update game ************************ getNumCards");
            if (this.currentPlayer.getNumCards() === 0) {
                // player won the round. 

                this.startNewRound = true;
                this.newRound();
                
                return;
            }
            else if(this.currentPlayer.getNumCards() <= 3){
                this.lessThanThree = true;            }

            // set the last player to be person who just played
            // will not change last player if a pass
            this.lastPlayer = this.currentPlayer;
        }
        else {
            this.previousCards = null;
        }

        // update next player
        var nextPlayerIndex = (this.players.indexOf(this.currentPlayer) + 1) % this.numPlayers;
        this.currentPlayer = this.players[nextPlayerIndex];

        // if the current player is the previous player, clear the previousCards
        if (this.currentPlayer === this.lastPlayer) {
            this.previousCards = 'new run';
        }
    }
    
    newRound() {
        // end the game if played to the max number of rounds
        this.currentRound++;

        if (this.currentRound === this.playRounds) {
            this.gameOver = true;
        }

        // set up players for next round
        for (let player of this.players) {
            // calculate the scores for each player
            player.updatePoints();

            // clear the player's hand for the next round
            player.clearCards();

            console.log()
        }

        // shuffle deck for next round
        this.deck.shuffleDeck();

        // deal new cards to the players
        // cards will automatically be sorted
        this.dealCards();
    }
}

