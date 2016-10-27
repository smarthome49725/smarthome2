var express = require('express.io'),
    Cylon = require('cylon'),
    temper = require('./models/temperature.js'),
    ExeStepper = require('./models/stepper.js'),
    televisor = require('./models/tv_smart.js'),
    ar = require('./models/airconditioning.js'),
    control_light = require('./models/lamps.js');


var fs = require('fs');
var PeerServer = require('peer').PeerServer;
var server = PeerServer({ port: 9000, path: '/smarthome2' });

app = express();
socket = require('socket.io').listen(app.listen(49725));

app.sensorsReady = false;
app.sensors = {};

app.use(express.static(__dirname + '/public'));
app.http().io();



//<SMARTHOME2 SAVE-IP>

/***************************************************************
 *                     CONFIG IP-API                           *  
 ***************************************************************/
var configIPBuffer;
//READ FILE
socket.on('connection', function (socket) {
    socket.on('readIP', function (configIP) {
        fs.readFile("public/config/config.json", 'utf8', function (err, configIP) {
            if (err) {
                return console.log(err);
            }
            console.log('READ CONFIG 200 OK');            
            socket.emit('getIP_API', configIP);

        });
    });
});

//WRITE FILE
socket.on('connection', function (socket) {
    socket.on('saveIP', function (configIP) {
        var jsonConfig = JSON.parse(configIP);
        fs.writeFile("public/config/config.json", configIP, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("SAVE CONFIG 200 OK");
                configIPBuffer = JSON.parse(configIP);
                if (global.configIP.configIP[1].ipPlaca != configIPBuffer.configIP[1].ipPlaca) {
                    global.configIP.configIP[1].ipPlaca = configIPBuffer.configIP[1].ipPlaca;
                    global.loadConfig();
                }
                socket.emit('getIP_API', configIP);
            }
        });


    });
});

//</SMARTHOME2 SAVE-IP>


//webSocketClient +++
require('./models/SH2/clientAPI.js');
//webSocketClient ---


//SMARTHOME2 WebRTC
socket.on('connection', function (socket) {
    socket.on('requestPeerId', function (peer_id) {
        var PEERID;
        if (peer_id === 'getPeerId') {
            console.log('requestPeerId: false');
            PEERID = peerId.getPeerId();
            socket.emit('requestPeerId', PEERID);


        } else {
            peerId.setPeerId(peer_id);
            console.log('requestPeerId: ' + peer_id);
        }
    });
});

var peerId = {
    peer_id: "",
    setPeerId: function (peer_id) {
        this.peer_id = peer_id;
    },
    getPeerId: function () {
        return this.peer_id;
    }
};

var flagM = true;
socket.on('connection', function (socket) {
    socket.on('flag', function (flag) {
        socket.emit('flag', flagM);
        flagM = false;

        console.log('setando false para flag!');



    });
});
//</SMARTHOME2-WebRtc>




Cylon.robot({
  connections: {
    galileo: {
      adaptor: 'intel-iot'
    }
  },

  devices: {
    temp_bathroom: {driver: 'analogSensor',pin: 0},
    temp_kitchen: {driver: 'analogSensor', pin: 1},
    temp_bedroom: {driver: 'analogSensor', pin: 2},
    temp_room: {driver: 'analogSensor', pin: 3},
    relay_bathroom: {driver: 'direct-pin',pin: 6},
    relay_kitchen: {driver: 'direct-pin',pin: 7},
    relay_room: {driver: 'direct-pin',pin: 8},
    relay_roomTwo: {driver: 'direct-pin',pin: 9},
    relay_bedroom: {driver: 'direct-pin',pin: 10},
    active_ar: {driver: 'direct-pin',pin: 5},
    ar_Volume: {driver: 'direct-pin', pin: 13},
    tv_Increase: {driver: 'direct-pin', pin: 4},
    tv_Decrease: {driver: 'direct-pin', pin: 11},
    tv_On_Off: {driver: 'direct-pin', pin: 12},
    //led_On_Off: {driver: 'direct-pin', pin:13}
  },

  work: function (my) {
   app.sensorsReady = true;
   app.sensors = {
   temp_bathroom: my.temp_bathroom,
   temp_kitchen: my.temp_kitchen,
   temp_bedroom: my.temp_bedroom,
   temp_room: my.temp_room,
   relay_bathroom: my.relay_bathroom,
   relay_kitchen: my.relay_kitchen,
   relay_room: my.relay_room,
   relay_roomTwo: my.relay_roomTwo,
   relay_bedroom: my.relay_bedroom,
   active_ar: my.active_ar,
   tv_Increase: my.tv_Increase,
   tv_Decrease: my.tv_Decrease,
   ar_Volume: my.ar_Volume,
   tv_On_Off: my.tv_On_Off
  };
    every((4).second(), function () {
    app.tempBroadcast();
    });
  }
}).start();

app.tempBroadcast = function () {
    temper.temperature();
},

    app.relay_connect_allController = function () {
        control_light.control_lampAll();
    },

    app.relay_bathroomController = function () {
        control_light.bathroom();
    },

    app.relay_kitchenController = function () {
        control_light.kitchen();
    },

    app.relay_bedroomController = function () {
        control_light.bedroom();
    },

    app.relay_roomController = function () {
        control_light.roomOne();
    },

    app.relay_roomTwoController = function () {
        control_light.roomTwo();
    },

    app.control_curtain = function () {
        ExeStepper.controlMotor();
    };

app.televisor_on_off = function () {
    televisor.control_tv();
};

app.televisor_increase = function () {
    televisor.increase();
};

app.televisor_decrease = function () {
    televisor.decrease();
};

app.ar_on_off = function () {
    ar.control_ar();
};

app.ar_increase = function () {
    ar.increase();
};

app.ar_decrease = function () {
    ar.decrease();
};

control_light.socket_Lamps();

ExeStepper.socket_curtain();

televisor.socket_Televisor();

ar.socket_AR();

console.log('Smart Home-2 - C.I.A - 49725');
