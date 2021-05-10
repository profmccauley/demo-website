import Deck from "./Deck.js";
import Player from "./Player.js";

/**
 * This class represents the game of Moho Poker, and is responsible
 * for all of the server side logic.
 * 
 * A game object is created with a number of players, a list of their names,
 * a given deck type (for card images), and the number of rounds or points the
 * game will be played to.
 * 
 * The game class is responsible for updating each player's cards, reseting after
 * a run or round is over, and ending the game.
 */
export default class Game {
    // numPlayers is an int
    // playerNames is an array with the names of the player
    constructor(numPlayers, playerNames = false, deckType = 'classic', playRounds = 3, playPoints = null) {
        if (numPlayers < 2 || numPlayers > 4) {
            throw 'Number of players must be between 2 and 4';
        }

        // the number of players participating
        this.numPlayers = numPlayers;

        // initialize to empty, will hold array of Player objects
        this.players = new Array();
        this.createPlayers(playerNames); // sets up players
        
        // current player and last player will be
        // set once the game starts
        this.currentPlayer = null;
        // last player is last to have played cards (not passed)
        this.lastPlayer = null;
        
        // most recently played cards, stored in order
        // to display to all players
        this.previousCards = null; 

        // used to get card image files
        this.deckType = deckType;
        this.deck = new Deck(deckType);

        // keeps track of if a new round needs to be started
        this.startNewRound = false;

        // keeps track of if the most recent player has less than 
        // three cards left
        this.lessThanThree = false;

        // used to track when the game is over
        this.currentRound = 0;
        this.playRounds = playRounds;
        this.playPoints = playPoints;
        this.gameOver = false;

        // start game by shuffling deck and dealing to players
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

    // getter for if the game is over or not
    // not labelled as a getter for clarity of boolean 
    // return value
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

    /**
     * Find the player with the lowest card. Sets
     * this player to be the current player at the start
     * of the game.
     */
    findPlayerLowestCard() {
        // start by assuming the first player has the lowest card
        this.currentPlayer = this.players[0];

        // since cards are sorted, the first card in each player's hand
        // will be their lowest card

        for (let i = 1; i < this.numPlayers; i++) {
            if (this.players[i].getHand()[0].getPriority() < this.currentPlayer.getHand()[0].getPriority()) {
                this.currentPlayer = this.players[i]; // change current player if new lowest card
            }
        }
    }

    /**
     * Updates the game after a player takes a turn. Changes the current
     * player, and if not a pass, also updated the previous cards and
     * the last person to play.
     * 
     * @param {Array} cards array of cards, or 'pass' if no cards played
     * @returns 
     */
    updateGame(cards = 'pass') {
        this.lessThanThree = false;
	    this.playerLessThanThree = null;
        this.startNewRound = false;

        if (!(cards === 'pass')) {
            // update previous cards by copying array 
            // do not update cards if the player passed
            this.previousCards = [...cards];

            // remove cards from player's hand
            this.currentPlayer.removeCards(cards);

            // if no cards left, player won the round 
            if (this.currentPlayer.getNumCards() === 0) {
                // start a new round
                this.startNewRound = true;
                this.newRound();
                
                return;
            }
            else if(this.currentPlayer.getNumCards() <= 3){
                this.lessThanThree = true;            
            }

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
        // the run is over since all other players passed
        if (this.currentPlayer === this.lastPlayer) {
            this.previousCards = 'new run';
        }
    }
    
    /**
     * Resets the game for a new round. If the end game
     * threshold has been hit, ends the game for all players.
     * 
     * Deals new cards to all players and calculates point
     */
    newRound() {
        // increase the number of the round
        this.currentRound++;

        // set up players for next round
        for (let player of this.players) {
            // calculate the scores for each player
            player.updatePoints();

            // clear the player's hand for the next round
            player.clearCards();
        }

        // check if END GAME
        // if playing to points, check that no player has hit the max point count
        if (this.playPoints != null) {
            for (let i = 0; i < this.players.length; i++) {
                // if any players score is above the max, the game is over
                if (this.players[i].getPoints() > this.playPoints) {
                    this.gameOver = true;
                }
            }
        }
        else if (this.currentRound === this.playRounds) {
            // not playing to number of points, check if hit round count
            this.gameOver = true;
        }

        // shuffle deck for next round
        this.deck.shuffleDeck();

        // deal new cards to the players
        // cards will automatically be sorted
        this.dealCards();
    }
}

