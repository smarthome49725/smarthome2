var net = require('net');
var fs = require('fs');
//var cia = require('../../public/style/cia.js');

var client = new net.Socket();
var receivedAPI;
var host;
global.configIP;
var temper = require('../temperature.js'),
    ExeStepper = require('../stepper.js'),
    televisor = require('../tv_smart.js'),
    ar = require('../airconditioning.js'),
    control_light = require('../lamps.js');

function lightBathroom() {
    socket.emit("lightBathroom", "light on bathroom");
    control_light.bathroom();
}

function lightKitchen(){
    socket.emit("lightKitchen", "light on kitchen");
    control_light.kitchen();
}

function lightBedroom(){
    socket.emit("lightBedroom", "light on bedRoom");
    control_light.bedroom();
}

function lightRoom1(){
    socket.emit("lightRoom1", "light on lightRoom1");
    control_light.roomOne();
}

function lightRoom2(){
    socket.emit("lightRoom2", "light on lightRoom2");
    control_light.roomTwo();
}

function tvOnOff(){
    socket.emit("TV", "on-off TV");
    televisor.control_tv();
}

function tvIncrease(){
    socket.emit("TV-Increase", "increase tv");
    televisor.increase();
}

function tvDecrease(){
    socket.emit("TV-Decrease", "decrease tv");
    televisor.decrease();
}

function curtain(){
    socket.emit("curtain", "curtain");
    ExeStepper.controlMotor();
}

function airConditioning(){
    socket.emit("air-conditioning", "on-off air");
    ar.control_ar();
}

function airConditioningDecrease(){
    socket.emit("air-conditioning-decrease", "on-off air");
    ar.decrease();
}

function airConditioningIncrease(){
    socket.emit("air-conditioning-increase", "on-off air");
    ar.increase();
}

/*******************************************************
 *                   OPEN THE DOOR                     *
 *******************************************************/

function openTheDoor(){    
    app.sensors.door.digitalWrite(1);
    setTimeout(function(){
			app.sensors.door.digitalWrite(0);
		}, 3000);
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
    //console.log('Received: ' + data);
    dataReiceived = JSON.parse(data);    
    switch (dataReiceived.code) {
        case "PORT":
            //openTheDoor();
            var userCustom = JSON.parse(dataReiceived.msg);
            console.log(userCustom.lightBathroom);         
            if (userCustom.lightBathroom == "True"){
                if (control_light.bathroom == 0){
                    console.log('liguei, biiiiur');
                    lightBathroom();
                }

            }
            else if (userCustom.lightKitchen == True){
                if (control_light.kitchen == 0){
                    lightKitchen();
                }

            }
            else if (userCustom.lightBedroom == True){
                if (control_light.bedroom == 0){
                    lightBedroom();
                }

            }
            else if (userCustom.lightRoom1 == True){
                if (control_light.roomOne == 0){
                    lightRoom1();
                }

            }
            else if (userCustom.lightRoom2 == True){
                if (control_light.roomTwo == 0){
                    lightRoom2();
                }

            }
            else if (userCustom.TV == True){
                if (televisor.status_tv == 0){
                    tvOnOff();
                }

            }

            else if (userCustom.curtain == True){
                if (ExeStepper.motor == 0){
                    curtain();
                }

            }
            else if (userCustom.air_conditioning == True){
                if (ar.status_ar == 0){
                    airConditioning();
                }

            }
            break;
    }
});

client.on('close', function () {
    console.log('Connection closed');
    setTimeout(connect, 3000);
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

