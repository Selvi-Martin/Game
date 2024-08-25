var ocean = ["octopus","shell", "jelly","lildol","snail"];
var board = [];
var row=9;
var column=9;
var score =0;
var curtile;    //1st fish (src)
var othertile;  //2nd fish (dest)
var startTime;
var startTime;
var elapsedTime=0;
var timerInterval;
var level;
var timeLimit;
var winsound=new Audio('./img/win.mp3');
var crushsound=new Audio('./img/crush.mp3');
var fullsound=new Audio("./img/full.mp3");
fullsound.loop=true;
let gameInterval;
window.onload=function(){
    fullsound.play();
    showplayerNameModal();
    //This fn is called in every 100 millisec
}
var playerName = "";
function showplayerNameModal(){
    document.getElementById("playerNameModal").style.display="flex";
}
function savePlayerName() {
    playerName = document.getElementById("playerNameInput").value;
    document.getElementById("playerNameModal").style.display = "none";
    showLevelModal(); // Show the level selection modal after entering the name
}

function showLevelModal(){
    //document.getElementsByClassName("gameover-content").style.display="none";
    document.getElementById("levelModal").style.display="flex";
    document.getElementById("gameOverModal").style.display="none";
    //closeModal();
    
}
function selectLevel(selectedLevel){
    level=selectedLevel;
    document.getElementById("levelModal").style.display="none";
    setTimeLimit();
    fullsound.play();
    //crush();
    startGame();
    startTimer();
    window.setInterval(function(){
        crush();
        slidefish();
        generateFish();
    },100);
    
}
function resetGame() {
    score = 0;
    elapsedTime = 0;
    board = [];
    document.getElementById("score").innerText = score;
    document.getElementById("timer").innerText = "Time: 0 seconds";
    document.getElementById("board").innerHTML = ""; // Clear the board
    document.getElementById("congratsModal").style.display="none";
    document.getElementById("gameOverModal").style.display="none";
    //showLevelModal(); // Show the level selection modal
    showplayerNameModal();
}
function setTimeLimit(){
    switch(level){
        case 'easy':
            timeLimit=30;
            break;
        case 'medium':
            timeLimit=20;
            break;
        case 'hard':
            timeLimit=10;
            break;
    }
}
function startTimer(){
    startTime=new Date();
    timerInterval=setInterval(function(){
        elapsedTime=Math.floor((new Date()-startTime)/1000); //calculate elapsed time

        document.getElementById("timer").innerText="Time:"+elapsedTime+"seconds";
    },1000);
}

function stopTimer(){
    clearInterval(timerInterval);
}
function randomFish(){
    return ocean[Math.floor(Math.random() *ocean.length)]   //we gonna get random fish from the ocean array using math.random() floor to avoid decimal in generating random num.
}
function startGame(){
    //generateFish();
    for(let r=0 ;r<row; r++){
        let rowArray=[];
        for(let c=0;c<column;c++){
            let tile=document.createElement("img"); //created an img tag
            tile.id =r.toString()+ "-" +c.toString();   //In the row I'm gonna convert my img into string and concatenate with each other and store it in tile
            tile.src="./img/"  + randomFish() +".png";  //The src of my tile I'm gonna get from the randomfish() and concatenate it with png
            tile.style.position = 'relative'; 
            //Drag function
            tile.addEventListener("dragstart",dragStart);   //Initial click of fish
            tile.addEventListener("dragover",dragOver);     //After initial click..In the process of moving mouse to click the next fish
            tile.addEventListener("dragenter",dragEnter);   //One fish is about to touch other candy
            tile.addEventListener("dragleave",dragLeave);   //Leave it's position
            tile.addEventListener("dragend",dragEnd);       //Like swapping Fish 
            tile.addEventListener("drop",dragDrop);         //Dropping fish over other fish
            document.getElementById("board").append(tile);  //Now I'm appending tile to my board.
            rowArray.push(tile);
        }
        board.push(rowArray);
    }
    //console.log(board);
    

}
function dragStart(){

    curtile=this;
}
function dragOver(e){
    e.preventDefault();
}
function dragEnter(e){
    e.preventDefault();
}
function dragLeave(){

}
function dragDrop(){
    othertile=this;
}
function dragEnd(){

    if(curtile.src.includes("blank")|| othertile.src.includes("blank")){
        return;
    }

    let curcode=curtile.id.split("-");
    let r=parseInt(curcode[0]);
    let c=parseInt(curcode[1]);

    let othercode=othertile.id.split("-");
    let r2=parseInt(othercode[0]);
    let c2=parseInt(othercode[1]);
    
    let moveLeft=  c2==c-1 && r==r2;
    let moveRight=  c2==c+1 && r==r2;

    let moveUp= r2==r-1 && c==c2;
    let moveDown= r2==r+1 && c==c2;

    let adjacent =moveLeft || moveRight || moveUp || moveDown


    //curimg and otherimg are like temp variables used for swapping logic
    if(adjacent){
        let curimg=curtile.src;
        let otherimg=othertile.src;
        curtile.src=otherimg;   
        othertile.src=curimg;
        let validMove= checkValid();
        //swap again coz no three adjacent
        
        if(!validMove){
            curtile.src=otherimg;   
            othertile.src=curimg;
        }
        else{
            setTimeout(()=>{
                crush();
                slidefish();
                generateFish();
            },200);
            
        }
    }
}

