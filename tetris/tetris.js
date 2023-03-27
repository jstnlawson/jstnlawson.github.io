document.addEventListener("DOMContentLoaded", () => {

/* "DOMContentLoaded" event fires when html has been completly loaded 
and passed. This doesn't include CSS or "subframes". All of the JS 
must be placed here to be heard  */

const grid = document.querySelector(".grid")
let squares = Array.from(document.querySelectorAll(".grid div"))

/* "Array.from" and "querySelectorAll" selects from all the div's and 
turns them into an array we can work with. Each div will have a 
specific ref #*/

const scoreDisplay = document.querySelector("#score")
const startBtn = document.querySelector("#start-button")
const pauseBtn = document.querySelector("#pause-button")
const width = 10
let nextRandom = 0
let timerId
let score = 0
const colors = [
    '#f5d562',
    '#e97b73',
    '#b968a6', 
    '#6BA66E',
    '#57c3bc',
    '#b37d6a',
    '#bdb8b8'
]

const lTetromino = [
    [1, width+1, width*2+1, 2], 
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
]

/* these arrays are the layout for four options the tetris pieces can 
fall into frame in. The numbers represent the shapes placed in the upper 
left corner of the grid which is zero and the number 10 is replaced with 
the const width. I am curious if you could just use the number values 
without all the width syntax */

const lTwoTetromino = [
    [1, 2, width+2, width*2+2],
    [width*2, width*2+1, width*2+2, width+2],
    [1, width+1, width*2+1, width*2+2],
    [width, width*2, width+2, width+1]
]

const zTetromino = [
    [width+1, width+2, width*2, width*2+1],
    [0, width, width+1, width*2+1],
    [width+1, width+2, width*2, width*2+1],
    [0, width, width+1, width*2+1]
]

const zTwoTeromino = [
    [width, width+1, width*2+1, width*2+2],
    [2, width+1, width+2, width*2+1],
    [width, width+1, width*2+1, width*2+2],
    [2, width+1, width+2, width*2+1]

]

const tTetromino = [
    [1, width, width+1, width+2],
    [1, width+1, width+2, width*2+1],
    [width, width+1, width+2, width*2+1],
    [1, width, width+1, width*2+1]
]

const oTetromino = [
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1]
]

const iTetromino = [
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3],
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3]
]

const theTetrominoes = [lTetromino, lTwoTetromino, zTetromino, zTwoTeromino, tTetromino, oTetromino, iTetromino]

let currentPosition = 4
let currentRotation = 0

let random = Math.floor(Math.random()*theTetrominoes.length)
let current = theTetrominoes[random][currentRotation] 

/* the "current" variable above make the randomly selected tetromio start in 
it's current rotation(i assume this keeps the starting piece in a static 
position instead of rotating on it's own)*/

function draw() {
    current.forEach(index => {
        squares[currentPosition + index].classList.add("tetromino")
        squares[currentPosition + index].style.backgroundColor = colors[random]
        
    })
}

/* the "draw" function above is calling our tetromino shapes to the 
"currentPosition"(which is the 4 block), and "forEach" index(square) that is 
called the styling from CSS is also called with the .classList.add("tetromino") 
which makes the shape visible(at least i'm pretty sure that's what's going on)*/

function undraw() {
    current.forEach(index => {
        squares[currentPosition + index].classList.remove("tetromino")
        squares[currentPosition + index].style.backgroundColor = ''
    })
}
/* .forEach method provides a provided callback function once for each 
element in a array in ascending order. The callback is invoked with three 
arguments: 

.forEach(value, index, object)

value(of the element), index(of the element), object(the object being traversed) 
Basically, it's an array with a bunch of values and you apply logic 
"for each" one*/

//timerId = setInterval(moveDown, 1000)

/* the setInterval() allows you set a function that is passed through it for an 
"x" amount of time. This is how the pieces will move down the grid*/

//keycode.info is a good place to get key map codes

function control(e) {
    if(e.keyCode === 37) {
        moveLeft()
        sfx.leftArrow.play()
    } else if (e.keyCode === 38) {
        rotate()
        sfx.upArrow.play()
    } else if (e.keyCode === 39) {
        moveRight()
        sfx.rightArrow.play()
    } else if (e.keyCode === 40) {
        moveDown()
        document.getElementById('g').play()
    }
}
document.addEventListener("keydown", control)

