export default class WaitingRoom{
	constructor(){
		this.players = [];
	}

	add_player(player_name){
		console.log("ADDING ", player_name, "TO THE WAITING ROOM!!!");
		this.players.push(player_name);
		console.log("players: " + this.players);
		this.display_players();
	}

	display_players(){
	    var html = "";
	    for (let player of this.players){
			html += "<p>" + player + "</p>";
		}
		document.getElementById("players").innerHTML = html;
	}

	leave_waiting_room(){
		console.log("reached leave_waiting_room function");
		var room = document.getElementById("room_name").innerHTML;
		document.getElementById("waiting_room").classList.add("offscreen");
		document.getElementById("game_screen").classList.remove("offscreen");
		document.getElementById("room_name_game").innerHTML = "Game " + room;
	}

	// export default {add_player, leave_waiting_room};
	// window.add_player = add_player;
	// window.leave_waiting_room = leave_waiting_room;
}

