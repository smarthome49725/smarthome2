﻿var net = require('net');
var fs = require('fs');

var client = new net.Socket();
var receivedAPI;

global.configIP;

global.connect = function () {

    client.connect(8080, global.configIP.configIP[1].ipPlaca, function () {
        console.log('Connected');
        client.write('HELLO SOFTWARE, HELLO SOFTWARE, HELLO SOFTWARE, HELLO SOFTWARE, HELLO SOFTWARE, HELLO SOFTWARE, HELLO SOFTWARE, HELLO SOFTWARE');
        console.log(client);
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
    setTimeout(connect, 1000);
});

client.on('error', (err) => {
    console.error(err);
});

//LOAD CONFIG AND CONNECT
global.loadConfig = function () {
    fs.readFile("public/config/config.json", 'utf8', function (err, configIP) {
        if (err) {
            return console.log(err);
        }
        console.log('READ CONFIG 200 OK');
        global.configIP = JSON.parse(configIP); // Para configurar o IP do websocketclient.js                        
        console.log(global.configIP.configIP[1].ipPlaca);
        connect();
    });
}
global.loadConfig();





