/*
c ce * =
( ) / -
7 8 9 +
4 5 6 .
1 2 3 0
*/
//y = 6 x = 32
var clav = [
    ["c","(","7","4","1"],
    ["ce",")","8","5","2"],
    ["*","/","9","6","3"],
    ["=","-","+",".","0"]
  ];
  var cursor = {
    x:0,
    y:0,
    img:Graphics.createImage(`      *
       *
  *******
  *******
       *
      *
  `),
    draw: function(){
    for(ix=0;ix<4;ix++){
      g.clearRect(0+32*ix,33,9+32*ix,63);
    }
    g.drawImage(cursor.img,0+32*cursor.x,33+6*cursor.y);
  },
  select: function(){
      switch(cursor.x){
        case 0:
          switch(cursor.y){
            case 0:
              expression=expression.slice(0,expression.length-1);
              break;
            case 1:
              expression+="(";
              break;
            case 2:
              expression+="7";
              break;
            case 3:
              expression+="4";
              break;
            case 4:
              expression+="1";
              break;
          }
          break;
        case 1:
          switch(cursor.y){
            case 0:
              expression="";
              anser=0;
              g.clearRect(0,0,127,29);
              break;
            case 1:
              expression+=")";
              break;
            case 2:
              expression+="8";
              break;
            case 3:
              expression+="5";
              break;
            case 4:
              expression+="2";
              break;
          }
          break;
        case 2:
          switch(cursor.y){
            case 0:
              expression+="*";
              break;
            case 1:
              expression+="/";
              break;
            case 2:
              expression+="9";
              break;
            case 3:
              expression+="6";
              break;
            case 4:
              expression+="3";
              break;
          }
          break;
        case 3:
          switch(cursor.y){
            case 0:
              eval(`anser = ${expression}`);
              cursor.drawAns();
              break;
            case 1:
              expression+="-";
              break;
            case 2:
              expression+="+";
              break;
            case 3:
              expression+=".";
              break;
            case 4:
              expression+="0";
              break;
          }
          break;
      }
    },
    drawExpr: function(){
      var exprtxt = ["",""];
      if(expression.length > 32){
        exprtxt[0]=expression.slice(0,31);
        exprtxt[1]=expression.slise(32,expression.length-1);
      }
      else{
        exprtxt[0]=expression;
      }
      g.drawString(exprtxt[0],0,0);
      g.drawString(exprtxt[1],0,6);
      g.flip();
    },
    drawAns: function(){
      anstxt = `=${anser}`;
      while(anstxt.length < 31){
        anstxt=" "+anstxt;
      }
      g.drawString(anstxt,0,24);
    }
};
var expression = "";
var anser = 0;
var calcUpdate;
var LeaveGame = {
  "" : {
    "title" :"you want to leave"
  },
    "Yes":function(){g.clear();mmc.extgame();},
    "No":function(){g.clear();startCalc();}
};
function startCalc(){
  mmc.closemenu();
  g.drawRect(0,30,127,31);
  for(ix=0;ix<4;ix++){
    for(iy=0;iy<5;iy++){
      g.drawString(clav[ix][iy],14+32*ix,33+6*iy);
    }
  }
  clearInterval(mainMenuUpdate);
  calcUpdate = setInterval(updateCalc,150);
}
function stopCalc(){
  clearInterval(calcUpdate);
  mainMenuUpdate = setInterval(update,150);
  mmc.open("LeaveGame");
  delay(10);
  g.clearRect(0,33,127,63);
}
function updateCalc(){
  if(joystick.y >= 37){
    if(cursor.y < 4){
      cursor.y += 1;
    }
    else{
      cursor.y = 0;
    }
  }
  else if(joystick.y <= 27){
    if(cursor.y > 0){
      cursor.y -= 1;
    }
    else{
      cursor.y = 4;
    }
  }
  if(joystick.x >= 37){
    if(cursor.x < 3){
      cursor.x += 1;
    }
    else{
      cursor.x = 0;
    }
  }
  else if(joystick.x <= 27){
    if(cursor.x > 0){
      cursor.x -= 1;
    }
    else{
      cursor.x = 3;
    }
  }
  if(buttons.A.isPressed()){
    cursor.select();
  }
  if(buttons.B.isPressed()){
    stopCalc();
  }
  g.clearRect();
  cursor.drawExpr();
  cursor.draw();
}
startCalc();