var trex_running,trex_collided,trex_duck,trex;
var ground,ground_image,invisible_ground;
var ob1,ob2,ob3,ob4,ob5,ob6,ob_group;
var cloud_image,cloud_group;
var crow,crow_group;
var restart,gameOver,restart_image,gameOver_image;
var jump,die,checkpoint;
var PLAY=1;
var END=0;
var gameState=PLAY;
var score=0;

function preload(){
  trex_running=loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_duck=loadAnimation("Dino.png");
  trex_collided=loadAnimation("trex_collided.png");
  
  ground_image=loadImage("ground2.png");
  ob1=loadImage("obstacle1.png");
  ob2=loadImage("obstacle2.png");
  ob3=loadImage("obstacle3.png");
  ob4=loadImage("obstacle4.png");
  ob5=loadImage("obstacle5.png");
  ob6=loadImage("obstacle6.png");
  
  cloud_image=loadImage("cloud.png");
  crow=loadImage("Bird.png");
  
  restart_image=loadImage("restart.png");
  gameOver_image=loadImage("gameOver.png");
  
  jump=loadSound("jump.mp3");
  die=loadSound("die.mp3");
  checkpoint=loadSound("checkPoint.mp3");
}

function setup() {
  createCanvas(600,300);
  trex=createSprite(50,260);
  trex.addAnimation("running",trex_running);
  trex.addAnimation("collided",trex_collided);
  trex.addAnimation("duck",trex_duck);
  trex.scale=0.5;
  
  ground=createSprite(300,280);
  ground.addImage(ground_image);
  ground.x=ground.width/2;
  invisible_ground=createSprite(300,285,600,10);
  invisible_ground.visible=false;
 
    restart=createSprite(300,170);
  restart.addImage(restart_image);
  restart.scale=0.5;
  restart.visible=false;
  
  gameOver=createSprite(300,150);
  gameOver.addImage(gameOver_image);
  gameOver.scale=0.5;
  gameOver.visible=false;
  
  crow_group= new Group();
  cloud_group=new Group();
  ob_group=new Group();
}

function draw() {
  background(220);
  textSize(15);
  text("SCORE "+score,400,30);
  
  
  if(gameState===PLAY){
  ground.velocityX=-6;
  score=score+Math.round(getFrameRate()/60);
  if(score>0 && score % 100===0){
    checkpoint.play();
  }
  
   if(ground.x<0){
    ground.x=ground.width/2;
  }
  
  if(keyDown("space") && trex.y>256){
    trex.velocityY=-12;
    jump.play();
  }
    
   trex.velocityY=trex.velocityY+0.5; 
    
  if(keyWentDown(DOWN_ARROW)){
     trex.changeAnimation("duck",trex_duck);
      trex.scale=0.15;
  }
  if(keyWentUp(DOWN_ARROW)){
    trex.changeAnimation("running",trex_running);
    trex.scale=0.5;
  }

    if(score>0 && score % 1000>0 && score % 1000<500){
      spawnObstacles();
    }
    if(score>0 && score % 1000>500 && score % 1000<999){
      spawnBird();
    }
    spawnCloud();
      
    
    if(ob_group.collide(trex) || crow_group.collide(trex)) {
      gameState=END;
      die.play();
    }
  }
  else if(gameState===END){
    ground.velocityX=0;
    trex.velocityY=0;
    ob_group.setLifetimeEach(-1);
    cloud_group.setLifetimeEach(-1);
    crow_group.setLifetimeEach(-1);
    ob_group.setVelocityXEach(0);
    cloud_group.setVelocityXEach(0);
    crow_group.setVelocityXEach(0);
    trex.changeAnimation("collided",trex_collided);
    restart.visible=true;
    gameOver.visible=true;
    if(mousePressedOver(restart)){
      reset();
    }
  }
    
    
    trex.collide(invisible_ground);
  drawSprites(); 
  
}
function spawnObstacles(){
  if(frameCount % 70===0){
    var obstacle=createSprite(600,260);
    var r=Math.round(random(1,6));
    switch(r){
      case 1:obstacle.addImage(ob1);
      break;
      case 2:obstacle.addImage(ob2);
      break;
      case 3:obstacle.addImage(ob3);
      break;
      case 4:obstacle.addImage(ob4);
      break;
      case 5:obstacle.addImage(ob5);
      break;
      case 6:obstacle.addImage(ob6);
      break;
      default:break;
    }
      obstacle.velocityX=-4;
      obstacle.scale=0.5;
      obstacle.lifetime=150;
      ob_group.add(obstacle);
    
  }
}
function spawnCloud(){
  if(frameCount % 80===0){
    var cloud=createSprite(600,220);
    cloud.addImage(cloud_image);
    cloud.y=Math.round(random(160,220));
    cloud.velocityX=-4;
    cloud.lifetime=150;
    cloud.depth=trex.depth;
    trex.depth=trex.depth+1;
    cloud_group.add(cloud);
  }
}
function spawnBird(){
  if(frameCount % 70==0){
    var bird=createSprite(600,220);
    bird.addImage(crow);
    bird.y=Math.round(random(220,270));
    bird.velocityX=-5;
    bird.lifetime=130;
    crow_group.add(bird);
  }
}
function reset(){
  gameState=PLAY;
  score=0;
  trex.changeAnimation("running",trex_running);
  ob_group.destroyEach();
  crow_group.destroyEach();
  cloud_group.destroyEach();
  restart.visible=false;
  gameOver.visible=false;
}     
        