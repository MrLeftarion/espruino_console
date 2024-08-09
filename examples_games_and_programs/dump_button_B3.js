var btndmp = require('@amperka/button').connect(B3);
var dmp = setInterval(function(){if(btndmp.isPressed()){g.dump();}},500);