var dinoGame = {};
dinoGame.BTNU = buttons.A;
dinoGame.dinoLeaveGame = {
  "" : {
    "title" :"you want to leave"
  },
    "Yes":function(){g.clear();mmc.extgame();dinoGame=null;},
    "No":function(){g.clear();dinoGame.gameStart();}
};
dinoGame.IMG = {
  rex: [Graphics.createImage(`
           ########
          ##########
          ## #######
          ##########
          ##########
          ##########
          #####
          ########
#        #####
#      #######
##    ##########
###  ######### #
##############
##############
 ############
  ###########
   #########
    #######
     ### ##
     ##   #
          #
          ##
`),Graphics.createImage(`
           ########
          ##########
          ## #######
          ##########
          ##########
          ##########
          #####
          ########
#        #####
#      #######
##    ##########
###  ######### #
##############
##############
 ############
  ###########
   #########
    #######
     ### ##
     ##   ##
     #
     ##
`),Graphics.createImage(`
           ########
          #   ######
          # # ######
          #   ######
          ##########
          ##########
          #####
          ########
#        #####
#      #######
##    ##########
###  ######### #
##############
##############
 ############
  ###########
   #########
    #######
     ### ##
     ##   #
     #    #
     ##   ##
`)],
  cacti: [Graphics.createImage(`
     ##
    ####
    ####
    ####
    ####
    ####  #
 #  #### ###
### #### ###
### #### ###
### #### ###
### #### ###
### #### ###
### #### ###
### #### ###
###########
 #########
    ####
    ####
    ####
    ####
    ####
    ####
    ####
    ####
`),Graphics.createImage(`
   ##
   ##
 # ##
## ##  #
## ##  #
## ##  #
## ##  #
#####  #
 ####  #
   #####
   ####
   ##
   ##
   ##
   ##
   ##
   ##
   ##
`)],
};
dinoGame.IMG.rex.forEach(i=>i.transparent=0);
dinoGame.IMG.cacti.forEach(i=>i.transparent=0);
dinoGame.cacti;
dinoGame.rex;
dinoGame.frame;
dinoGame.oF;
dinoGame.gameStart = function() {
  mmc.closemenu();
  dinoGame.rex = {
    alive : true,
    IMG : 0,
    x : 10, y : 0,
    vy : 0,
    score : 0
  };
  dinoGame.cacti = [ { x:128, IMG:1 } ];
  var random = new Uint8Array(128*3/8);
  for (var i=0;i<50;i++) {
    var a = 0|(Math.random()*random.length);
    var b = 0|(Math.random()*8);
    random[a]|=1<<b;
  }
  dinoGame.IMG.ground = { width: 128, height: 3, bpp : 1, buffer : random.buffer };
  dinoGame.frame = 0;
  dinoGame.oF = setInterval(dinoGame.onFrame, 1000/60*2);
}
dinoGame.gameStop = function() {
  dinoGame.rex.alive = false;
  dinoGame.rex.IMG = 2; // dead
  clearInterval(dinoGame.oF);
  g.drawString("Game Over!",(128-g.stringWidth("Game Over!"))/2,20);
  while(dinoGame.BTNU.isPressed()){}
  mmc.open("dinoGame.dinoLeaveGame");
}

dinoGame.onFrame = function() {
  g.clear();
  if (dinoGame.rex.alive) {
    dinoGame.frame++;
    dinoGame.rex.score++;
    if (!(dinoGame.frame&3)) dinoGame.rex.IMG = dinoGame.rex.IMG?0:1;
    // move rex
    if (dinoGame.BTNU.isPressed() && dinoGame.rex.y==0) dinoGame.rex.vy=4;
    dinoGame.rex.y += dinoGame.rex.vy;
    dinoGame.rex.vy -= 0.2;
    if (dinoGame.rex.y<=0) {dinoGame.rex.y=0; dinoGame.rex.vy=0; }
    // move cacti
    var lastCactix = dinoGame.cacti.length?dinoGame.cacti[dinoGame.cacti.length-1].x:127;
    if (lastCactix<128) {
      dinoGame.cacti.push({
        x : lastCactix + 24 + Math.random()*128,
        IMG : (Math.random()>0.5)?1:0
      });
    }
    dinoGame.cacti.forEach(c=>c.x--);
    while (dinoGame.cacti.length && dinoGame.cacti[0].x<0) dinoGame.cacti.shift();
  } else {
    g.drawString("Game Over!",(128-g.stringWidth("Game Over!"))/2,20);
  }
  g.drawLine(0,60,127,60);
  dinoGame.cacti.forEach(c=>g.drawImage(dinoGame.IMG.cacti[c.IMG],c.x,60-dinoGame.IMG.cacti[c.IMG].height));
  // check against actual pixels
  dinoGame.rexx = dinoGame.rex.x;
  dinoGame.rexy = 38-dinoGame.rex.y;
  if (dinoGame.rex.alive &&
     (g.getPixel(dinoGame.rexx+0, dinoGame.rexy+13) ||
      g.getPixel(dinoGame.rexx+2, dinoGame.rexy+15) ||
      g.getPixel(dinoGame.rexx+5, dinoGame.rexy+19) ||
      g.getPixel(dinoGame.rexx+10, dinoGame.rexy+19) ||
      g.getPixel(dinoGame.rexx+12, dinoGame.rexy+15) ||
      g.getPixel(dinoGame.rexx+13, dinoGame.rexy+13) ||
      g.getPixel(dinoGame.rexx+15, dinoGame.rexy+11) ||
      g.getPixel(dinoGame.rexx+17, dinoGame.rexy+7) ||
      g.getPixel(dinoGame.rexx+19, dinoGame.rexy+5) ||
      g.getPixel(dinoGame.rexx+19, dinoGame.rexy+1))) {
    dinoGame.gameStop();
  }
  g.drawImage(dinoGame.IMG.rex[dinoGame.rex.IMG], dinoGame.rexx, dinoGame.rexy);
  dinoGame.groundOffset = dinoGame.frame&127;
  g.drawImage(dinoGame.IMG.ground, -dinoGame.groundOffset, 61);
  g.drawImage(dinoGame.IMG.ground, 128-dinoGame.groundOffset, 61);
  g.drawString(dinoGame.rex.score,127-g.stringWidth(dinoGame.rex.score));
  g.flip();
}
dinoGame.gameStart();