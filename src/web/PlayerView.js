import Card from './Card.js';
import play_cards from './Network.js';
import Player from './Player.js';

export default class PlayerView {
    constructor(name, host=false) {
        console.log("*******player is constructed******");
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
        playCardButton.addEventListener("click", this.playCards.bind(this));
        passButton.addEventListener("click", this.pass);
    }

    startGame(playerJSON) {

        // TODO: parse JSON to fill in instance variables
	console.log("*****LOOOKKKKK********");
	console.log(playerJSON);

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

	    console.log("my cards are", this.myCards);
        console.log("length of my cards is", this.myCards.length);

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
     * cards that were just played
     */
    updateGame(serverUpdates) {
        console.log('*** server update ***', serverUpdates);
        if (!(serverUpdates.prevCards === null)) {
            this.prevCards.length = 0;
            if (!(serverUpdates.prevCards === 'new run')) {

                for (let i = 0; i < serverUpdates.prevCards.length; i++) {
                    var tempCard = new Card();
                    console.log(serverUpdates.prevCards[i]);
                    tempCard.fromJSON(serverUpdates.prevCards[i]);
                    console.log('temp card after push', tempCard);
                    this.prevCards.push(tempCard);
                }
            }

            this.displayPrevCards();
        }
        this.currPlayer = serverUpdates.currPlayer;
        this.nextPlayer = serverUpdates.nextPlayer;
        
        if (this.currPlayer == this.myName) {
            this.displayMyTurn();
        }
        else {
            this.displayNotMyTurn();
        }

	    this.displayPlayers();
    }

    /**
         * This method receives updates from the server when a round is over
         * and a new round will start.
         * 
         * @param serverUpdates dictionary containing the new current player, the next player, the
         * cards that were just played, and points
         */
    updateNewRound(serverUpdates) {
        console.log(serverUpdates);
        // clear current and previous cards
        this.myCards.length = 0;
        this.prevCards.length = 0;

	 var players = [];
	 
        // get new cards and players (for score updates)
        if(this.host === false){
            for (let i = 0; i < serverUpdates.myCards.cards.length; i++) {
                var tempCard = new Card();
                tempCard.fromJSON(serverUpdates.myCards.cards[i]);
                this.myCards.push(tempCard);
            }
            console.log(this.myCards);
	    for (let i = 0; i < serverUpdates.players.length; i++) {
                var tempPlayer = new Player();
                tempPlayer.fromJSON(serverUpdates.players[i]);
                players.push(tempPlayer);
            }
        }
        else{
            this.myCards = serverUpdates.myCards;
	       players = serverUpdates.players;
        }

       this.displayScores(players);
	 
        
        // get previous cards
        console.log(serverUpdates.prevCards);
        for (let i = 0; i < serverUpdates.prevCards.length; i++) {
            var tempCard = new Card();
            console.log(serverUpdates.prevCards[i]);
            tempCard.fromJSON(serverUpdates.prevCards[i]);
            this.prevCards.push(tempCard);
        }

        console.log(this.myCards);
        console.log(this.prevCards);

        this.currPlayer = serverUpdates.currPlayer;
        this.nextPlayer = serverUpdates.nextPlayer;

        // TODO: MICHELA -- display points on the screen
        this.points = serverUpdates.points;

        console.log(this.points);
        console.log(this.currPlayer);

        // display visuals and buttons on screen
        this.displayHand();
        if (this.currPlayer == this.myName) {
            this.displayMyTurn();
        }
        else {
            this.displayNotMyTurn();
        }
	    this.displayPlayers();
        this.displayPrevCards();


        // clear previous cards
        this.prevCards.length = 0;

        // wait for 5 seconds, then clear cards from display
        let wait = 5000;
        setTimeout(this.displayPrevCards.bind(this), wait);
    }

    // game is ending!!
    updateEndGame(pointsUpdate) {
        this.points = pointsUpdate;

        console.log(this.points);
        //this.displayScores();
    }

    endGame(playersInput){
	console.log("IN END GAME");
	document.getElementById("leave_game").classList.add("offscreen");
	document.getElementById("game_screen").classList.add("offscreen");
	document.getElementById("game_over").classList.remove("offscreen");
	var players = [];
	//if(this.host === false){
	console.log(playersInput);
	for (let i = 0; i < playersInput.length; i++) {
            var tempPlayer = new Player();
            tempPlayer.fromJSON(playersInput[i]);
            players.push(tempPlayer);
        }
       // }
	//else{
	  //  players = playersInput;
//	}
	var scoresHTML;
	var highestScore = null;
	var winner;
	var tie;
	for (let player of players){
        scoresHTML += "<p>" + player.getName() + ": " + player.getPoints() + "</p>";
	    if(highestScore == null || player.getPoints() < highestScore){
		highestScore = player.getPoints();
		winner = player.getName();
		tie = false;
	    }
	    else if(player.getPoints() === highestScore){
		if(tie){
		    winner.push(player.getName());
		}
		else{
		    winner = [winner, player.getName()];
		    tie = true;
		}
	    }
	}
	if(!tie){
	    console.log("NOT A TIE");
	    if(winner === this.myName){
		document.getElementById("winner").innerHTML = "YOU  WON!";
	    }
	    else{
		document.getElementById("winner").innerHTML = winner + " WON!"
	    }
	}
	else{
	    console.log("ITS A TIE");
	    scoresHTML = "TIE! ";
	    for(let i = 0; i < winner.length; i++){
    		if(!(i === winner.length - 1)){
    		    scoresHTML += winner + " AND ";
    		}
    		else{
    		    scoresHTML += winner + " ";
    		}
	    }
	    scoresHTML += "WON!";
	    document.getElementById("winner").innerHTML = scoresHTML;
		
        }
	console.log("PRINT SCORES");
        document.getElementById("score_data").innerHTML = scoresHTML;
    }

    getCardByFile(fileName){
        for (let i = 0; i < this.myCards.length; i++) {
            if(this.myCards[i].getFilePath() == fileName){
                return this.myCards[i];
            }
        }
        // card w/ given filename is not in the hand
        return false;
    }

    displayHand() {
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
        console.log("*** importort stuff", this.prevCards);
        if(!(this.prevCards.length === 0)){
            for (let card of this.prevCards) {
                console.log(card);
                let tag = '<img src="images/';
                tag += card.getFilePath();
                tag += '" class="played_card">';
                html += tag;
            }
        }
        console.log(html);
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

    displayPlayers() {
        document.getElementById("current_player").innerHTML = this.currPlayer + "'s turn";
        document.getElementById("next_player").innerHTML = "Next up: " + this.nextPlayer;
    }

    displayScores(players) {
        var html = "<p>Scores</p>"
        for (let player of players){
            html += "<p>" + player.getName() + ": " + player.getPoints() + "</p>";
        }
        document.getElementById("scores").innerHTML = html;
    }

    lessThanThreeAlert(player_name) {
        if(player_name !== this.myName){
            alert(player_name + " only has three cards left");
        }
    }

    playCards() {
        // MICHELA: get the card elements with the class name selected
        var htmlCards = document.getElementsByClassName("selected");
        var cards = [];

	//clear any potential error messages
	document.getElementById("error_message_game").innerHTML = "";

        console.log("***** in play cards *****");
        console.log(this);
        console.log(this.myName);
        console.log(this.myCards);

        console.log("AbOvE! Checking if the cards are still card objects");
        for (let htmlCard of htmlCards) {
            let src = htmlCard.src;
            src = src.split("images/"); // strip file to end of URL
            console.log("CARDS IN THE HTML ARE!!", src[src.length - 1]);    
            console.log(this.getCardByFile("classic/3D.jpg"));
            
            let tempCard = this.getCardByFile(src[src.length - 1]);
            if (!tempCard) {
                throw 'Selected card is not in the hand';
            }

            console.log(tempCard.getFilePath().split("/")[0]);

            var card = new Card(tempCard.getRank(), tempCard.getSuit(), tempCard.getFilePath().split("/")[0]);
            
            // TODO: rose!! this isn't working for participants, but is working for host 
            if (card == false){
                throw 'At least one card is not in the hand';
            }
            else {
                cards.push(card);
            }
	    }

        // check if the cards are valid to play based on rules
        // returns "valid" if valid, error message if not
        
        var validity = this.isValid(cards);
        //var validity = 'valid';
        console.log("CARDS TO BE PLAYED ARE:", cards);

        if (validity == "valid") {
            // removes cards from hand & redisplays locally
            this.removeCardsFromHand(cards); 
            // TEMP!! removed above line

            // send to server list of cards just played
            play_cards(cards);
        }
        else {
            // display value of validity on the player's screen
	        document.getElementById("error_message_game").innerHTML = validity;
        }
    }

    pass() {
        // send info to server --> fact that player did not play cards
            // HUIYUN: do we also need to send the player's name?
            //can we just check if the cards is empty?
            //Or do we want another data indicates whether player play or pass?
            play_cards();
    }

    removeCardsFromHand(playedCards) {
        var tempCards = [...this.myCards];

        // remove the cards
        for (let card of this.myCards) {
            for (let playedCard of playedCards) {
                if (card.getPriority() == playedCard.getPriority()) {
                    console.log(tempCards.indexOf(card));
                    tempCards.splice(tempCards.indexOf(card), 1);
                }
            }
        }

        console.log(tempCards);
        this.myCards = [...tempCards];

        // update the display
        this.displayHand();
    }

    isValid(cards) {
        // sort the cards to make sure they're in ascending order
        cards = cards.sort();  // TODO: I'm not sure if this will work this way

        // if it's the first turn, the player can only play the lowest card in their hand
        console.log(this);
        console.log(">>>>", this.firstTurn, "<<<<");
        if (this.firstTurn) {
            if (cards.length != 1) {
                return 'You may only play one card on the first turn';
            }
            else if (cards[0].getPriority() != this.myCards[0].getPriority()) {
                console.log("to play:", cards[0], "vs. lowest in hand:", this.myCards[0]);
                return 'You must play your lowest card on the first turn';
            }
            this.firstTurn = false;   // it is no longer the first turn
            return 'valid';
        }

        // check if played the same number of cards as prevPlayer
        if (this.prevCards.length != 0 && cards.length != this.prevCards.length) {
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
                    return 'all cards in a normal move must have the same rank';
                }
            }
            // if there were no previous cards, don't need to compare
            if (this.prevCards.length === 0) {
                return 'valid';
            }
            // check if valid with previous cards
            return this.isValidPriority(cards);
        }
        else if (cards.length == numPokerCardsPlayed){
            // check that this is a valid poker hand
            let pokerHand = this.isPokerHand(cards);
            console.log(pokerHand, "<<<");

            if (pokerHand == 'false') {
                return 'these cards do not make a valid poker hand';
            }
            else if (this.prevCards.length === 0) {
                // if there were no previous cards, don't need to compare
                return 'valid';
            }
            return this.isPokerMoveValid(cards, pokerHand);

        }
        return 'you must play between 1 and 5 cards';

        
    }

