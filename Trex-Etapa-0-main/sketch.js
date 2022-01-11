var placar=0;
var ground,groundImage,invisibleGround
var parede;
var trex ,trex_running,trex_collided;
var nuvem,nuvemImage,nuvemGrupo;
var obstaculo1,obstaculo2,obstaculo3,obstaculo4,obstaculo5,obstaculo6,obstaculoGrupo;
var PLAY=1
var END=0
var estadoDoJogo=PLAY
var restartImg,gameOverImg,gameOver,restart
var checkpointSound,jumpSound,diedSound

function preload(){
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided=loadAnimation("trex_collided.png")
  groundImage=loadImage("ground2.png");
  restartImg=loadImage("restart.png");
  gameOverImg=loadImage("gameOver.png");
  nuvemImage=loadImage("cloud.png")
  obstaculo1=loadImage("obstacle1.png")
  obstaculo2=loadImage("obstacle2.png")
  obstaculo3=loadImage("obstacle3.png")
  obstaculo4=loadImage("obstacle4.png")
  obstaculo5=loadImage("obstacle5.png")
  obstaculo6=loadImage("obstacle6.png")
  jumpSound=loadSound("jump.mp3")
  checkpointSound=loadSound("checkpoint.mp3")
  diedSound=loadSound("die.mp3")
}

function setup(){
  createCanvas(windowWidth,windowHeight)
  
  obstaculoGrupo=createGroup()
  nuvemGrupo=new Group()   

  //crie um sprite de trex
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided",trex_collided);
  trex.scale=0.5


  restart=createSprite(width/2,height/2)
  restart.addImage(restartImg);
  restart.scale=0.5


  gameOver=createSprite(width/2,height/2-50)
  gameOver.addImage(gameOverImg)


  ground=createSprite(width/2,height-30,width,20) 
  ground.addImage("ground",groundImage);

  invisibleGround=createSprite(width/2,height-10,width,20)
  invisibleGround.visible=false

  trex.debug=true
  trex.setCollider("circle",0,0,40)
}
//edges=createEdgeSprites();

function draw(){
  background(200)

  text("pontos: " +placar,500,50);


  if(estadoDoJogo==PLAY){
    ground.velocityX=-(4+3*placar/100);
    placar=placar+ Math.round(frameCount/170)
    gameOver.visible=false
    restart.visible=false


    if(touches.length>0 || keyDown("space") && trex.y>=height-120){
      trex.velocityY= -10
      jumpSound.play();
      touches=[]
    }

    if(placar>0 && placar%100===0){
      checkpointSound.play();
    }

    if(ground.x<0){
      ground.x=ground.width/2
    }
   
    trex.velocityY= trex.velocityY +0.8

    gerarNuvens();
    gerarObstaculos();

    if(obstaculoGrupo.isTouching(trex)){
      estadoDoJogo=END
      diedSound.play();
    }

    
    
    
  }
    else if(estadoDoJogo===END){
    ground.velocityX=0
    trex.velocityY=0
    obstaculoGrupo.setVelocityXEach(0);
    nuvemGrupo.setVelocityXEach(0);
    gameOver.visible=true
    restart.visible=true


    trex.changeAnimation("collided",trex_collided);

    obstaculoGrupo.setLifetimeEach(-1);
    nuvemGrupo.setLifetimeEach(-1);


    if(mousePressedOver(restart)){
      reset();

    }

  
  }

  
  trex.collide(invisibleGround);

  
  drawSprites();

}

function gerarNuvens(){

 if(frameCount%60===0){
  nuvem=createSprite(width+20,height-300,40,10);
  nuvem.velocityX = -3;
  nuvem.addImage(nuvemImage)
  nuvem.scale=0.4
  nuvem.y=random(100,300)

  trex.depth=nuvem.depth+1
  nuvem.lifetime=200
  nuvemGrupo.add(nuvem)
 }


  
}

function gerarObstaculos(){
   if(frameCount%60===0){
    var obstaculo=createSprite(width+50,height-45,10,40); 
    obstaculo.velocityX= -(5+placar/100);

    var aleatoria=round(random(1,6));
    switch(aleatoria){
      case 1 :obstaculo.addImage(obstaculo1);
      break;
      case 2 :obstaculo.addImage(obstaculo2);
      break;
      case 3 :obstaculo.addImage(obstaculo3);
      break;
      case 4 :obstaculo.addImage(obstaculo4);
      break;
      case 5 :obstaculo.addImage(obstaculo5);
      break;
      case 6 :obstaculo.addImage(obstaculo6);
      break;
      
      default:break;
    }
    obstaculo.scale=0.5
    obstaculo.lifetime=100
    obstaculoGrupo.add(obstaculo)

 }
}


function reset(){
  estadoDoJogo=PLAY
  gameOver.visible=false
  restart.visible=false
  obstaculoGrupo.destroyEach();
  nuvemGrupo.destroyEach();
  trex.changeAnimation("running",trex_running)
  placar=0
  
}
