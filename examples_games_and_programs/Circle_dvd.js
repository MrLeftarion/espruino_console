var Circle = {};
Circle.radius = 5;
Circle.sleep_time = 10;
Circle.ix = 5;
Circle.iy = 5;
Circle.nx = 1;
Circle.ny = 1;
Circle.menu = {
    enter: {
      "": {"title" :"settings"},
      "radius": {value : Circle.radius, min:1, max:31, step:1, wrap:true, onchange : v => {Circle.radius = v;}},
      "sleep time": {value : Circle.sleep_time, min:1, max:250, step:1, wrap:true, onchange : v => {Circle.sleep_time = v;}},
      "start": function(){Circle.functions.start();}
    },
    exit: {
      "" : {
        "title" :"you want to leave?"
      },
      "Yes":function(){Circle.functions.exit();},
      "No":function(){mmc.open('Circle.menu.enter');}
    }
  };
Circle.functions = {
    start: function(){
      mmc.closemenu();
      g.clear();
      Circle.functions.update();
      Circle.ix = Circle.radius;
      Circle.iy= Circle.radius;
      clearInterval(mainMenuUpdate);
    },
    update: function(){
      while (buttons.B.isPressed()==false){
        Circle.ix += 1 * Circle.nx;
        Circle.iy += 1 * Circle.ny;
        g.clear();
        g.drawRect(0,0,127,63);
        g.drawCircle(Circle.ix,Circle.iy,Circle.radius);
        g.flip();
        if((Circle.ix == 127-Circle.radius) || (Circle.ix == Circle.radius-1)){
          Circle.nx *= -1;
        }
        if((Circle.iy == 63-Circle.radius) || (Circle.iy == Circle.radius-1)){
          Circle.ny *= -1;
        }
        delay(Circle.sleep_time);
      }
      mainMenuUpdate = setInterval(update,150);
      mmc.open('Circle.menu.exit');
    },
    exit: function(){
      g.clear();
      mmc.extgame();
      Circle = null;
    }
};

mmc.open('Circle.menu.enter');