    isValidPriority(cards, prevCards = null) {
        const prioritySum = (accumulator, card) => accumulator + card.getPriority();
        let currPriority = cards.reduce(prioritySum, cards[0].getPriority());
        var prevPriority;

        console.log('cards to play are', cards)
        console.log(currPriority);
        if (prevCards == null) {
            prevPriority = this.prevCards.reduce(prioritySum, this.prevCards[0].getPriority()); 
            console.log('cards previously played are', this.prevCards)
            console.log(this.prevCards);
        }
        else {
            prevPriority = prevCards.reduce(prioritySum, prevCards[0].getPriority());
        }
        

        if (currPriority <= prevPriority) {
            return 'Cards must be higher than previously played cards';
        }

        return 'valid';
    }

    // checks if the cards being played are a valid poker hand
    isPokerHand(cards) {
        if (cards.length != 5) {
            return 'false';
        }
        var flushSuit = cards[0].getSuit();
        var prevRank = cards[0].getRank();

        // To Clean: check if they're all the same suit
        // or if all different suits

        var i;
        // check if STRAIGHT FLUSH / ROYAL FLUSH
        for (i = 1; i < cards.length; i++) {
            if ((cards[i].getSuit() == flushSuit) && (cards[i].getRank() == (prevRank + 1))) {
                prevRank = cards[i].getRank();
            }
            else {
                break;
            }
        }
        if (i == cards.length) {
            return 'sf';
        }

        // check if FOUR OF A KIND
        let sameCardCount = 1;
        prevRank = cards[0].getRank();
        for (i = 1; i < cards.length; i++) {
            if (sameCardCount == 4) {
                // 4 cards in a row
                return '4k';
            }
            else if (cards[i].getRank == prevRank) {
                // card is set, increase rank
                sameCardCount++;
            }
            else {
                // card is not set, set it and update rank
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

        for (i = 1; i < cards.length; i++) {
            if (cards[i].getRank() == firstRank) {
                // card is same as first card
                firstCardCount++;
                console.log('** in if');
                console.log(firstCardCount);
            }
            else if (secondRank == null) {
                // second rank is not set, set it and 
                // update count
                secondRank = cards[i].getRank();
                secondCardCount++;

                console.log('** in first else');
                console.log(secondRank);
            }
            else if (cards[i].getRank() == secondRank) {
                // second rank is set and card is same, 
                // update counts
                secondCardCount++;

                console.log('** in second else');
                console.log(secondCardCount);
            }
            else {
                // second rank is set, card is not same
                // thus not a full house
                console.log('** not a full house!!');
                break;
            }
        }
        if ((firstCardCount + secondCardCount) == 5) {
            return "fh";
        }


        // check if STRAIGHT
        prevRank = cards[0].getRank();

        for (i = 1; i < cards.length; i++) {
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
        if (i == cards.length) {
            return 's';
        }

        // check if FLUSH
        console.log('checking if flush');
        console.log(flushSuit);
        console.log(cards);
        for (i = 1; i < cards.length; i++) {
            // to be a flush, the cards must have the same suit
            if (!(cards[i].getSuit() == flushSuit)) {
                break; // not a flush, but could be another poker hand
            }
        }
        console.log(i);
        // check if we got to the end of the loop
        if (i == cards.length) {
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

        console.log('at the top of poker move valid');
        console.log(prevCards);
        console.log(currCards);

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
                return 'you must play a four of a kind or a straight flush';
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
                return 'you must play either: straight flush, four of a kind, or full house with higher three of a kind';
            case 's':
                if (currCards == 'sf' || currCards == '4k' || currCards == 'fh') {
                    return 'valid';
                }
                if (currCards == 's') {
                    // check that the lowest card is higher than the previous lowest card
                    if (cards[0].getRank() > this.prevCards[0].getRank()) {
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
                    let lastCard = 4; // since 5 card hands, 4 is last index

                    // check if rank of highest card is larger than previous highest card
                    if (cards[lastCard].getRank() > this.prevCards[lastCard].getRank()) {
                        return 'valid';
                    }
                    return 'your flush must have a higher card than the previous flush';
                }
                return 'you must play either: straight flush, four of a kind, full house, straight, or a flush with a higher last card';
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
