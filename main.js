I2C1.setup({scl:B8,sda:B9});
var g = require("SSD1306").connect(I2C1);
SPI2.setup({mosi:B15,miso:B14,sck:B13,});
var fs = require("fs");
E.connectSDCard(SPI2, A10);
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
    joystick.x = Math.round(analogRead(joystick.pinX)*63);
    joystick.y = Math.round(analogRead(joystick.pinY)*63);
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
  X: require('@amperka/button').connect(A0),
  Y: require('@amperka/button').connect(A5),
  A: require('@amperka/button').connect(A7),
  B: require('@amperka/button').connect(A6),
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
  change: function(menuName){
  if(m != null){
      g.clear();
      eval(`m = menu.list(g, ${menuName});`);
      mmc.lastmenu = mmc.nowmenu;mmc.nowmenu = menuName;
    }
  },
  openMenu: function(menuName){
    if(m == null){
      g.clear();
      eval(`m = menu.list(g, ${menuName});`);
      mmc.nowmenu = menuName;
    }
  },
  menuAddElement: function(menuName,elementName,element){
  eval(`${menuName}.${elementName}=${element}`);
  },
  lastmenu: "",
  nowmenu: "",
  closemenu: function(){m=null;g.clear();},
  openlastmenu: function(){mmc.openMenu(mmc.nowmenu);},
};
var my = 0;
/*function edc( step){
  var stepsCount = 1;
  var up = Graphics.createImage(`
  *
 ***
* * *
  *
`);
  var gpad = function(){
    g.scroll(50,50);
    g.drawCircle(100,30,4);
    g.drawCircle(100,50,4);
    g.drawCircle(90,40,4);
    g.drawCircle(110,40,4);
    g.drawCircle(30,40,10);
    //g.drawImage(up,28,25);
    g.drawRect(45,10,85,30);

  };
  g.clear();
  gpad();
  g.fillCircle(80,40,1);
  m = g.dump();
  g.flip();
}*/
//var boolean = false;
var contrastValue = 150;
var mainmenu = {
  "" : {
    "title" : " Menu "
  },
  " Play" : function(){mmc.change("playMenu");},
  " Submenu" : function() {mmc.change("submenu"); },
  //" A Boolean" : {value : boolean,format : v => v?"On":"Off",onchange : v => { boolean=v; }},
  " settings" : function() {mmc.change("settingsMenu"); },
  " testing console" : function() {mmc.change("testingMenu");},
  " eval('Hello world!')" : function(){
    eval(`
      for(i=5;i>0;i--){
        console.log(i);
        delay(1000)
      }
      delay(1000);
      console.log("Hello world!");
    `);
  }
};
var testingMenu = {
  "" : {
    "title" : "test our console"
  },
  " LED1 on/off" : function() {LED1.write(!LED1.read());},
  " Led2 on/off" : function() {LED2.write(!LED2.read());},
  " display test" : function() {
    m = null;
    g.clear();
    for(i=0;i<128;i++){
      g.drawLine(i,0,i,63);
      g.flip();
    }delay(500);
    mmc.change("testingMenu");
  },
  " joystic test" : function(){
    mmc.closemenu();
    jt = setInterval(function (){
      var xv = joystick.x;
      var yv = joystick.y;
      g.clear();
      g.drawRect(0,0,63,63);
      g.drawLine(xv,yv-2,xv,yv+2);
      g.drawLine(xv-2,yv,xv+2,yv);
      g.drawString(`x: ${xv}`,70,20);
      g.drawString(`y: ${yv}`,70,30);
      g.flip();
      if(joystick.button.isPressed()){
        clearInterval(jt);
        mmc.openlastmenu();
      }
    },100);},
  " < Back" : function(){mmc.change("mainmenu");}
};
var submenu = {
  "" : {
    "title" : " SubMenu "
  },
  " edc" : function() {m=null;edc();},
  " testing console" : function() {mmc.change("testingMenu");},
  " < Back" : function() {mmc.change("mainmenu");}
};
var playMenu = {
  "" : {
    "title" : "games",
  },
  "test0" : function(){g.setPixel(63,40,0);g.flip();},
  "test1" : function(){g.setPixel(63,40);g.flip();},
  "test2" : function(){console.log(g.getPixel(63,40));},
  "< Back" : function() {mmc.change("mainmenu");}
};
var settingsMenu = {
  "" : {
    "title" : " Settings "
  },
  " contrast" : {value : contrastValue,min:0,max:150,step:10,wrap:true,onchange : v => { contrastValue=v; }},
  " Set" : function(){
    g.setContrast(contrastValue);
  },
  " < Back" : function() {mmc.change("mainmenu");}
};
function onInit() {
  mmc.openMenu("mainmenu");
}
function update(){
  if(joystick.y >= 37 && m != null){
    m.move(1);
  }
  else if(joystick.y <= 27 && m != null){
    m.move(-1);
  }
  if(joystick.button.isPressed() && m != null){
    m.select();
  }
}
var mainMenupdate = setInterval(update,150);
onInit();