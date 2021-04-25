var players = [];

export default function add_player(player_name){
	players.push(player_name);
	console.log("players: " + players);
	display_players();
}

function display_players(){
	var html = "";
	for (let player of players){
		html += "<p>" + player + "</p>";
	}
	document.getElementById("cards").innerHTML = html;
}

window.add_player = add_player;