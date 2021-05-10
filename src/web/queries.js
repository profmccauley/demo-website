/**
   This file holds all the jquery statements for the project.
   JQUERY statements control joining/starting game rooms, selecting/unselecting cards,
   starting gameplay from the waiting room, game ending, and opening the rules page
*/

$.getScript("../Network.js", function() {
   console.log("Script loaded.");
});

$(document).ready(function(){

    //JOIN GAME FROM LANDING PAGE
    $("#join_game").click(function(){

	async function connection(){
    	    let join = await get_join_status();
    	    console.log("join_success: " + join);
    	    if(join === 0){
	    		var game_code = $("#game_code").val();
				var name = $("#player_name").val();
	    		$("#homepage").addClass("offscreen");
			$("#waiting_room").removeClass("offscreen");
			$("#host_specific").css('display', 'none');
			$("#player_specific").css('display', 'block');
			$("#room_name").text("Room: " + game_code);
			//player_view = new PlayerView(name);
		
    	    }
    	    else if (join === 1){
	    		setTimeout( connection, 500);
	    		$("#test").text("Trying to join the game");
    	    } else if(join === 2){
    	    	$("#test").text("Unable to join this game. Try again with another name.");
    	    } else if(join === 3){
    	    	$("#test").text("Unable to join this game. Try again with another game code.");
    	    } 
    	}
    	connection();
    });

    //START GAME ROOM FROM LANDING PAGE
    $("#start_game").click(function(){
    	async function connection(){
    		let join = await get_join_status();
    		if(join === 0){
    		    var game_code = $("#game_code").val();
		    var name = $("#player_name").val();
    		    $("#homepage").addClass("offscreen");
		    $("#waiting_room").removeClass("offscreen");
		    $("#host_specific").css('display', 'block');
		    $("#player_specific").css('display', 'none');
		    $("#room_name").text("Room: " + game_code);
		    
    		}
    		else if (join === 1){
	    		setTimeout( connection, 500);
	    		$("#test").text("Trying to start the game");
    	    } else if(join === 2){
    	    	$("#test").text("Unable to start this game. Try again with another name.");
    	    } else if(join === 4){
    	    	$("#test").text("Unable to start this game. Try again with another game code.");
    	    }
    	}
    	connection();
    });

    //SELECT/UNSELECT CARD
    $(document).on('click', '.player_card', function(){
		var classes = this.className.split(" ");

		if(classes.indexOf("unselected") != -1){
			$(this).css("transform", "translateY(-30px)").
			removeClass("unselected"). 
			addClass("selected");
		}
		else{
			$(this).css("transform", "translateY(0px)").
			removeClass("selected").
			addClass("unselected");
		}
    });

    //START GAME PLAY
    $(document).on('click', '#play_game', function(){
    	if(get_player_number() >= 2){
    		var room = $("#room_name").text();
			$("#waiting_room").addClass("offscreen");
			$("#game_screen").removeClass("offscreen");
			$("#room_name_game").text("Game " + room);
			$("#leave_game").removeClass("offscreen");
    	}
    	else{
    		console.log("Please wait for other players to join the game.");
    		$("#test").text("Please wait for other players to join the game.");
    	}

    });

    //HOST ENDS GAME VIA END GAME BUTTON
    $("#leave_game").click(function(){
	$("#leave_game").addClass("offscreen");
	$("#game_screen").addClass("offscreen");
	$("#game_over").removeClass("offscreen");
    });

    //SENDING USER BACK TO HOMESCREEN AFTER GAME IS ENDED BY HOST
    $(".back_to_home").click(function(){
	$("#game_over").addClass("offscreen");
	$("#homepage").removeClass("offscreen");
	$("#test").text("");
    });

    //OPEN RULES PAGE
    $(".get_rules").click(function(){
	window.open('rules.html');
    });
    
    
});
