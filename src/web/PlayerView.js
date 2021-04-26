import Card from './Card.js';
import play_cards from './Network.js';

export default class PlayerView {
    constructor(name, host=false) {
        this.myName = name;
	    this.host = host;
        this.myCards = new Array();   // cards will be sorted by lowest to highest priority
        this.firstTurn;
        this.prevCards = new Array();
        this.currPlayer;
        this.nextPlayer;

        this.points = 0;

        var playCardButton = document.getElementById("play_hand");
        var passButton = document.getElementById("pass");
        playCardButton.addEventListener("click", this.playCards);
        passButton.addEventListener("click", this.pass);
    }

    startGame(playerJSON) {

        // TODO: parse JSON to fill in instance variables
        /* for (?? in playerJSON.hand) {
            var tempCard = new Card();  // this may not work if it overwrites the card each time
            tempCard.fromJSON(??);
            this.myCards.push(tempCard);
        }

        */
        //HUIYUN
        this.myCards = playerJSON.myCards;
        this.prevCards = playerJSON.prevCards;
        this.currPlayer = playerJSON.currPlayer;
        this.nextPlayer = playerJSON.nextPlayer;
        this.points = playerJSON.points;

	console.log(this.myCards);


        // displays the player's cards on the screen
        this.displayHand();

        if (this.currPlayer == this.myName) {
            this.firstTurn == true;   // sets special rule for first turn

            this.displayMyTurn();
        }
        else {
            this.displayNotMyTurn();
        }
    }

    getCardByFile(fileName){
	for (let card of this.myCards) {
	    if(card.getFilePath() == fileName){
		return card;
	    }
	}
	//card w/ given filename is not in the hand
	return false;
    }

    displayHand() {
	console.log("made it to displayHand");
        // MICHELA: call every time you update your cards
	var html = "";
	for (let card of this.myCards) {
	    let tag = '<img src="images/';
	    tag += card.getFilePath();
	    tag += '" class="player_card unselected">';
	    html += tag;
	}
	console.log(html);
	document.getElementById("cards").innerHTML = html;	    
    }

    displayPrevCards() {
        // MICHELA: call when receive new prev cards from the server
	var html = "";
	for (let card of this.prevCards) {
	    let tag = '<img src="';
	    tag += card.getFilePath();
	    tag += '" class="player_card unselected">';
	}
	document.getElementById("last_played").innerHTML = html;
    }

    displayMyTurn() {
        // MICHELA: display wrappers around the screen that allow you to click
        // pass and play buttons
	document.getElementById("play_hand").style.visibility="visible";
	document.getElementById("pass").style.visibility="visible";
    }

    displayNotMyTurn() {
        // MICHELA: display wrappers around the screen that remove
        // pass and play buttons
	document.getElementById("play_hand").style.visibility="hidden";
	document.getElementById("pass").style.visibility="hidden";
    }

    playCards() {
        // MICHELA: get the card elements with the class name selected
        var htmlCards = document.getElementsByClassName("selected");
	var cards = [];

	for (let htmlCard of htmlCards) {
	    let src = htmlCard.src;
	    let card = this.getCardByFile(src);
	    if (card == false){
		throw 'At least one card is not in the hand';
	    }
	    else{
		cards.push(card);
	    }
	}
	    
        /* REMOVING BECAUSE CHECK HAPPENS ABOVE NOW
	// check if the cards are in the hand
        for (let card of cards) {
            if (this.myCards.find(card) == -1) {
                throw 'At least one card is not in the hand';
            }
        }
	*/

        // check if the cards are valid to play based
        // returns "valid" if valid, error message if not
        var validity = this.isValid(cards);

        if (validity == "valid") {
            // removes cards from hand
            // HUIYUN: send info to server --> list of cards just played
            play_cards(cards);
        }
        else {
	        document.getElementById("error_message").innerHTML = validity;
            // MICHELA: display value of validity
        }
    }

    pass() {
        // send info to server --> fact that player did not play cards
            // HUIYUN: do we also need to send the player's name?
            //can we just check if the cards is empty?
            //Or do we want another data indicates whether player play or pass?
            play_cards(cards);
    }

