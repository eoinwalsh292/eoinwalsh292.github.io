"use strict";

/*
    Sokoban game using HTML canvas
    
*/


// position class made to store players position numerically
class position{
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
var player = new position(0, 0);
var goalNo, instructionsToggle=0;

// level array set below to display game name
// character legend:
// # = wall
// 8 = player
// _ = floor
// + = box
// @ = goal
// ! = box on goal
// ~ = player on goal

// initialise level array as below to double as the title screen
var level = [
    ['+','+','+','.','+','+','+','.','+','.','+','.','+','+','+'],
    ['+','.','.','.','+','.','+','.','+','.','+','.','+','.','+'],
    ['+','+','+','.','+','.','+','.','+','+','.','.','+','.','+'],
    ['.','.','+','.','+','.','+','.','+','.','+','.','+','.','+'],
    ['+','+','+','.','+','+','+','.','+','.','+','.','+','+','+'],
    ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
    ['.','.','#','#','#','.','.','#','.','.','#','#','#','.','.'],
    ['.','.','#','.','#','.','#','.','#','.','#','.','#','.','.'],
    ['.','.','#','#','.','.','#','#','#','.','#','.','#','.','.'],
    ['.','.','#','.','#','.','#','.','#','.','#','.','#','.','.'],
    ['.','.','#','#','#','.','#','.','#','.','#','.','#','.','.']
]

$(document).ready(loadGame);


// loadGame removes 'Loading...' from the page and initialises the menu for choosing levels
//    first the loading section is replaced, then the level & instructions buttons are added
//    runs levelDisplay() at the end to bring up the title / playing area
function loadGame() {
    $("#main").text("Please choose a level:");

    var menu = document.getElementById("menu");

    // only specific change for more levels is below for loop, otherwise levels can be added as arrays to chooseLevel function with associated choice number
    for(var i=0;i<5;i++){
        var add = document.createElement("button");
        add.innerHTML = "Level "+(i+1);
        add.setAttribute("onclick", "chooseLevel("+(i+1)+")");
        menu.appendChild(add);
    }

    add = document.createElement("button");
    add.innerHTML = "Instructions";
    add.setAttribute("onclick", "instructions()");
    menu.appendChild(add);

    levelDisplay();
}


// instructions opens and closes a textbox containing instructions for the game
//     instructionsToggle prevents multiple instances of the instructions box from appearing
function instructions() {
    if(instructionsToggle == 0) {
        var text = document.createElement("div");
        text.id = "instructions";
        text.textContent = "Sokoban is a puzzle game. You are the blue dot, and must push the brown boxes onto the pink circles. Boxes must be pushed from behind, and only 1 box can be pushed at a time. Use the arrow keys to move!";
        document.body.appendChild(text);
        instructionsToggle = 1;
    } else {
        document.getElementById("instructions").remove();
        instructionsToggle = 0;
    }
}


// chooseLevel is called by the buttons in the menu to assign the desired level layout to the level array
//     player position and number of goals are dynamically populated once the level is chosen
//     special case: level 0 is the win screen
function chooseLevel(choice) {
    // Check choice from game homepage
    // Set arrays depending on choice (box pos, goal pos, wall pos)
    if(choice == 1){
        level = [
            ['.','.','#','#','#','#','#','.'],
            ['#','#','#','_','_','_','#','.'],
            ['#','@','8','+','_','_','#','.'],
            ['#','#','#','_','+','@','#','.'],
            ['#','@','#','#','+','_','#','.'],
            ['#','_','#','_','@','_','#','#'],
            ['#','+','_','!','+','+','@','#'],
            ['#','_','_','_','@','_','_','#'],
            ['#','#','#','#','#','#','#','#']
        ]
    }else if(choice == 2){
        level = [
            ['.','.','.','.','#','#','#','#','#','.','.','.','.','.','.','.','.','.','.','.','.','.'],
            ['.','.','.','.','#','_','_','_','#','.','.','.','.','.','.','.','.','.','.','.','.','.'],
            ['.','.','.','.','#','+','_','_','#','.','.','.','.','.','.','.','.','.','.','.','.','.'],
            ['.','.','#','#','#','_','_','+','#','#','#','.','.','.','.','.','.','.','.','.','.','.'],
            ['.','.','#','_','_','+','_','_','+','_','#','.','.','.','.','.','.','.','.','.','.','.'],
            ['#','#','#','_','#','_','#','#','#','_','#','.','.','.','.','.','#','#','#','#','#','#'],
            ['#','_','_','_','#','_','#','#','#','_','#','#','#','#','#','#','#','_','_','@','@','#'],
            ['#','_','+','_','_','+','_','_','_','_','_','_','_','_','_','_','_','_','_','@','@','#'],
            ['#','#','#','#','#','_','#','#','#','#','_','#','8','#','#','#','#','_','_','@','@','#'],
            ['.','.','.','.','#','_','_','_','_','_','_','#','#','#','.','.','#','#','#','#','#','#'],
            ['.','.','.','.','#','#','#','#','#','#','#','#','.','.','.','.','.','.','.','.','.','.']
        ]
    }else if(choice == 3){
        level = [
            ['#','#','#','#','#','#','#','#','#','#','#','#','.','.'],
            ['#','@','@','_','_','#','_','_','_','_','_','#','#','#'],
            ['#','@','@','_','_','#','_','+','_','_','+','_','_','#'],
            ['#','@','@','_','_','#','+','#','#','#','#','_','_','#'],
            ['#','@','@','_','_','_','_','8','_','#','#','_','_','#'],
            ['#','@','@','_','_','#','_','#','_','_','+','_','#','#'],
            ['#','#','#','#','#','#','_','#','#','+','_','+','_','#'],
            ['.','.','#','_','+','_','_','+','_','+','_','+','_','#'],
            ['.','.','#','_','_','_','_','#','_','_','_','_','_','#'],
            ['.','.','#','#','#','#','#','#','#','#','#','#','#','#']
        ]
    }else if(choice == 4){
        level = [
            ['.','.','.','.','.','.','.','.','#','#','#','#','#','#','#','#','.'],
            ['.','.','.','.','.','.','.','.','#','_','_','_','_','_','8','#','.'],
            ['.','.','.','.','.','.','.','.','#','_','+','#','+','_','#','#','.'],
            ['.','.','.','.','.','.','.','.','#','_','+','_','_','+','#','.','.'],
            ['.','.','.','.','.','.','.','.','#','#','+','_','+','_','#','.','.'],
            ['#','#','#','#','#','#','#','#','#','_','+','_','#','_','#','#','#'],
            ['#','@','@','@','@','_','_','#','#','_','+','_','_','+','_','_','#'],
            ['#','#','@','@','@','_','_','_','_','+','_','_','+','_','_','_','#'],
            ['#','@','@','@','@','_','_','#','#','#','#','#','#','#','#','#','#'],
            ['#','#','#','#','#','#','#','#','.','.','.','.','.','.','.','.','.']
        ]
    }else if(choice == 5){
        level = [
            ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','#','#','#','#','#','#','#','#'],
            ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','#','_','_','@','@','@','@','#'],
            ['.','.','.','#','#','#','#','#','#','#','#','#','#','#','#','_','_','@','@','@','@','#'],
            ['.','.','.','#','_','_','_','_','#','_','_','+','_','+','_','_','_','@','@','@','@','#'],
            ['.','.','.','#','_','+','+','+','#','+','_','_','+','_','#','_','_','@','@','@','@','#'],
            ['.','.','.','#','_','_','+','_','_','_','_','_','+','_','#','_','_','@','@','@','@','#'],
            ['.','.','.','#','_','+','+','_','#','+','_','+','_','+','#','#','#','#','#','#','#','#'],
            ['#','#','#','#','_','_','+','_','#','_','_','_','_','_','#','.','.','.','.','.','.','.'],
            ['#','_','_','_','#','_','#','#','#','#','#','#','#','#','#','.','.','.','.','.','.','.'],
            ['#','_','_','_','_','+','_','_','#','#','.','.','.','.','.','.','.','.','.','.','.','.'],
            ['#','_','+','+','#','+','+','_','8','#','.','.','.','.','.','.','.','.','.','.','.','.'],
            ['#','_','_','_','#','_','_','_','#','#','.','.','.','.','.','.','.','.','.','.','.','.'],
            ['#','#','#','#','#','#','#','#','#','.','.','.','.','.','.','.','.','.','.','.','.','.']
        ]
    }else if(choice == 0){
        level = [
            ['#','.','.','.','#','.','#','#','#','.','#','.','.','#','.','#'],
            ['#','.','.','.','#','.','.','#','.','.','#','.','.','#','.','#'],
            ['#','.','.','.','#','.','.','#','.','.','#','#','.','#','.','#'],
            ['#','.','#','.','#','.','.','#','.','.','#','.','#','#','.','#'],
            ['#','#','.','#','#','.','.','#','.','.','#','.','.','#','.','.'],
            ['#','.','.','.','#','.','#','#','#','.','#','.','.','#','.','#'],
        ]
    }

    if(choice != 0){
        goalNo = 0;
        for(var i=0;i<level.length;i++){
            for(var j=0;j<level[i].length;j++){
                if(level[i][j] == '@' || level[i][j] == '!' || level[i][j] == '~'){
                    goalNo++;
                }else if(level[i][j] == '8'){
                    player.x = i;
                    player.y = j;
                }
            }
        }
    }else{
        goalNo = -1;
        player.x = -1;
        player.y = -1;
    }

    console.log("Goal No. = "+goalNo);

    levelDisplay();
}


// levelDisplay holds the code for creating the canvas on which the game is played
//     function listens for an arrow key being pressed and calls movePlayer when it is
//     it reads through the level array and creates an appropriately coloured square in the same place as in the array
//     also checks if the goal squares are all complete (checkGoal), if so it goes to win screen
//     (CSS is chosen so that width and height of the game area is as big as the largest level)
function levelDisplay() {
    document.onkeydown = movePlayer;

    // canvas is fully wiped and recreated with each change
    var c = document.getElementById("canvas");

    var ctx = c.getContext("2d");

    var width = level[0].length * 30;
    var height = level.length * 30;

    c.setAttribute("width", width);
    c.setAttribute("height", height);
    ctx.clearRect(0,0,width,height);
    
    // for loop goes over each possible position in the array
    for(var i=0;i<level.length;i++){
        for(var j=0;j<level[i].length;j++){
            // First the position's border
            ctx.beginPath();
            ctx.rect(j * 30, i * 30, 30, 30);
            ctx.closePath();
            ctx.strokeStyle = "black";
            ctx.stroke();
            
            // Second it checks the fill colour
            if(level[i][j] == '#') {
                ctx.fillStyle = "darkgrey";
                ctx.fill();
            } else if(level[i][j] == '+') {
                ctx.fillStyle = "peru";
                ctx.fill();
            }else if(level[i][j] == '!') {
                ctx.fillStyle = "saddlebrown";
                ctx.fill();
            } else {
                ctx.fillStyle = "beige";
                ctx.fill();
            }
            
            // Last it checks if the player or a goal needs to be drawn
            if(level[i][j] == '8') {
                drawPlayer(ctx,i,j);
            }
            else if(level[i][j] == '@') {
                drawGoal(ctx,i,j);
            }
            else if(level[i][j] == '~') {
                drawPlayer(ctx,i,j);
                drawGoal(ctx,i,j);
            }
        }
    }

    if(checkGoal(goalNo) == 1){
        chooseLevel(0);
    }
}
function drawGoal(ctx,i,j){
    ctx.beginPath();
    ctx.arc(j * 30 + 15, i * 30 + 15, 7, 0, 360);
    ctx.closePath();
    ctx.strokeStyle = "red";
    ctx.stroke();
    ctx.fillStyle = "pink";
    ctx.fill();
    }
function drawPlayer(ctx,i,j){
    ctx.beginPath();
    ctx.arc(j * 30 + 15, i * 30 + 15, 12, 0, 360);
    ctx.closePath();
    ctx.strokeStyle = "blue";
    ctx.stroke();
    ctx.fillStyle = "blue";
    ctx.fill();
    }


// movePlayer is called from levelDisplay when an arrow key is pressed
//     appropriate coordinate difference is applied depending on key pressed
//     this info is passed into checkFloor
//     once checkFloor is complete levelDisplay is run again
function movePlayer(e) {
    var x = 0;
    var y = 0;
    switch(e.key){
        case 'ArrowUp':
            x=-1;
            break;
        case 'ArrowDown':
            x=1;
            break;
        case 'ArrowLeft':
            y=-1;
            break;
        case 'ArrowRight':
            y=1;
            break;
    }

    checkFloor(x,y);

    levelDisplay();
}


// checkFloor takes directional info from movePlayer
//     first it checks if the desired square is empty floor, if so player is moved
//     if it is not empty, it checks if it is a box, if so moveBox is run
//     after these 2 checks, the function then checks where the player moved from
//         if it should be empty floor, it is reassigned as empty floor
//         if it should be a goal space, it is reassigned as a goal space
function checkFloor(x,y) {
    let newX = player.x + x, newY = player.y + y;
    // first checking if space where player wants to move to is floor or goal
    if((level[newX][newY]) == '_' || (level[newX][newY]) == '.'){
        player.x += x;
        player.y += y;
        level[(player.x)][(player.y)] = '8';
    }else if(level[newX][newY] == '@'){
        player.x += x;
        player.y += y;
        level[(player.x)][(player.y)] = '~';
    } // if neither, check if it's a box (on its own or on a goal)
    else if(level[newX][newY] == '+' || level[newX][newY] == '!'){
        moveBox(x,y);
    }

    let oldX = player.x - x, oldY = player.y - y;
    // last, clean up previous player position if necessary (always run just in case)
    if(level[oldX][oldY] == '8'){
        level[oldX][oldY] = '_';
    }else if(level[oldX][oldY] == '~'){
        level[oldX][oldY] = '@';
    }
}


// moveBox takes the directional info from checkFloor
//     first it checks;
//         whether the desired space is a box (on a goal or on its own)
//         whether the space after the box is a wall, box, or box on goal
//     if so, it checks if the player is about to stand on empty floor or a goal and marks the space appropriately
//     then it checks if the box is about to be on empty floor or a goal, and marks the space appropriately
function moveBox(x, y) {
    let newX = player.x + x, newY = player.y + y;
    // check if box, and that the new position is empty (i.e. not a box or wall or box-on-goal)
    if((level[newX][newY] == '+' || level[newX][newY] == '!') && level[newX + x][newY + y] != '+' && level[newX + x][newY + y] != '#' && level[newX + x][newY + y] != '!'){
        if(level[newX][newY] == '!'){
            level[newX][newY] = '~';
        }else{
            level[newX][newY] = '8';
        }

        player.x += x;
        player.y += y;

        if(level[newX + x][newY + y] == '_'){
            level[newX + x][newY + y] = '+';
        }else if(level[newX + x][newY + y] == '@'){
            level[newX + x][newY + y] = '!';
        }
    }
}


// checkGoal takes in the number of goal spaces from the initial level layout (number is populated when chooseLevel is run)
//     checks through the level array
//         it immediately returns 0 if a goal space without a box is found
//         it counts the number of boxes on goals until that point
//     if there is no more empty goal spaces and the count is equal to goal spaces, it returns 1
function checkGoal(goalNo) {
    var count = 0;

    for(var i=0;i<level.length;i++){
        for(var j=0;j<level[i].length;j++){
            if(level[i][j] == '@' || level[i][j] == '~'){
                return 0;
            }else if(level[i][j] == '!'){
                count++;
            }
        }
    }

    if(count == goalNo){
        return 1;
    }
}