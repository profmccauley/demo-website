# How to play Moho Poker 
The server code is installed on the VM under the address "cs-vm-06.cs.mtholyoke.edu" in the directory "peng25h." The default setting of the client side connection is also under the address "cs-vm-06.cs.mtholyoke.edu."

### Steps to run the game on the virtual machine:
   1. connet to  Mount Holyoke VPN
   2. go to the directory "peng25h" in the VM and cd to the repository "group-project-moho-poker"
   3. run the command "python3 ggserver.py --serve-files" inside src directory to start the server
   4. go to the URL "http://cs-vm-06.cs.mtholyoke.edu:8080/templates/bigboy.html" to open the game
   5. type a gamecode and your name, and click "start new game" to create a game room
   6. give the gamecode to your friends and invite them to join your game room!   

### Steps to run the game locally:
   1. change the address from "cs-vm-06.cs.mtholyoke.edu" to "localhost" in the class Sender of Network.js
   2. run the command "python3 ggserver.py --serve-files" inside src directory to start the server
   3. go to the URL "http://localhost:8080/templates/bigboy.html" to open the game
   4. type the gamecode and your name, and click "start new game" to create a game room

# Directory structure
All our source files are stored in the src folder. Src folder contains two server files ggserver.py and ggwebsocket.py, and the web folder which contains the game logic, frontend, and client-side connection code.

# Functionality

# Known problems

# Changes made from the orignal plan
We made no changes from our original plan. We implemented the essential features of our project as requested by our client and specified in our requirements document. However, we did make changes to our timeline: we did not get to implement some of the lower priority features that we planned for, such as allowing users to create accounts through our website and provide images to build their own Moho poker decks.
