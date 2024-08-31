//dump screen
var btndmp = require('@amperka/button').connect(B3);
var dmp = setInterval(function(){if(btndmp.isPressed()){g.dump();}},500);
//
function start(){}//function for oled
var settingsValue = {//set before uploading
  contrast : 150, //from 0 to 150
  joystick_update_time: 10, //from 10 to 100
};
function setSettings(){
  g.setContrast(settingsValue.contrast);
  joystick.changeUpdateTime();
}
var s = new SPI();
s.setup({mosi: A7, sck:A5});
var g = require("SSD1306").connectSPI(s, A4 /* DC */, A6 /* RST */, start, { cs : A10});
g.clear();
g.flip();
var sdCard = require('@amperka/card-reader').connect(B8);
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
setSettings();
var mainMenuUpdate = setInterval(update,150);