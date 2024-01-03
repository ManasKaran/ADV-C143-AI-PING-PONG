wrist_x = 0;
wrist_y = 0;
wrist_score = 0;

var paddle2 = 10,
  paddle1 = 10;

var paddle1X = 10,
  paddle1Height = 110;
var paddle2Y = 685,
  paddle2Height = 70;

var score1 = 0,
  score2 = 0;
var paddle1Y;

var playerscore = 0;
var audio1;
var pcscore = 0;
//ball x and y and speedx speed y and radius
var ball = { // it is a normal var or array//
  x: 350 / 2,
  y: 480 / 2,
  r: 20,
  dx: 3, // dx?? & dy?? //
  dy: 3
}
game_Status = "";

function setup() {
  var canvas = createCanvas(700, 600);
  canvas.parent("canvas");
  video = createCapture(VIDEO);
  video.size(700, 600);
  video.hide();
  pose_net = ml5.poseNet(video, model_Loaded);
  // Here 1st parameter is that the model which you are loading where you want it to be loaded/executed, and the 2nd parameter comes that what should happen when it gets loaded here we are calling a callback function. 

  pose_net.on("pose", got_results);

  //1st parameter is that which parameter you want from that model and the 2nd comes that from where THAT VALUE GETS FETCHED.

}

function model_Loaded() {
  console.log("Model is loaded!!, we are good to go !!");
}
function preload(){

  ball_touched_sound= loadSound("ball_touch_paddel.wav");
  ball_missed_sound= loadSound("missed.wav");

}
function got_results(results) {
  if (results.length > 0) {
    console.log(results);
    wrist_x = results[0].pose.rightWrist.x; //0 coz 0th position ALWAYS HAVE THE HIGHEST ACCURACY//
    wrist_y = results[0].pose.rightWrist.y;
    wrist_score = results[0].pose.keypoints[10].score;
  }
}

function draw() {
  // image(video, 0, 0, 700, 600);


  if (game_Status == "start") {

    background(0); // 0="black"
    image(video, 0, 0, 700, 600);
   
    // Mam all the function we are creating here, mam we are creating the function but mam the functions should be called also mam as I have learned in past classes so mam how are these functions getting executed without calling them ?? like mam here we have created startGame() and called it on onclick of start btn that's why mam it is working otherwise it won't get executed, likewise these setup() , draw() , preload() , gotResult() etc functions should be called, since mam they are working fine so mam somewhere they ARE GETTING CALLED BY SOMEONE(some elements) so mam what are those elements which are triggering them ??  //

    // *Mam that gotResults(results) doubt mam 😅. Mam like mam the results parameter passed is the arguments which we gave in the gotResults() but how is it getting that array in it , and also mam that results parameter passed should be mam like this according to me; "results[]" because mam it is holding an array ? //

    fill("black");
    stroke("black");
    rect(680, 0, 20, 700);

    fill("black");
    stroke("black");
    rect(0, 0, 20, 700); //}

    //funtion paddleInCanvas call 
    paddleInCanvas(); // after this all ??//

    //left paddle
    fill(250, 0, 0);
    stroke(0, 0, 250);
    strokeWeight(0.5);
    paddle1Y = wrist_y;
    rect(paddle1X, paddle1Y, paddle1, paddle1Height, 100); // 4th parameter here ?? //


    //pc computer paddle
    fill("#FFA500");
    stroke("#FFA500");
    var paddle2y = ball.y - paddle2Height / 2;//??//
    rect(paddle2Y, paddle2y, paddle2, paddle2Height, 100); // 4th parameter and the 1st and 2nd parameters are both 'y'?? // 

    //function midline call
    midline();

    //funtion drawScore call 
    drawScore();

    //function models call  
    models();

    //function move call which in very important
    move();


    if (wrist_score > 0.2) { //as the body part comes on screen the score will go above 0.2 , values < 0.2 are negligible and we don't consider them//
      fill("red");
      stroke("white");
      strokeWeight(2);
      circle(wrist_x, wrist_y, 25);
    }
  }
}

function startGame() {
  game_Status = "start";
  document.getElementById("game_status").innerHTML = "Game is loaded";
}



//function reset when ball does notcame in the contact of padde
function reset() {
  ball.x = width / 2 + 100,
    ball.y = height / 2 + 100;
  ball.dx = 3;
  ball.dy = 3;

}


//function midline draw a line in center
function midline() {
  for (i = 0; i < 480; i += 10) {
    var y = 0;
    fill("white");
    stroke(0);
    rect(width / 2, y + i, 10, 480); // whose width?? and how are those horizontal lines coming in the rect //
  }
}

function restart(){
  pcscore = 0;
  playerscore = 0;
  loop(); // ?? //
}

//function drawScore show scores
function drawScore() {
  textAlign(CENTER);
  textSize(20);
  fill("white");
  stroke(250, 0, 0)// r,g,b ?? //
  text("Player:", 100, 50)// text , x ,y ??//
  text(playerscore, 140, 50);
  text("Computer:", 500, 50)
  text(pcscore, 555, 50)
}


//very important function of this game
function move() {
  fill("blue");
  stroke(255, 0, 0);
  strokeWeight(5);
  ellipse(ball.x, ball.y, ball.r, 20); // What is an ellipse
  ball.x = ball.x + ball.dx;
  ball.y = ball.y + ball.dy;
  if (ball.x + ball.r > width - ball.r / 2) {
    ball.dx = -ball.dx - 0.5;
  }
  if (ball.x - 2.5 * ball.r / 2 < 0) {
    if (ball.y >= paddle1Y && ball.y <= paddle1Y + paddle1Height) {
      ball_touched_sound.play();
      ball.dx = -ball.dx + 0.5;
      playerscore++;
    } else {
      ball_missed_sound.play();
      pcscore++;
      reset();
      navigator.vibrate(100);
    }
  }
  if (pcscore == 4) {
    fill("#FFA500");
    stroke(0)
    rect(0, 0, width, height-10);
    fill("white");
    stroke("white");
    textSize(25);
    text("Game Over!☹☹", width / 2, height / 2);
    text("Press the restart button to play again!", width / 2, height / 2 + 30);
    noLoop();//? if this function is used to stop the draw() wouln't it will work with another function?//
    pcscore = 0;
  }
  if (ball.y + ball.r > height || ball.y - ball.r < 0) {
    ball.dy = -ball.dy;
  }
}


//width height of canvas speed of ball 
function models() {
  textSize(18);
  fill(255);
  noStroke();//?//
  text("Width:" + width, 135, 15);
  text("Speed:" + abs(ball.dx), 50, 15);
  text("Height:" + height, 235, 15)
}


//this function help to not go te paddle out of canvas
function paddleInCanvas() {
  if (mouseY + paddle1Height > height) { // what is height variable is here?? means which element's height?? //
    mouseY = height - paddle1Height;
  }
  if (mouseY < 0) {
    mouseY = 0;
  }
}