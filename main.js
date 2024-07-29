function start(){}
var s = new SPI();
s.setup({mosi: A7, sck:A5});
var g = require("SSD1306").connectSPI(s, A4 /* DC */, A6 /* RST */, start, { cs : A0});
g.flip();
var sdCard = require('@amperka/card-reader').connect(B8);

var joystick = {
  pinX: new Pin(A1),
  pinY: new Pin(B0),
  button: require('@amperka/button').connect(B1),
  x: 31,
  y: 31,
  xl: 31,
  yl: 31,
  update: function(){
    joystick.xl = joystick.x;
    joystick.yl = joystick.y;
    joystick.x = Math.round(analogRead(joystick.pinX)*64);
    joystick.y = Math.round(analogRead(joystick.pinY)*64);
    g.drawString(joystick.x,20,70);
    g.flip();
  },
  start: function(){
    joystick.pinX.mode('analog');
    joystick.pinY.mode('analog');
    setInterval(function(){joystick.update();},10);
  }
};
var buttons = {
  //X: require('@amperka/button').connect(),
  //Y: require('@amperka/button').connect(),
  A: require('@amperka/button').connect(B8),
  B: require('@amperka/button').connect(B9),
};
joystick.start();
g.clear();
g.invert = function(x1,y1,x2,y2){
  for(ix=x1;ix<=x2;ix++){
    for(iy=y1;iy<=y2;iy++){
      if(g.getPixel(ix,iy)==1){
        g.setPixel(ix,iy,0);
      }
      else{
        g.setPixel(ix,iy,1);
      }
    }
  }
};
var games = [];
function delay(waitTime){
  waitTime/=1000;
  old_time = getTime();
  for(var delta_time;;){
    delta_time = getTime() - old_time;
    if (delta_time > waitTime){
      break;
    }
  }
}
var menu = require("graphical_menu");
var m;
var mmc = {//my menu controller - mmc
  open: function(menuName){
      g.clear();
      eval(`m = menu.list(g, ${menuName});`);
      mmc.nowmenu = menuName;
  },
  addElement: function(menuName,elementName,element){
    eval(`${menuName}.${elementName}=${element}`);
  },
  nowmenu: "",
  closemenu: function(){m=null;g.clear();},
  openlastmenu: function(){mmc.open(mmc.nowmenu);},
  extgame: function(){mmc.open("gamesListMenu");},
};
var my = 0;
var contrastValue = 150;
var mainmenu = {
  "" : {
    "title" : " Menu "
  },
  "Play" : function(){mmc.open("gamesListMenu");},
  "settings" : function(){mmc.open("settingsMenu"); },
  "testing console" : function(){mmc.open("testingMenu");},
};
var testingMenu = {
  "" : {
    "title" : "test our console"
  },
  "LED1 on/off" : function(){LED1.write(!LED1.read());},
  "Led2 on/off" : function(){LED2.write(!LED2.read());},
  "display test" : function() {
    m = null;
    g.clear();
    for(i=0;i<128;i++){
      g.drawLine(i,0,i,63);
      g.flip();
    }
    while(!buttons.B.isPressed()){}
    mmc.open("testingMenu");
  },
  "joystic test" : function(){
    mmc.closemenu();
    jt = setInterval(function (){
      var xv = joystick.x-1;
      var yv = joystick.y-1;
      g.clear();
      g.drawRect(0,0,63,63);
      g.drawLine(xv,yv-2,xv,yv+2);
      g.drawLine(xv-2,yv,xv+2,yv);
      g.drawString(`x: ${xv+1}`,70,20);
      g.drawString(`y: ${yv+1}`,70,30);
      g.flip();
      if(buttons.B.isPressed()){
        clearInterval(jt);
        mmc.openlastmenu();
      }
    },20);},
  "< Back" : function(){mmc.open("mainmenu");}
};
var gamesListMenu = {
  "" : {
    "title" : "games and programms",
  },
  "< Back" : function(){mmc.open("mainmenu");}
};
function startGame(path){
  eval(sdCard.readFile(path));
}
function checkGames(){
  games = sdCard.readDir('games');
  gamesListMenu = {
    "" : {
    "title" : "games and programms",
    },
    "< Back" : function(){mmc.open("mainmenu");}
  };
  for(i=0;i<games.length;i++){
    var gamesname = games[i].split(".");
    mmc.addElement("gamesListMenu",gamesname[0],`function(){startGame("games\\\\${gamesname[0]}.${gamesname[1]}");}`);
  }
}
var settingsMenu = {
  "" : {
    "title" : " Settings "
  },
  "reconnoct sd card": function(){var sdCard = require('@amperka/card-reader').connect(A10);},
  "Check out the games" : function(){checkGames();},
  "contrast" : {value : contrastValue,min:10,max:150,step:10,wrap:true,onchange : v => { contrastValue=v; }},
  "Set" : function(){
    g.setContrast(contrastValue);
  },
  "< Back" : function() {mmc.open("mainmenu");}
};
function onInit() {
  checkGames();
  mmc.open("mainmenu");
}
function update(){
  if(joystick.y >= 39 &&  m != null){
    m.move(1);
  }
  else if(joystick.y <= 25 && m != null){
    m.move(-1);
  }
  if(buttons.A.isPressed() && m != null){
    m.select();
  }
}
var mainMenupdate = setInterval(update,150);
onInit();