var players = [];

export function add_player(player_name){
	console.log("ADDING ", player_name, "TO THE WAITING ROOM!!!");
	players.push(player_name);
	console.log("players: " + players);
	display_players();
}

function display_players(){
    var html = "";
    for (let player of players){
		html += "<p>" + player + "</p>";
	}
	document.getElementById("players").innerHTML = html;
}

export default function leave_waiting_room(){
	console.log("reached leave_waiting_room function");
	var room = document.getElementById("room_name").innerHTML;
	document.getElementById("waiting_room").classList.add("offscreen");
	document.getElementById("game_screen").classList.remove("offscreen");
	document.getElementById("room_name_game").innerHTML = "Game " + room;
}

window.add_player = add_player;
window.leave_waiting_room = leave_waiting_room;