let player = null

/* control(e): The "e" is for "event". If the key that equals 37 is pressed the 
shape will moveLeft() 

the "addEventListener" listens for a "keyup" event and evokes the control function*/

var sfx = {

    leftArrow: new Howl({
        src: [
            "./audio/a.mp3"
        ]
    }),

    upArrow: new Howl({
        src: [
            "./audio/b.mp3"
        ]
    }),

    rightArrow: new Howl({
        src: [
            "./audio/c.mp3"
        ]
    }),

    downArrow: new Howl({
        src: [
            "./audio/g.mp3"
        ]
    }),
    playSound: new Howl({
        src: [
            "./audio/start.mp3"
        ]
    }),
    pauseSound: new Howl({
        src: [
            "./audio/pause.mp3"
        ]
    })
    
}

function moveDown() {
    undraw()
    currentPosition += width
    draw()
    freeze()
}

/* in the moveDown function we are moving down the grid by undrawing the piece 
from it's current position and adding a whole width to its current position then 
drawing itself again */

function freeze() {
    if(current.some(index => squares[currentPosition + index + width].classList.contains("taken"))) {
        current.forEach(index => squares[currentPosition + index].classList.add("taken"))
    
/*freeze in plain(ish) english: 

If it's true that any (.some) of the tetromino squares current Position 
(currentPosition + index + width) is in a square from the "taken" class 
(the div's at the bottom of the html) then regard each tetromino square
as the "taken" class.

in plain english:

When the pieces hit the bottom they stop.

 .some is similar to .forEach but instead of applying our logic to the 
(value, index, object) elements .some is checking wether our applied logic is 
true or false (true,false,true). If a "true" is returned then you're good to go.        
*/    
    random = nextRandom
    nextRandom = Math.floor(Math.random()*theTetrominoes.length)
    current = theTetrominoes[random][currentRotation]
    currentPosition = 4
    draw()
    displayShape()
    addScore()
    gameOver()
    }
}
/* the above starts a new piece after the freeze (should this/does this need to
happen within the freeze function?) */

function moveLeft() {
    undraw()
/*undraw:start by undrawing(removing from current position). */
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
/*if any part of the "current" piece/location divided by the width is zero 
(if the piece touches the left side)*/
    if(!isAtLeftEdge) currentPosition -=1
/* if the shape is not at the left edge */    
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition +=1
/* if some squares go into shape that's already in "taken" class push it back one 
space so it doesn't appear to have moved */      
    }
    draw()
/* draw it where it's supposed to be */
    }

function moveRight() {
    undraw()
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1)
    if(!isAtRightEdge) currentPosition +=1
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition -=1
    }
    draw()
  }

  function rotate() {
    undraw()
    currentRotation ++
    //go to the next rotation in the array
    if(currentRotation === current.length) {
        currentRotation = 0
        //if current rotation gets to 4 make it go back to zero
    }
    current = theTetrominoes[random][currentRotation]
    draw()
  }

//show next shape
const displaySquares = document.querySelectorAll(".mini-grid div")
const displayWidth = 4
const displayIndex = 0
//let nextRandom = 0

//shapes without rotations
const upNextTetrominoes = [
    [1, displayWidth+1, displayWidth*2+1, 2], //L
    [1, 2, width+2, width*2+2], //L2
    [displayWidth+1, displayWidth+2, displayWidth*2, displayWidth*2+1],//Z
    [width, width+1, width*2+1, width*2+2], //Z2
    [1, displayWidth, displayWidth+1, displayWidth+2],//T
    [0, 1, displayWidth, displayWidth+1],//O
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1]//I
]

//display shape in display grid
function displayShape() {
    //remove ant trace of a shape from the grid
    displaySquares.forEach(square => {
        square.classList.remove("tetromino")
        square.style.backgroundColor = ''
    })
    upNextTetrominoes[nextRandom].forEach(index => {
        displaySquares[displayIndex + index].classList.add("tetromino")
        displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
    })
}