function crush(){
    //Three i a row
    crushThree();
    document.getElementById("score").innerText=score;
    checkGameEnd();
}

function crushThree(){

    //check rows
    for(let r=0;r< row;r++){
        for(let c=0;c<column-2 ;c++){
            let fish1=board[r][c];
            let fish2=board[r][c+1];
            let fish3=board[r][c+2];

            //For checking 3 rows

            if(fish1.src==fish2.src && fish2.src==fish3.src  && !fish1.src.includes("blank")){
                let matchLength=3;

                //check for 4 rows

                if(c<column-3 && board[r][c+3].src==fish1.src){
                    matchLength=4;
                }

                //check for 5 rows

                if(c<column-4 && board[r][c+4].src==fish1.src){
                    matchLength=5;
                }

                //set all atched fish to blank

                for(let i=0;i<matchLength;i++){
                   // createBubbleAnimation(board[r][c+i]);// Bubble animation
                   //createConfettiAnimation(board[r][c+i]);
                   //createConfettiAnimation(board[r][c+i]);
                    board[r][c+i].src="./img/blank.png";
                }
                score += matchLength * 10;
                crushsound.play();
                c += matchLength - 1;
            }
        }
    }

    //check colums
    for(let c=0;c< column;c++){
        for(let r=0;r<row-2 ;r++){
            let fish1=board[r][c];
            let fish2=board[r+1][c];
            let fish3=board[r+2][c];

            //For checking 3 col

            if(fish1.src==fish2.src && fish2.src==fish3.src  && !fish1.src.includes("blank")){
                let matchLength=3;

                //for 4 col

                if(r<row-3 && board[r+3][c].src==fish1.src){
                    matchLength=4;
                }

                //for 5 col

                if(r<row-4 && board[r+4][c].src==fish1.src){
                    matchLength=5;
                }

                //set all matched fish to blank

                for(let i=0;i<matchLength;i++){
                    //createBubbleAnimation(board[r+i][c]);
                    //createPopAnimation(board[r+i][c]);
                    //createConfettiAnimation(board[r+i][c]);
                    board[r+i][c].src="./img/blank.png";
                }
                score+=10;
                crushsound.play();
                r += matchLength - 1;
            }
        }
    }
}
function checkValid() {
    // Check rows
    for (let r = 0; r < row; r++) {
        for (let c = 0; c < column - 2; c++) {
            let fish1 = board[r][c];
            let fish2 = board[r][c+1];
            let fish3 = board[r][c+2];

            // Check for a match of 3
            if (fish1.src == fish2.src && fish2.src == fish3.src && !fish1.src.includes("blank")) {
                return true;
            }

            // Optional: Check for matches of 4 or 5 if needed
            if (c < column - 3) {
                let fish4 = board[r][c+3];
                if (fish1.src == fish2.src && fish2.src == fish3.src && fish3.src == fish4.src && !fish1.src.includes("blank")) {
                    return true;
                }
            }
            if (c < column - 4) {
                let fish4 = board[r][c+3];
                let fish5 = board[r][c+4];
                if (fish1.src == fish2.src && fish2.src == fish3.src && fish3.src == fish4.src && fish4.src == fish5.src && !fish1.src.includes("blank")) {
                    return true;
                }
            }
        }
    }

    // Check columns
    for (let c = 0; c < column; c++) {
        for (let r = 0; r < row - 2; r++) {
            let fish1 = board[r][c];
            let fish2 = board[r+1][c];
            let fish3 = board[r+2][c];

            // Check for a match of 3
            if (fish1.src == fish2.src && fish2.src == fish3.src && !fish1.src.includes("blank")) {
                return true;
            }

            // Optional: Check for matches of 4 or 5 if needed
            if (r < row - 3) {
                let fish4 = board[r+3][c];
                if (fish1.src == fish2.src && fish2.src == fish3.src && fish3.src == fish4.src && !fish1.src.includes("blank")) {
                    return true;
                }
            }
            if (r < row - 4) {
                let fish4 = board[r+3][c];
                let fish5 = board[r+4][c];
                if (fish1.src == fish2.src && fish2.src == fish3.src && fish3.src == fish4.src && fish4.src == fish5.src && !fish1.src.includes("blank")) {
                    return true;
                }
            }
        }
    }

    return false;
}
/*function createBubbleAnimation(tile) {
    let bubble = document.createElement("div");
    bubble.classList.add("bubble");
    tile.appendChild(bubble);
    console.log("Bubble created at tile:", tile.id);

    // Remove the bubble after the animation ends
    setTimeout(() => {
        bubble.remove();
    }, 1000); // Match the duration of the animation
}
*/