    isValid(cards) {
        // sort the cards to make sure they're in ascending order
        cards = cards.sort();  // TODO: I'm not sure if this will work this way

        // if it's the first turn, the player can only play the lowest card in their hand
        if (this.firstTurn == true) {
            if (cards.length != 1) {
                return 'You may only play one card on the first turn';
            }
            else if (cards[0] != this.myCards[0]) {
                return 'You must play your lowest card on the first turn';
            }
            this.firstTurn = false;   // it is no longer the first turn
            return 'valid';
        }

        // check if played the same number of cards as prevPlayer
        if (cards.length != this.prevCards.length) {
            return 'you must play the same number of cards as the previous player';
        }

        // set max number of cards played in a normal hand -- normal hand can have 1-4 cards
        let maxNormalCardsPlayed = 4;
        let numPokerCardsPlayed = 5;

        // if true, this is a normal hand
        if (cards.length <= maxNormalCardsPlayed) {
            // check that these cards are playable -- each card must have the same rank
            let rank = cards[0].getRank();

            for (let i = 1; i < cards.length; i++) {
                if (cards[i].getRank() != rank) {
                    return 'all cards in a run must have the same rank';
                }
            }
            // if there were no previous cards, don't need to compare
            if (this.prevCards == null) {
                return 'valid';
            }
            // check if valid with previous cards
            return this.isValidPriority(cards);
        }
        else if (cards.length == numPokerCardsPlayed){
            // check that this is a valid poker hand
            let pokerHand = this.isPokerHand();
            if (pokerHand == 'false') {
                return 'these cards do not make a valid poker hand';
            }
            else if (this.prevCards == null) {
                // if there were no previous cards, don't need to compare
                return 'valid';
            }

            return this.isPokerMoveValid(pokerHand);

        }
        return 'you must play between 1 and 5 cards';

        
    }

    isValidPriority(cards, prevCards = null) {
        const prioritySum = (accumulator, card) => accumulator + card.getPriority();
        let currPriority = cards.reduce(prioritySum);

        if (prevCards == null) {
            let prevPriority = this.prevCards.reduce(prioritySum); 
        }
        else {
            let prevPriority = prevCards.reduce(prioritySum);
        }
        

        if (currPriority <= prevPriority) {
            return 'Cards must be higher than previously played cards';
        }

        return 'valid';
    }

    // checks if the cards being played are a valid poker hand
    isPokerHand(cards) {
        let flushSuit = cards[0].getSuit();
        let prevRank = cards[0].getRank();

        // To Clean: check if they're all the same suit
        // or if all different suits

        // check if STRAIGHT FLUSH / ROYAL FLUSH
        for (let i = 1; i < cards.length; i++) {
            if ((cards[i].getSuit == flushSuit) && (cards[i].getRank == (prevRank + 1))) {
                prevRank = cards[i].getRank();
            }
            else {
                break;
            }
        }
        if (i == cards.length - 1) {
            return 'sf';
        }

        // check if FOUR OF A KIND
        let sameCardCount = 1;
        prevRank = cards[0].getRank();
        for (let i = 1; i < cards.length; i++) {
            if (sameCardCount == 4) {
                return '4k';
            }
            if (cards[i].getRank == prevRank) {
                sameCardCount++;
            }
            else {
                sameCardCount = 1;
                prevRank = cards[i].getRank();
            }
        }
        if (sameCardCount == 4) {
            return "4k";
        }

        // check if FULL HOUSE
        let firstCardCount = 1;
        let firstRank = cards[0].getRank();
        let secondCardCount = 0;
        let secondRank = null;

        for (let i = 1; i < cards.length; i++) {
            if (cards[i].getRank() == firstRank) {
                // card is same as first card
                firstCardCount++;
            }
            if (secondRank == null) {
                // second rank is not set, set it and 
                // update count
                secondRank = cards[i].getRank();
                secondCardCount++;
            }
            else if (cards[i].getRank() == secondRank) {
                // second rank is set and card is same, 
                // update counts
                secondCardCount++;
            }
            else {
                // second rank is set, card is not same
                // thus not a full house
                break;
            }
        }
        if ((firstCardCount + secondCardCount) == 5) {
            return "fh";
        }


        // check if STRAIGHT
        prevRank = cards[0].getRank();

        for (let i = 1; i < cards.length; i++) {
            // to be a straight, the cards must be in ascending order by rank
            // TODO: check if a straight can have cards with the same rank but
            // different priorities?
            if (cards[i].getRank() == (prevRank + 1)) {
                prevRank = cards[i].getRank();
            }
            else {
                break; // not a straight, but could be another poker hand
            }
        }
        if (i == cards.length - 1) {
            return 's';
        }

        // check if FLUSH
        for (let i = 1; i < cards.length; i++) {
            // to be a flush, the cards must have the same suit
            if (!(cards[i].getSuit() == flushSuit)) {
                break; // not a flush, but could be another poker hand
            }
        }
        // check if we got to the end of the loop
        if (i == cards.length - 1) {
            return 'f';
        }

        return 'false';
    }
    /*
    Poker Hands
        Straight = any 5 numerically consecutive cards
        Flush = any five cards of the same suit
        Full House = 3 cards of the same number and a pair of cards that share a different number
            For the purposes of ranking you look at the 3 of a kind
            ie if 3 7s and 2 10s were played the next player could play 3 8s and 2 3s on top as a valid move of higher rank
        4 of a Kind = all 4 cards of one number and one extra card (can be anything)
        Straight Flush = 5 numerically consecutive cards all the same suit
        Royal Flush = the highest ranking flush, which is the jack, queen, king, ace, and 2 of spades
            There is only one possible royal flush

*/

