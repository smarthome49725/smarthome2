/***************************************************************
 *                     CONFIG IP-API                           *  
 ***************************************************************/
var fs = require('fs');

var configIPBuffer;
//READ FILE CONFIG IP
global.socket.on('connection', function (socket) {
    socket.on('readIP', function (configIP) {
        fs.readFile("config/config.json", 'utf8', function (err, configIP) {
            if (err) {
                return console.log(err);
            }
            console.log('READ CONFIG 200 OK');
            socket.emit('getIP_API', configIP);

        });
    });
});

//WRITE FILE CONFIG IP
global.socket.on('connection', function (socket) {
    socket.on('saveIP', function (configIP) {
        var jsonConfig = JSON.parse(configIP);
        fs.writeFile("config/config.json", configIP, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("SAVE CONFIG 200 OK");
                configIPBuffer = JSON.parse(configIP);
                if (global.configIP.configIP[0].ipAPI_RS != configIPBuffer.configIP[0].ipAPI_RS) {
                    global.configIP.configIP[0].ipAPI_RS = configIPBuffer.configIP[0].ipAPI_RS;
                    global.loadConfig();
                }
                socket.emit('getIP_API', configIP);
            }
        });


    });
});