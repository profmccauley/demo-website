$(document).ready(function(){

    //JOIN GAME FROM LANDING PAGE
    $("#join_game").click(function(){
	var game_code = $("#game_code").val();
	var name = $("#name").val();
	$("#test").text("Game code: " + game_code + " Name: " + name);
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
	classes = this.className.split(" ");
	if(classes.length == 2){
	    $(this).css("transform", "translateY(-30px)").
		removeClass("unselected");
	}
	else{
	    $(this).css("transform", "translateY(0px)").
		addClass("unselected");
	}
    });

    
    
});
