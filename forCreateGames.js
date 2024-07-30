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
  addMenu: function(menuName){
      eval(`m = menu.list(g, ${menuName});`);
  },
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
     console.log(i);
  }
}


//


function update(){
  if(joystick.y >= 37 &&  m != null){
    m.move(1);
  }
  else if(joystick.y <= 27 && m != null){
    m.move(-1);
  }
  if(buttons.A.isPressed() && m != null){
    m.select();
  }
}
var mainMenuUpdate = setInterval(update,150);