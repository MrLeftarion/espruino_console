var btndmp = require('@amperka/button').connect(B10);
var dmp = setInterval(function(){if(btndmp.isPressed()){g.dump();}},500);