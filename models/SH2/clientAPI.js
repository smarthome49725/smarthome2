var net = require('net');
var fs = require('fs');
//var cia = require('../../public/style/cia.js');

var client = new net.Socket();
var receivedAPI;
var host;
global.configIP;

lightBathroom = function(){
    socket.emit("lightBathroom", "light on bathroom");
    control_light.bathroom();
}

lightKitchen = function(){
    socket.emit("lightKitchen", "light on kitchen");
    control_light.kitchen();
}

lightBedroom = function(){
    socket.emit("lightBedroom", "light on bedRoom");
    control_light.bedroom();
}

lightRoom1 = function(){
    socket.emit("lightRoom1", "light on lightRoom1");
    control_light.roomOne();
}

lightRoom2 = function(){
    socket.emit("lightRoom2", "light on lightRoom2");
    control_light.roomTwo();
}

tvOnOff =  function(){
    socket.emit("TV", "on-off TV");
    televisor.control_tv();
}

tvIncrease = function(){
    socket.emit("TV-Increase", "increase tv");
    televisor.increase();
}

tvDecrease = function(){
    socket.emit("TV-Decrease", "decrease tv");
    televisor.decrease();
}

curtain = function(){
    socket.emit("curtain", "curtain");
    ExeStepper.controlMotor();
}

airConditioning = function(){
    socket.emit("air-conditioning", "on-off air");
    ar.control_ar();
}

airConditioningDecrease = function(){
    socket.emit("air-conditioning-decrease", "on-off air");
    ar.decrease();
}

airConditioningIncrease = function(){
    socket.emit("air-conditioning-increase", "on-off air");
    ar.increase();
}

global.connect = function () {
    console.log("CONNECTING WITH: " + host[0] + ":" + host[1]);
    client.connect(host[1], host[0], function () {
        console.log('Connected');
        client.write('NODEJS /level0 HTTP/1.1 \n'+
        'Host: 000.000.000.000\n' +
        'Connection: Upgrade\n'+
        'Pragma: no-cache\n'+
        'Cache-Control: no-cache\n'+
        'Upgrade: websocket\n'+
        'Origin: http://localhost:49725\n'+
        'Sec-WebSocket-Version: 13\n'+        
        'Accept-Encoding: gzip, deflate, sdch\n'+
        'Accept-Language: pt-BR,pt;q=0.8,en-US;q=0.6,en;q=0.4\n');                
    })
}

client.on('data', function (data) {
    console.log('Received: ' + data);
    receivedAPI = JSON.parse(data);    
    switch (receivedAPI.code) {
        case "PORT":
            console.log(receivedAPI.msg);
            client.write(receivedAPI.code + " 200");         
            break;
        case "LAMP":
            console.log(receivedAPI.msg);            
            break;
        case "TV":
            console.log(receivedAPI.msg);
            break;
    }
});

client.on('close', function () {
    console.log('Connection closed');
    //setTimeout(connect, 3000);
    //setTimeout(acenderLamp1, 5000);
});

client.on('error', (err) => {
    console.error(err);
});

//LOAD CONFIG AND CONNECT
global.loadConfig = function () {
    fs.readFile("config/config.json", 'utf8', function (err, configIP) {
        if (err) {
            return console.log(err);
        }
        console.log('READ CONFIG 200 OK');
        global.configIP = JSON.parse(configIP); // Para configurar o IP do websocketclient.js
        host = global.configIP.configIP[0].ipAPI_RS;
        host = host.split(':');
        connect();
    });
}
global.loadConfig();




/*******************************************************
 *                   OPEN THE DOOR                     *
 *******************************************************/
console.log("OPEN THE DOOR");
setInterval(function() { 
            console.log("setTimeout: Ja passou 1 segundo!"); 
        }, 10000);


// function abrirPorta(){    
    
//     console.log("While Porta");  
    

//     console.log("Abrir PORTA");    
//     //app.sensors.door.digitalWrite(1);
//     //app.sensors.door.digitalWrite(0);
    

// }

