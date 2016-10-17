var net = require('net');
var fs = require('fs');

var client = new net.Socket();

global.configIP;

global.connect = function () {
    
    client.connect(8080, global.configIP.configIP[1].ipPlaca, function () {
        console.log('Connected');
        client.write('Hello, server! Love, Client.');

        /*function sendNumber() {
            if (client.connected) {
                var number = Math.round(Math.random() * 0xFFF);
                client.write(number.toString());
                setTimeout(sendNumber, 1000);
            }
        }
        sendNumber();*/
    })
}



client.on('data', function (data) {
    console.log('Received: ' + data);
    //client.destroy(); // kill client after server's response
});

client.on('close', function () {    
    console.log('Connection closed');
    //client.destroy(); // kill client after server's response
    setTimeout(connect, 1000);
    //connect();

});

client.on('error', (err) => {      
    console.error(err);
});



global.lerFile = function () {
    fs.readFile("public/config/config.json", 'utf8', function (err, configIP) {
        if (err) {
            return console.log(err);
        }
        console.log('READ CONFIG 200 OK');
        global.configIP = JSON.parse(configIP); // Para configurar o IP do websocketclient.js                
        console.log('LEU');
        console.log(global.configIP.configIP[1].ipPlaca);
        connect();//CONNECTION
    });
}
global.lerFile();





