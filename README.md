# 67328-final
67328 Final Project

Ever wanted to study for finals together with your friends, but you can’t seem to find a room with a white board that’s free? Well now there’s no need to waste your precious studying time with worrying about where to study with the Online Whiteboard! This application allows people to collaborate together for any reason they choose by giving them a common environment to express their creativity and share their ideas. This application allows you to easily create and join rooms that may already exist and immediately be up to speed on all the things your group may have been working on. This application is a virtual whiteboard where everyone in your group can be working at once.


As shown above, as a user in a room draws, everyone else in the room can see the change, and also contribute as well.
I use websockets to transmit the drawing and the status of the canvas.
My application is all about coordinating live collaboration between users as they work together on their “whiteboard”.
My application control flow is separated into three parts. The model takes care of the users stored in the mongoDB, and the routes.js file takes care of all the page requests and the socket.io. Finally, I have views that are rendered by the controller for front end usage.
Users must login in order to use the whiteboards, and I do this using express sessions.
User information is stored on the database so that past users can come back and log back onto their previously made accounts.
Both desktop and mobile usage are the same. This was achieved by accounting for mouse events to trigger the drawing on the whiteboard.
The canvas is much smaller. However, the use case is still the same, and we achieved this by accounting for touch events to trigger the drawing on the whiteboard.
https://final-fhzesprtvt.now.sh
Html files only contain html, while javascript files contain javascript, and neither of those do any of the styling for the pages.
All page requests are done through get requests, and forms are dealt with with post requests.
Code is clearly written.
Sign Up and Login are both supported and done using passport. Non-logged in users are unable to access any of the internal pages.