function createPopAnimation(tile) {
    let popDiv=document.createElement("div");
    popDiv.classList.add("pop");
    tile.appendChild(popDiv);

    setTimeout(() => {
        tile.removeChild(popDiv);
    }, 400); // Match the duration of the animation
}

function createConfettiAnimation(tile) {
    for (let i = 0; i < 10; i++) {
        let confetti = document.createElement("div");
        confetti.classList.add("confetti");
        confetti.style.left = `${Math.random() * 50}px`;
        confetti.style.top = `${Math.random() * 50}px`;
        tile.appendChild(confetti);

        setTimeout(() => {
            confetti.remove();
        }, 400); // Match the duration of the animation
    }
}


function slidefish(){
    for(let c=0;c< column;c++){
        let ind=row-1;
        for(let r=column-1;r>=0;r--){
            if(!board[r][c].src.includes("blank")){
                board[ind][c].src=board[r][c].src;
                ind -=1; 
            }
        }
        for(let r=ind;r>=0;r--){
            board[r][c].src="./img/blank.png";
        }
    }
}
function generateFish() {
    for (let r = 0; r < row; r++) {
        for (let c = 0; c < column; c++) {
            if (board[r][c].src.includes("blank")) {
                board[r][c].src = "./img/" + randomFish() + ".png";
            }
        }
    }
}

function checkGameEnd() {
    if (score >= 500) {
        stopTimer();
        showCongratsModal(elapsedTime);
        winsound.play();
    }
    else if(elapsedTime>=timeLimit){
        stopTimer();
        //alert("Time's up!");
        //location.reload();
        showGameoverModal(elapsedTime);
    }
}

function stopGame(){
    clearInterval(gameInterval);
    stopTimer();
}


function showCongratsModal(timeTaken) {
    document.getElementById("congratsModal").style.display = "flex";
    document.getElementById("congratsMessage").innerText="Congratulations "+playerName+"!";
    document.getElementById("congratsMessage1").innerText="You completed the game in "+timeTaken+"seconds."
}
function showGameoverModal(timeTaken){
    document.getElementById("gameOverModal").style.display="flex";
    document.getElementById("gameovermsg").innerText="Game Over!";
    document.getElementById("gameovermsg1").innerText="Good Try "+playerName+"!";
}
function closeModal() {
    document.getElementById("congratsModal").style.display = "none";
    //document.getElementById("gameOverModal").style.display="none";
    location.reload();
}
function closeWindow(){
    window.close();
}
