var net = require('net');
var fs = require('fs');
var cia = require('/public/style/cia.js');

var client = new net.Socket();
var receivedAPI;

global.configIP;

global.connect = function () {

    client.connect(8080, global.configIP.configIP[1].ipPlaca, function () {
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
            //
             cia.acenderLampBathroom();
             cia.sendLampBathroom();                     
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





