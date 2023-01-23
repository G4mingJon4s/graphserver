# Graphserver

This is a socket.io express back-end with a react + vite front-end.
The front-end shows the current data of the back-end and offers realtime updates of the graph.

## Usage

#### Back-end:
	Dev: ../graphserver/back-end> nodemon --ignore ./data/ index.js
	Final: ../graphserver/back-end/ node index.js
	
#### Front-end:
	Dev: ../graphserver/front-end/> npm run dev
	Build: ../graphserver/front-end> npm run build
	
## API

#### The `/api` route of the back-end offers the following methods:
	Post: The attached JSON object will override any currently stored data.
	Put: The attached JSON object will be appended to the currently stored data.
	Get: Sends back the currently stored data.
	Delete: Deletes the currently stored data.
	
## Current Usecase

The graphserver is currently made to recieve new values of some data. There only exists one file inside the `data` folder in the back-end.
