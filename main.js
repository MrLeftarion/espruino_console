function start(){}//function for oled
var settingsValue = {//set before uploading
  contrast : 150, //from 0 to 150
  joystick_update_time: 10, //from 10 to 100
};
var s = new SPI();
s.setup({mosi: A7, sck:A5});
var g = require("SSD1306").connectSPI(s, A4 /* DC */, A6 /* RST */, start, { cs : A10});
g.flip();
var sdCard = require('@amperka/card-reader').connect(B8);
var joystick = {
  pinX: new Pin(A1),
  pinY: new Pin(B0),
  button: require('@amperka/button').connect(B10),
  x: 31,
  y: 31,
  xl: 31,
  yl: 31,
  updateTime: settingsValue.joystick_update_time,
  update: function(){
    joystick.xl = joystick.x;
    joystick.yl = joystick.y;
    joystick.x = Math.round((analogRead(joystick.pinX)*64+joystick.xl)/2);
    joystick.y = Math.round((analogRead(joystick.pinY)*64+joystick.yl)/2);
    g.drawString(joystick.x,20,70);
    g.flip();
  },
  start: function(){
    joystick.pinX.mode('analog');
    joystick.pinY.mode('analog');
    joystick.interval = setInterval(function(){joystick.update();},settingsValue.joystick_update_time);
  },
  changeUpdateTime: function(){
    clearInterval(joystick.interval);
    joystick.interval = setInterval(function(){joystick.update();},settingsValue.joystick_update_time);
  }
};
var buttons = {
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
  },
  addElement: function(menuName,elementName,element){
    eval(`${menuName}.${elementName}=${element}`);
  },
  closemenu: function(){m=null;g.clear();},
  extgame: function(){mmc.open("gamesListMenu");},
};
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
      g.drawString(`to exit,
press B`,96,52);
      g.flip();
      if(buttons.B.isPressed()){
        clearInterval(jt);
        mmc.open("testingMenu");
      }
    },20);},
  "buttons test":function(){
    mmc.closemenu();
    bt = setInterval(function (){
      g.clear();
      g.drawCircle(105,35,5);
      g.drawCircle(90,45,5);
      g.drawCircle(31,40,10);
      g.drawString("to exit, move the joystick left",1,55);
      g.drawRect(43,10,83,30);
      if(buttons.A.isPressed()){g.fillCircle(90,45,4);}
      if(buttons.B.isPressed()){g.fillCircle(105,35,4);}
      if(joystick.button.isPressed()){g.fillCircle(31,40,4);}
      g.flip();
      if(joystick.x <= 25){
        clearInterval(bt);
        mmc.open("testingMenu");
      }
    },20);
  },
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
  "contrast" : {value : settingsValue.contrast, min:10, max:150, step:10, wrap:true, onchange : v => {settingsValue.contrast=v;}},
  "joystick time update" : {value : settingsValue.joystick_update_time, min:10, max:100, step:5, wrap:true, onchange : v => {settingsValue.joystick_update_time = v;}},
  "Set" : function(){
    g.setContrast(settingsValue.contrast);
    joystick.changeUpdateTime();
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
var mainMenuUpdate = setInterval(update,150);
onInit();