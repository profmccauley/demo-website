// This class controls methods specific to the waiting room

export default class WaitingRoom{
	constructor(){
		this.players = [];
	}

    /**
       This method is called when a player is added to the waiting room in order to display all
       players in the waiting room
    */
	add_player(player_name){
		this.players.push(player_name);
		console.log("players: " + this.players);
		this.display_players();
	}

    /**
       This method loops throgh the players instance variable and adds all players to the display
    */
	display_players(){
	    var html = "";
	    for (let player of this.players){
			html += "<p>" + player + "</p>";
		}
		document.getElementById("players").innerHTML = html;
	}

    /**
       This method moves a player out of the waiting room and onto the gameplay screen
    */
	leave_waiting_room(){
		var room = document.getElementById("room_name").innerHTML;
		document.getElementById("waiting_room").classList.add("offscreen");
		document.getElementById("game_screen").classList.remove("offscreen");
		document.getElementById("room_name_game").innerHTML = "Game " + room;
	}

    /**
       This method shows an error if a user tries to submit a fill in the blank
       "play to" choice, but doesn't fill in the blank or submits something that is
       not a number
    */
    show_error(){
	document.getElementById("error_message").innerHTML = "Please enter a number";
    }
}

