//to serve public folder
let express = require('express');
let http = require('http'); //include http server
let io = require('socket.io'); //include the sockets 

//in the following order
let app = express();
let server = http.createServer(app); //wrap express app with http 
io = new io.Server(server); // use socket.io on the http app

app.use('/', express.static('public'));

////////////////////////////sockets////////////////////////////
let connections = 0;
let players = [];
//socket connection
io.sockets.on('connect', (socket) => {
    players.push(socket.id);
    console.log("we have a new client: ", socket.id);
    //if this particular socket disconnects
    socket.on('disconnect', () => { 
        console.log("socket has been disconnected ", socket.id);
        connections --;
        for( var i = 0; i < players.length; i++){ 
            if (players[i] === socket.id) { 
                players.splice(i, 1); 
                console.log("The clients left are: ", players);
            }
        }
    })

    //listen for a message from this client
    socket.on('positionData', (pos) => {
        io.sockets.emit('positionDataFromServer', pos); //send the same data back to all clients
    })

    if (connections == 0){
        console.log("This is client 1 ", socket.id);
        socket.emit('player1', '');
    }
    else if (connections == 1){
        console.log("This is client 2 ", socket.id);
        socket.emit('player2', ''); 
        io.to(players[0]).emit('message', '');
    }
    else{
        console.log("This is client: ", connections + 1, socket.id);
        socket.emit('morePlayers', ''); 
    }

    connections ++;
})

//listen on port 9500
server.listen(9500, () => {
    console.log("server is up and running on port 9500")
})

// //on glitch add the following and remove the previous
// let port = process.env.PORT || 3000;
// server.listen(port, () => {
//     console.log("Server listening at port: " + port);
// });