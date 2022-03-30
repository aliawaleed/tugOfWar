let socket = io(); //opens and connects to the socket

//listen for confirmation of socket
socket.on('connect', () => {
    console.log("client connected via sockets");
})

socket.on('player1', () => {
    player1 = "Hello player 1! Please wait for another player to join!";
    let inst = document.getElementById('instructions');
    inst.textContent = player1;
})

socket.on('player2', (player2) => {
    player2 = "Hello player 2! Use the right arrow key to win! ";
    let inst = document.getElementById('instructions');
    inst.textContent = player2;
})

socket.on('morePlayers', (morePlayers) => {
    morePlayers = "Please wait! There are 2 players in the game already!";
    let inst = document.getElementById('instructions');
    inst.textContent = morePlayers;
})

socket.on('message', () => {
    let inst = document.getElementById('instructions');
    inst.textContent = "Another player has joined. Use the left arrow key to win! ";
})

//////////////////p5 code//////////////////
//global variables
let s = 'Game Over!';
let x = -350;
let y = 265;
let rope;
let garden;
let cloth;

function preload() {
    rope = loadImage('rope.png');
    garden = loadImage('garden.png');
    cloth = loadImage('cloth.png');
}

function setup() {
    var canvas = createCanvas(800, 600);
    canvas.parent('p5');
    background(garden);
    //have the rope initialized on the screen
    fill(238, 210, 100)
    stroke(255, 204, 0);
    strokeWeight(3);
    triangle(380, 360, x + 750, 310, 420, 360);
    image(rope, x - 100, y, 1800, 100);
    socket.on('positionDataFromServer', (data) =>{ //send to all clients
        drawData(data);
    })
}

function keyPressed() {
    if (keyIsDown(RIGHT_ARROW)) { //if right arrow key is pressed, move to the right
        x += 20;                      
    }
    if (keyIsDown(LEFT_ARROW)) { //if left arrow key is pressed, move to the left
        x -= 20;                      
    }
    let pos = {x: x};
    //emit this information to the server
    socket.emit('positionData', pos);//send to all the connected clients
}

function drawData(pos) {
    background(garden)
    x = pos.x;
    console.log(x)
    fill(238, 210, 100)
    stroke(255, 204, 0);
    strokeWeight(3);
    triangle(pos.x + 730, 360, pos.x + 750, 310, pos.x + 770, 360);
    image(rope, x - 100, y, 1800, 100);
    if (pos.x + 750 < 0 || pos.x + 750 > 800){
        background(139,0,0);
        textSize(32);
        fill(255);
        noStroke();
        text(s, 300, 320);
        if (pos.x + 750 < 0){
            let winner = "Player 1 won!";
            text(winner, 290, 360);
        }
        if (pos.x + 750 > 800){
            let winner = "Player 2 won!";
            text(winner, 290, 360);
        }
    }
}
