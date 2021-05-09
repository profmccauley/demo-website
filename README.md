# How to play Moho Poker 
The server code is installed on the VM under the address "cs-vm-06.cs.mtholyoke.edu" in the directory "peng25h." The default setting of the client side connection is also under the address "cs-vm-06.cs.mtholyoke.edu."

### Steps to run the game on the virtual machine:
   1. connet to  Mount Holyoke VPN
   2. ssh into cs-vm-06.cs.mtholyoke.edu with your mhc id (i.e. march25m@cs-vm-06.cs.mtholyoke.edu)
   3. go to the directory "peng25h" in the VM and cd to the repository "group-project-moho-poker"
   4. run the command "python3 ggserver.py --serve-files" inside src directory to start the server
   5. go to the URL "http://cs-vm-06.cs.mtholyoke.edu:8080/templates/bigboy.html" to open the game
   6. type a gamecode and your name, and click "start new game" to create a game room
   7. give the gamecode to your friends and invite them to join your game room!   

### Steps to run the game locally:
   1. change the address from "cs-vm-06.cs.mtholyoke.edu" to "localhost" in the class Sender of Network.js
   2. run the command "python3 ggserver.py --serve-files" inside src directory to start the server
   3. go to the URL "http://localhost:8080/templates/bigboy.html" to open the game
   4. type the gamecode and your name, and click "start new game" to create a game room

# Directory structure
All our source files are stored in the src folder. Src folder contains two server files ggserver.py and ggwebsocket.py, and the web folder which contains the game logic, frontend, and client-side connection code. The web folder also contaiins the templates folder which holds the html files and an images folder which contains the images for both card decks in their own folders and the backround images used.

# Functionality
This project is a web application that allows users to play Moho Poker together with friends. Moho Poker is a new version of poker based on our customer's house rules, and cannot be found anywhere else on the internet. Our game works in a similar way to popular web games like Kahoot or Scriblio, where one user hosts a game and others join it by entering a game code that the host tells them. Once all the players are in a room together, the host can start the game and all players begin playing Moho Poker. The functionality we have implemented is listed in detail below.

### List of current functionality:
   * Users can start a game of poker from the main room. By starting a game, they are considered the "host" of the game
   * Participants can join a game from the main room by entering a game code told to them by the host (via text, voice call, etc)
   * Hosts and participants are able to set their name before joining. Only one word names are currently allowed
   * Hosts can choose which deck to play with while in the waiting room. This deck will be displayed for all players
   * There are only 2 - 4 players allowed in each game. A host is not able to start a game with less than 2 players, and the game room is capped at 4 (if a fifth person tries to join, they will be blocked from entry)
   * Hosts can choose how many rounds to play for while in the waiting room
   * Once enough players have joined, the host is able to start the game. 
      * All players are dealt random cards and gameplay begins. Each player seens their own cards on their screen
   * As gameplay moves between players, the UI of each player will be updated with the most recently played cards and whose turn it is
   * The UI also includes a button to access the rules of the game on a new tab, so players can check the rules at any time
   * During gameplay, players are only able to play valid cards based on the rules of Moho Poker (note: detailed rules are written on the Rules page of the website)
      * If they attempt to play an invalid card, they will be prompted to try again and shown an error message that briefly lists what was wrong.
   * At the end of a round (when one player gets rid of their cards) scores will be updated and displayed on the screen
   * When the game is complete (based on the number of rounds the host set), all players are directed to a screen that shows the winner and the final scores


# Known problems
Sometimes players don't recognize they're in the same room, and the repeating gamecode from the previous round won't work when there are multiple players join or exit games at the same time. Users may need to restart the server and refresh the web page when these happen. 

# Changes made from the orignal plan
We made no changes from our original plan. We implemented the essential features of our project as requested by our client and specified in our requirements document. However, we did make changes to our timeline: we did not get to implement some of the lower priority features that we planned for, such as allowing users to create accounts through our website and provide images to build their own Moho poker decks.
