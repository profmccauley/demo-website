import Card from './Card.js';
import play_cards from './Network.js';
import Player from './Player.js';

export default class PlayerView {
    constructor(name, host=false) {
        this.myName = name;
	    this.host = host;
        this.myCards = new Array();   // cards will be sorted by lowest to highest priority
        this.firstTurn;
        this.canPass = false;
        this.prevCards = new Array();
        this.currPlayer;
        this.nextPlayer;

        this.points = 0;

        var playCardButton = document.getElementById("play_hand");
        var passButton = document.getElementById("pass");
        playCardButton.addEventListener("click", this.playCards.bind(this));
        passButton.addEventListener("click", this.pass);
    }

    startGame(playerJSON) {
	var players = [];

        if(this.host === false){
            for (let i = 0; i < playerJSON.myCards.cards.length; i++) {
                var tempCard = new Card();
                tempCard.fromJSON(playerJSON.myCards.cards[i]);
                this.myCards.push(tempCard);
            }
            console.log(this.myCards);
	    for (let i = 0; i < playerJSON.players.length; i++) {
                var tempPlayer = new Player();
                tempPlayer.fromJSON(playerJSON.players[i]);
                players.push(tempPlayer);
            }
        }
        else{
            this.myCards = playerJSON.myCards;
	    players = playerJSON.players;
        }
        
        this.currPlayer = playerJSON.currPlayer;
        this.nextPlayer = playerJSON.nextPlayer;
        this.points = playerJSON.points;

        // displays the prev cards
        this.displayPrevCards();

        // displays the player's cards on the screen
        this.displayHand();

	this.displayScores(players);

        if (this.currPlayer == this.myName) {
            this.firstTurn = true;   // sets special rule for first turn

            this.displayMyTurn();
        }
        else {
            this.firstTurn = false;
            this.displayNotMyTurn();
        }

        this.displayPlayers();
    }

    /**
     * This method receives updates from the server after a player has played cards.
     * It will update the stored information, then redisplay the screen
     * 
     * @param serverUpdates dictionary containing the new current player, the next player, and the
     */

        switch (prevCards) {
            case 'sf':
                if (currCards == 'sf') {
                    // check if the cards have a higher priority sum
                    return this.isValidPriority(cards, this.prevCards);
                }
                return 'You must play a straight flush with higher cards';
            case '4k':
                if (currCards == 'sf') {
                    return 'valid';
                }
                if (currCards == '4k') {
                    // check if the 4 cards have a higher rank
                    let currQuad = new Array();
                    let prevQuad = new Array();

                    // find the quad for each
                    // get the sum of the priority of the quad
                    for (let i = 1; i < cards.length; i++) {
                        // CURRENT
                        if (currQuad.length === 4) {
                            // already have the quad, do nothing
                        }
                        else if (cards[i].getRank() == cards[i-1].getRank()) {
                            // if same rank as previous, add to the quad
                            currQuad.push(cards[i]);
                        }
                        else {
                            // reset and push
                            currQuad.length = 0;
                            currQuad.push(cards[i]);
                        }
                        
                        // PREVIOUS
                        if (prevQuad.length === 4) {
                            // already have the quad, do nothing
                        }
                        else if (this.prevCards[i].getRank() == this.prevCards[i-1].getRank()) {
                            // if same rank as previous, add to the quad
                            prevQuad.push(this.prevCards[i]);
                        }
                        else {
                            // reset and push
                            prevQuad.length = 0;
                            prevQuad.push(this.prevCards[i]);
                        }
                    }
                    
                    // check if the current cards have a higher priority sum
                    return this.isValidPriority(currQuad, prevQuad);
                }
                return 'You must play a four of a kind or a straight flush';
            case 'fh':
                if (currCards == 'sf' || currCards == '4k') {
                    return 'valid';
                }
                if (currCards == 'fh') {
                    let currTrio = new Array();
                    let prevTrio = new Array();

                    // find the trio for each
                    // get the sum of the priority of the trio
                    for (let i = 1; i < cards.length; i++) {
                        // CURRENT
                        if (currTrio.length === 3) {
                            // already have the trio, do nothing
                        }
                        else if (cards[i].getRank() == cards[i-1].getRank()) {
                            // if same rank as previous, add to the trio
                            currTrio.push(cards[i]);
                        }
                        else {
                            // reset and push
                            currTrio.length = 0;
                            currTrio.push(cards[i]);
                        }
                        
                        // PREVIOUS
                        if (prevTrio.length === 3) {
                            // already have the trio, do nothing
                        }
                        else if (this.prevCards[i].getRank() == this.prevCards[i-1].getRank()) {
                            // if same rank as previous, add to the trio
                            prevTrio.push(this.prevCards[i]);
                        }
                        else {
                            // reset and push
                            prevTrio.length = 0;
                            prevTrio.push(this.prevCards[i]);
                        }
                    }
                    
                    // check if the current cards have a higher priority sum
                    return this.isValidPriority(currTrio, prevTrio);
                }
                return 'You must play either: straight flush, four of a kind, or full house with higher three of a kind';
            case 's':
                if (currCards == 'sf' || currCards == '4k' || currCards == 'fh') {
                    return 'valid';
                }
                if (currCards == 's') {
                    // check that the lowest card is higher than the previous lowest card
                    if (cards[0].getRank() > this.prevCards[0].getRank()) {
                        return 'valid';
                    }
                    return 'Your straight must be higher than the previous straight';
                }
                return 'You must play either: straight flush, four of a kind, full house, or a straight with higher cards';
            case 'f':
                if (currCards == 'sf' || currCards == '4k' || currCards == 'fh' || currCards == 's') {
                    return 'valid';
                }
                if (currCards == 'f') {
                    let lastCard = 4; // since 5 card hands, 4 is last index

                    // check if rank of highest card is larger than previous highest card
                    if (cards[lastCard].getRank() > this.prevCards[lastCard].getRank()) {
                        return 'valid';
                    }
                    return 'Your flush must have a higher card than the previous flush';
                }
                return 'You must play either: straight flush, four of a kind, full house, straight, or a flush with a higher last card';
            default:
                return 'You cannot play poker hands during this run';
        }
    }

    // sorts cards
    sort() {
        this.myCards.sort(function (card, otherCard) {
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
}
