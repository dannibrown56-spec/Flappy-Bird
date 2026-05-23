let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");

let gameState = "MENU";
let birdX = 50;
let birdY = 200;
let velocity = 0;
let gravity = 0.5;
let pipes = [];
let pipeTimer = 0;
let score = 0;

// --- CREATE IMAGE OBJECTS ---
let bgImg = new Image();
bgImg.src = "background.png";

let birdImg = new Image();
birdImg.src = "bird.png";

let pipeImage = new Image();
pipeImage.src = "pipe.png";

// --- INPUT LISTENER ---
window.addEventListener("keydown", function(event) {
    if (event.code === "Space") {
        
        if (gameState === "MENU") {
            gameState = "PLAYING";
        } else if (gameState === "PLAYING") {
            velocity = -8; 
        } else if (gameState === "GAMEOVER") {
            gameState = "PLAYING";
            velocity = 0;
            birdY = 200;
            pipes = [];      
            pipeTimer = 0;   
            score = 0;       
        }
    }
});

// --- MAIN GAME LOOP ---
function gameLoop() {

    // 1. Clear the screen
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 2. Draw the background image FIRST so it's behind everything
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

    if (gameState === "MENU") {
        // --- MAIN TITLE ---
        ctx.font = "bold 40px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText("Flappy Bird", canvas.width / 2, 200);

        // --- Subtitles ---
        ctx.font = "20px Arial";
        ctx.fillText("Press Space to Start", canvas.width / 2, 300);
         
    } else if (gameState === "PLAYING") {

        // --- PHYSICS ---
        velocity += gravity;
        birdY += velocity;

        // --- CEILING & FLOOR BOUNDARIES ---
        if (birdY < 0) {
            birdY = 0;
            velocity = 0;
        }

        if (birdY >= 470) {
            gameState = "GAMEOVER";
        }

        // --- PIPE SPAWNING ---
        pipeTimer++;

        if (pipeTimer >= 120) {
            let randomHeight = Math.floor(Math.random() * 200) + 50;

            pipes.push({
                x: canvas.width,
                topHeight: randomHeight,
                bottomY: randomHeight + 120,
                passed: false 
            });

            pipeTimer = 0;
        }

        // --- MOVE, CHECK COLLISIONS, & DRAW PIPES ---
        for (let i = 0; i < pipes.length; i++) {
            let p = pipes[i];
            
            p.x -= 2;

            // 1. Is the bird horizontally inside the pipe zone?
            if (birdX + 30 >= p.x && birdX <= p.x + 50) {
                
                // 2. Did the bird hit the TOP pipe?
                if (birdY <= p.topHeight) {
                    gameState = "GAMEOVER";
                }
                
                // 3. Did the bird hit the BOTTOM pipe?
                if (birdY + 30 >= p.bottomY) {
                    gameState = "GAMEOVER";
                }
            }

            // --- INCREASE SCORE ---
            if (birdX > p.x + 50 && p.passed === false) {
                score++;
                p.passed = true; 
            }

            // Draw the top and bottom pipe images using your lines!
            ctx.drawImage(pipeImage, p.x, 0, 50, p.topHeight);
            ctx.drawImage(pipeImage, p.x, p.bottomY, 50, 500 - p.bottomY);
        }

        // --- DRAW BIRD IMAGE ---
        ctx.drawImage(birdImg, birdX, birdY, 30, 30);

        // --- DRAW SCORE ---
        ctx.font = "bold 30px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText("Score: " + score, canvas.width / 2, 50);

    } else if (gameState === "GAMEOVER") {
        // --- DRAW GAME OVER SCREEN ---
        ctx.font = "bold 40px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText("Game Over", canvas.width / 2, 220);

        ctx.font = "24px Arial";
        ctx.fillText("Final Score: " + score, canvas.width / 2, 280);
        ctx.font = "18px Arial";
        ctx.fillText("Press Space to Try Again", canvas.width / 2, 330);
    } 

    requestAnimationFrame(gameLoop);
}

gameLoop();