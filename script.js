/******************************************************Board data************************************************/
const board = document.getElementById('board');
// Function to resize canvas and draw the image
function resizeCanvas() {
    board.width = board.offsetWidth;
    board.height = board.offsetHeight;
}

// Initial resize and draw
resizeCanvas();
//get height and width after resize
let boardWidth = board.width;
let boardHeight = board.height;
const context = board.getContext('2d');

// Resize canvas when window size changes
window.addEventListener('resize', resizeCanvas);

//Playing background audio
var audio;
document.addEventListener('DOMContentLoaded', (event) => {
    audio = document.getElementById('background-audio');
    audio.play().catch(error => {
        console.log('Playback prevented:', error);
        // Optionally, you could show a play button to start the audio
    });
});

/**********************************************************Score data************************************************/
var score=0;
function countScore(){
    if(!gameOver){
        score++;
        // console.log(score);
    }
}




/**********************************************************Pig data************************************************/
//Pig
let pigWidth =96;
let pigHeight=72;
let pigX = 50;
let pigY = boardHeight - pigHeight;
let pigImg;
let gravity = 0.5;
let velocityY = 0;

//object to manage pig data
let pig={
    x: pigX,
    y: pigY,
    width: pigWidth,
    height: pigHeight
}


/**********************************************************pig controls************************************************/
let gameOver = false;
function movePig(e){
    if(gameOver){
        return;
    }
    if((e.code=="Space" || e.code=="ArrowUp")&& pig.y == pigY){
        velocityY = -10;
        pig.y +=velocityY;
        console.log(pig.y);
    }

}

document.addEventListener("keydown",movePig);


// Array of frame image URLs (replace with the actual paths to your frames)
const frames = [
    'assets/frames/frame(1).png',
    'assets/frames/frame(2).png',
    'assets/frames/frame(3).png',
    'assets/frames/frame(4).png',
    'assets/frames/frame(5).png',
    'assets/frames/frame(6).png',
    'assets/frames/frame(7).png',
    'assets/frames/frame(8).png',
    'assets/frames/frame(9).png',
    'assets/frames/frame(10).png',
    'assets/frames/frame(11).png',
    // Add more frames as needed
];

// Load all frames
const images = [];
frames.forEach(src => {
    const img = new Image();
    img.src = src;
    images.push(img);
});

// Draw the frames in a loop
let currentFrame = 0;
const frameDuration = 25; // Duration of each frame in milliseconds

function drawFrame() {
    velocityY+=gravity;
    pig.y = Math.min(pig.y+velocityY , pigY);
    // Clear the canvas(only that part of canvas which has image)
    context.clearRect(0, 0,pig.x+pigWidth, board.height);
    // Draw the current frame
    context.drawImage(images[currentFrame], pig.x, pig.y, pig.width, pig.height);
    // Update to the next frame
    currentFrame = (currentFrame + 1) % images.length;
    // Schedule the next frame
    setTimeout(drawFrame, frameDuration);
}

// Start the drawing loop once all images are loaded
function showPigs(){
    let imagesLoaded = 0;
    images.forEach(image => {
        image.onload = () => {     //to show image, must have to use onload
            imagesLoaded++;
            if (imagesLoaded === images.length) {
                drawFrame();
            }
        };
    });
}

showPigs();



/**********************************************************hurdles data************************************************/
let hurdles = [];
let hurdleWidth = 34;

let hurdleHeight = 70;
let hurdleX = board.width;
let hurdleY = boardHeight-hurdleHeight;

let hurdle1Img = new Image();
hurdle1Img.src = 'assets/hurdles/hurdle1.png';
let hurdle2Img = new Image();
hurdle2Img.src = 'assets/hurdles/hurdle2.png';
let hurdle3Img = new Image();
hurdle3Img.src = 'assets/hurdles/hurdle3.png';
let hurdle4Img = new Image();
hurdle4Img.src = 'assets/hurdles/hurdle4.png';


//decide speed of hurdle
let velocityX = -3;
window.onload=function(){
    if(!gameOver){
    let timeGap = Math.random()*1000;
    requestAnimationFrame(update);
    setInterval(countScore,100);
    setInterval(placeHurdle,1000+timeGap);  // code to place hurdles
    }
    
}

function update(){
    requestAnimationFrame(update);
    context.clearRect(pig.x+pigWidth, 0,board.width, board.height);
    //draw hurdles
    for(let i=0; i<hurdles.length; i++){
      
        let hurdle = hurdles[i];
        hurdle.x += velocityX-score/1000;  //increase speed of hurdles with score
        context.drawImage(hurdle.img, hurdle.x, hurdle.y, hurdle.width, hurdle.height);
        //detect collision for each cactus
        if(detectCollision(hurdle, pig)){
            gameOver = true;
            audio.pause();
            const audio2 = document.getElementById('gameOver-audio');
            audio2.play();
        }
        if(gameOver){
            return;
        }
    }
    
}

function placeHurdle(){
    if(gameOver){
        return;
    }
    
    let hurdle = {
        img:null,  // depends on hurdle we use
        x:hurdleX,
        y: hurdleY,
        width: hurdleWidth,
        height: hurdleHeight
    }

    let placeHurdleChance = Math.random();
    if(placeHurdleChance>0.8){  //20% chance to get hurdle 4
        hurdle.img = hurdle4Img;
        hurdles.push(hurdle);
    }
    else if(placeHurdleChance>0.6){  //20% chance to get hurdle 3
        hurdle.img = hurdle3Img;
        hurdles.push(hurdle);
    }
    else if(placeHurdleChance>0.3){  //20% chance to get hurdle 2
        hurdle.img = hurdle2Img;
        hurdles.push(hurdle);
    }
    else if(placeHurdleChance>0){  //30% chance to get hurdle 1
        hurdle.img = hurdle1Img;
        hurdles.push(hurdle);
    }
    //Limit number of hurdles in hurdle array(remove non visible hurdles)
    if(hurdles.length>6){
        hurdles.shift() // remove first element of array
    }
}


/**********************************************************detect collision************************************************/
function detectCollision(a,b){
    return a.x < b.x + b.width &&  //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x && //a's top right corner passes b's top left corner
           a.y < b.y + b.height && // a's top left corner doesn't reach b'd bottom left corner
           a.y + a.height > b.y;  //a's bottom left corner passes b't top left corner

}