$.getScript("../Network.js", function() {
   console.log("Script loaded.");
});

$(document).ready(function(){

    //var player_view;

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

    //START GAME (currently from landing page)
    $("#start_game").click(function(){
    	async function connection(){
    		let join = await get_join_status();
    		console.log("start_success: " + join);
    		if(join === 0){
    		    var game_code = $("#game_code").val();
		    var name = $("#player_name").val();
    		    $("#homepage").addClass("offscreen");
		    $("#waiting_room").removeClass("offscreen");
		    $("#host_specific").css('display', 'block');
		    $("#player_specific").css('display', 'none');
		    $("#room_name").text("Room: " + game_code);
		    //player_view = new PlayerView(name, true);
		    
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
	//INSERT SERVER CODE HERE
    });

    //CLICK LANDING PAGE LOGIN BUTTON
    $("#login").click(function(){
	$(location).attr('href', "login.html");
    });

    //CLICK LANDING PAGE SIGN UP BUTTON
    $("#register").click(function(){
	$(location).attr('href', "register.html");
    });

    //SIGN IN
    $("#sign_in").click(function(){
	var identifier = $("#identifier").val();
	var password = $("#password").val();
	$("#test").text("Email/Username: " + identifier + " Password: " + password);
	//Validate login details (from database)
	//change page to the user home page
    });

    //SIGN UP
    $("#sign_up").click(function(){
	var email = $("#email").val();
	var user = $("#username").val();
	var password = $("#password").val();
	var passwordRetype = $("#password2").val();
	if(password != passwordRetype){
	    $("#error").text("Passwords do not match");
	}
	//Check that email is not already associated w/ account
	//Add user info to database
	//change page to the login
	$("#test").text("Email: " + email + " User: " + user + " Password: " + password);
    });

    //SELECT/UNSELECT CARD
    $(document).on('click', '.player_card', function(){
		console.log("hello we are in the card selection function");
		var classes = this.className.split(" ");

		console.log("THE CARD SELECTION CLASSES ARE:", classes.indexOf("unselected"));

		if(classes.indexOf("unselected") != -1){
			console.log("card is being shifted up");
			$(this).css("transform", "translateY(-30px)").
			removeClass("unselected"). 
			addClass("selected");
		}
		else{
			$(this).css("transform", "translateY(0px)").
			removeClass("selected").
			addClass("unselected");
		}

		/* if(classes.length == 2){
			$(this).css("transform", "translateY(-30px)").
			removeClass("unselected"); 
		}
		else{
			$(this).css("transform", "translateY(0px)").
			addClass("unselected");
		} */
    });

    //START GAME ROOM (GAMEPLAY)
    $("#play_game").click(function(){
    	console.log(get_player_number());
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

    $(".get_rules").click(function(){
	window.open('rules.html');
    });
    
    
});
