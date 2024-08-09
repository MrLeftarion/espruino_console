var calculator = {};
/*
c ce  ans =
m atm *   %
( )   /   -
7 8   9   +
4 5   6   .
1 2   3   0
*/
//y = 6 x = 32
calculator.clav = [
    ["c","m","(","7","4","1"],
    ["ce","atm",")","8","5","2"],
    ["ans","*","/","9","6","3"],
    ["=","%","-","+",".","0"]
  ];
calculator.cursor = {
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
      g.clearRect(0+32*ix,27,9+32*ix,63);
    }
    g.drawImage(calculator.cursor.img,0+32*calculator.cursor.x,27+6*calculator.cursor.y);
  },
  select: function(){
      switch(calculator.cursor.x){
        case 0:
          switch(calculator.cursor.y){
            case 0:
              calculator.expression=calculator.expression.slice(0,calculator.expression.length-1);
              break;
            case 1:
              calculator.expression+=`${calculator.calcM}`
              break;
            case 2:
              calculator.expression+="(";
              break;
            case 3:
              calculator.expression+="7";
              break;
            case 4:
              calculator.expression+="4";
              break;
            case 5:
              calculator.expression+="1";
              break;
          }
          break;
        case 1:
          switch(calculator.cursor.y){
            case 0:
              calculator.expression="";
              calculator.anser=0;
              g.clearRect(0,0,127,23);
              break;
            case 1:
              calculator.calcM = calculator.anser;
              break;
            case 2:
              calculator.expression+=")";
              break;
            case 3:
              calculator.expression+="8";
              break;
            case 4:
              calculator.expression+="5";
              break;
            case 5:
              calculator.expression+="2";
              break;
          }
          break;
        case 2:
          switch(calculator.cursor.y){
            case 0:
              calculator.expression+=`${calculator.anser}`;
              break;
            case 1:
              calculator.expression+="*";
              break;
            case 2:
              calculator.expression+="/";
              break;
            case 3:
              calculator.expression+="9";
              break;
            case 4:
              calculator.expression+="6";
              break;
            case 5:
              calculator.expression+="3";
              break;
          }
          break;
        case 3:
          switch(calculator.cursor.y){
            case 0:
              eval(`calculator.anser = ${calculator.expression}`);
              calculator.cursor.drawAns();
              break;
            case 1:
              calculator.expression+="%";
              break;
            case 2:
              calculator.expression+="-";
              break;
            case 3:
              calculator.expression+="+";
              break;
            case 4:
              calculator.expression+=".";
              break;
            case 5:
              calculator.expression+="0";
              break;
          }
          break;
      }
    },
    drawExpr: function(){
      var exprtxt = ["",""];
      if(calculator.expression.length > 32){
        exprtxt[0]=calculator.expression.slice(0,32);
        exprtxt[1]=calculator.expression.slice(33,calculator.expression.length-1);
      }
      else{
        exprtxt[0]=calculator.expression;
      }
      g.drawString(exprtxt[0],0,0);
      g.drawString(exprtxt[1],0,6);
      g.flip();
    },
    drawAns: function(){
      calculator.anstxt = `=${calculator.anser}`;
      while(calculator.anstxt.length < 31){
        calculator.anstxt=" "+calculator.anstxt;
      }
      g.drawString(calculator.anstxt,0,18);
    }
};
calculator.calcM = 0;
calculator.expression = "";
calculator.anser = 0;
calculator.calcUpdate;
calculator.anstxt=""
calculator.LeaveGame = {
  "" : {
    "title" :"you want to leave"
  },
    "Yes":function(){g.clear();mmc.extgame();calculator=null;},
    "No":function(){g.clear();calculator.startCalc();}
};
calculator.startCalc = function(){
  mmc.closemenu();
  g.drawRect(0,24,127,25);
  for(ix=0;ix<4;ix++){
    for(iy=0;iy<6;iy++){
      g.drawString(calculator.clav[ix][iy],14+32*ix,27+6*iy);
    }
  }
  clearInterval(mainMenuUpdate);
  calculator.calcUpdate = setInterval(calculator.updateCalc,150);
}
calculator.stopCalc = function(){
  clearInterval(calculator.calcUpdate);
  g.clear();
  mainMenuUpdate = setInterval(update,150);
  mmc.open("calculator.LeaveGame");
}
calculator.updateCalc = function(){
  if(joystick.y >= 37){
    if(calculator.cursor.y < 5){
      calculator.cursor.y += 1;
    }
    else{
      calculator.cursor.y = 0;
    }
  }
  else if(joystick.y <= 27){
    if(calculator.cursor.y > 0){
      calculator.cursor.y -= 1;
    }
    else{
      calculator.cursor.y = 5;
    }
  }
  if(joystick.x >= 37){
    if(calculator.cursor.x < 3){
      calculator.cursor.x += 1;
    }
    else{
      calculator.cursor.x = 0;
    }
  }
  else if(joystick.x <= 27){
    if(calculator.cursor.x > 0){
      calculator.cursor.x -= 1;
    }
    else{
      calculator.cursor.x = 3;
    }
  }
  if(buttons.A.isPressed()){
    calculator.cursor.select();
  }
  g.clearRect(0,0,127,17);
  calculator.cursor.drawExpr();
  calculator.cursor.draw();
  if(buttons.B.isPressed()){
    calculator.stopCalc();
  }
}
calculator.startCalc();