//button function
startBtn.addEventListener("click", () => {
    
    function startOpacity0(){
    let startButton = document.getElementById("start-button");
    startButton.style.opacity = "0";}

    function startOpacity1(){
        let startButton = document.getElementById("start-button");
        startButton.style.opacity = "1";}

    function pauseOpacity1(){
        let pauseButton = document.getElementById("pause-button");
        pauseButton.style.opacity = "1";}

    function pauseOpacity0(){
        let pauseButton = document.getElementById("pause-button");
        pauseButton.style.opacity = "0";}

    if (timerId) {
        clearInterval(timerId)
        timerId = null
        document.getElementById("backgroundMusic").pause()
        pauseOpacity0()
        startOpacity1()
        sfx.pauseSound.play()
    } else {
        draw()
        timerId = setInterval(moveDown, 1000)
        nextRandom = Math.floor(Math.random()*theTetrominoes.length)
        displayShape()
        document.getElementById("backgroundMusic").play()
        startOpacity0()
        pauseOpacity1()
        sfx.playSound.play()
    }
})

pauseBtn.addEventListener("click", () => {
    
    function startOpacity0(){
    let startButton = document.getElementById("start-button");
    startButton.style.opacity = "0";}

    function startOpacity1(){
        let startButton = document.getElementById("start-button");
        startButton.style.opacity = "1";}

    function pauseOpacity1(){
        let pauseButton = document.getElementById("pause-button");
        pauseButton.style.opacity = "1";}

    function pauseOpacity0(){
        let pauseButton = document.getElementById("pause-button");
        pauseButton.style.opacity = "0";}

    if (timerId) {
        clearInterval(timerId)
        timerId = null
        document.getElementById("backgroundMusic").pause()
        pauseOpacity0()
        startOpacity1()
        sfx.pauseSound.play()
    } else {
        draw()
        timerId = setInterval(moveDown, 1000)
        nextRandom = Math.floor(Math.random()*theTetrominoes.length)
        displayShape()
        document.getElementById("backgroundMusic").play()
        startOpacity0()
        pauseOpacity1()
        sfx.playSound.play()
    }
})




/* If the button is clicked and there's a timerId value then the game is paused with the 
clearInterval and the timerId returns to null. Else, when the start button is pressed a shape
is drawn "draw()" and selects the next shape and puts it in the display

.splice "mutates" an array by removing items. 
array.splice(startIndex, deleteCount) 

you can also add items with splice: 
array.splice(1, 0, item1, item2)

you can also decide to keep only one array item(in this case the first one):
array.splice(1)

concat(): adds an array

appendChild: append (add) element to existing element*/

const audio = document.getElementById("backgroundMusic")
audio.volume = 0.2


/*
const g = document.getElementById("g")
const a = document.getElementById("a")
const b = document.getElementById("b")
const c = document.getElementById("c")
const d = document.getElementById("d")
const e = document.getElementById("e")
const fs = document.getElementById("fs")

const audioArray = [g, a, b, c, d, e, fs];

function playArray() {
    let i=0;
    let lastPlayedFile = null;
    if(lastPlayedFile !== null) {
     lastPlayedFile[0].currentTime = 0;
     lastPlayedFile.trigger('pause'); 
  }
    if (i< audioArray.length){
     lastPlayedFile = audioArray[i];
     audioArray[i].trigger('play');
     i++;
  } else if (i>=audioArray.length){
     i = 0;
     lastPlayedFile = audioArray[0];
     audioArray[i].trigger('play');
  }
}; */



//add score
function addScore() {
    for (let i = 0; i < 199; i +=width) {
    //for loop: our row starts at zero and adds 1 for every column filled??
      const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]
      // the "i" plus the other 9 widths along the row 
      if(row.every(index => squares[index].classList.contains('taken'))) {
      //if every square in the row contains a div with the class of taken 
        score +=10
        //add 10
        scoreDisplay.innerHTML = score
        //diplay the score
        row.forEach(index => {
          squares[index].classList.remove('taken')
          //remove the taken class from the items in the row
          squares[index].classList.remove('tetromino')
          //remove the tetromino divs from the row
          squares[index].style.backgroundColor = ''
        })
        const squaresRemoved = squares.splice(i, width)
        squares = squaresRemoved.concat(squares)
        squares.forEach(cell => grid.appendChild(cell))
        //this moves the newly empty row to the top
      }
    }
  } 

  //game over
  function gameOver() {
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
    //if any part of the shape is in the starting index postion
      scoreDisplay.innerHTML = 'hoot! You are dead now.'
      //change the dispaly to "end"
      clearInterval(timerId)
      //stop the the game
    }
  }






})