    // check if the current poker hand is greater than the previous poker hand
    isPokerMoveValid(cards, currCards) {
        // will hold 
        let prevCards = this.isPokerHand(this.prevCards);

        if (prevCards == 'false') {
            return 'you attempted to play a poker hand, but the previous cards were not a poker hand';
        }

        switch (prevCards) {
            case 'sf':
                if (currCards == 'sf') {
                    // check if the cards have a higher priority sum
                    return this.isValidPriority(cards, this.prevCards);
                }
                return 'you must play a straight flush with higher cards';
            case '4k':
                if (currCards == 'sf') {
                    return 'valid';
                }
                if (currCards == '4k') {
                    // TODO: check if the 4 cards have a higher rank
                }
                return 'you must play a four of a kind or a straight flush';
            case 'fh':
                if (currCards == 'sf' || currCards == '4k') {
                    return 'valid';
                }
                if (currCards == 'fh') {
                    // TODO: check that the trio is larger
                }
                return 'you must play either: straight flush, four of a kind, or full house with higher three of a kind';
            case 's':
                if (currCards == 'sf' || currCards == '4k' || currCards == 'fh') {
                    return 'valid';
                }
                if (currCards == 's') {
                    // check that the lowest card is higher than the previous lowest card
                    // TODO: confirm that Lena wouldn't want to do this based on priority?
                    if (cards[0].getRank() > this.prevCards.getRank()) {
                        return 'valid';
                    }
                    return 'your straight must be higher than the previous straight';
                }
                return 'you must play either: straight flush, four of a kind, full house, or a straight with higher cards';
            case 'f':
                if (currCards == 'sf' || currCards == '4k' || currCards == 'fh' || currCards == 's') {
                    return 'valid';
                }
                if (currCards == 'f') {
                    let lastCard = 4;
                    // check if rank of highest card is larger than previous highest card
                    if (cards[lastCard].getRank() > this.prevCards[lastCard].getRank()) {
                        return 'valid';
                    }
                    return 'your flush must have a higher card than the previous flush';
                }
                return 'you must play either: straight flush, four of a kind, full house, straight, or a flush with higher cards';
            default:
                return 'you cannot play poker hands during this run';
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


// what's the flow of a player taking a turn?

// 1.  player chooses cards to play
// 2.  check that the cards are in Player's hand
// 3.  check that the cards are valid. this is 100% based
//     on what was played by the previous player
//        * one card run
//              * must have played one card
//              * card must have higher priority
//        * two/three/four card run: 
//              * must have played two same cards
//              * cards must have higher summed priority
//        * special card run
//              * must have five cards
//              * must be one of the special card thingies
//              * must be either
//                  * the same special card thing with higher cards
//                  * a higher special card thing
//              * [this one will take the most manual logic]
// 4a. if cards are not valid, give user useful error 
// 4b. if cards are valid:
//        * update the current player to the next 
//          player in the list
//        * update the last player to the current player (above prev!!)
//        * update the previously played cards to the current
//          cards just played
//        * reduce the size of the player's hand by cards.length

// separate player view class
        // here is what each player needs to draw their UI
        // and the previous cards
        // and check "is this a valid move that I should submit
        // to the server"