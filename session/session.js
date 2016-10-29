/***************************************************************
 *                         SESSION                             *  
 ***************************************************************/
var fs = require('fs');

var tokenLevel1;
var tokenLevel2;
var tokenLevel3;

//SET TOKEN IN THE SESSION VARIABLE
global.socket.on('connection', function (socket) {
    socket.on('BEsetToken', function (SESSION) {
        SESSION = SESSION.split(':');
        if (SESSION[0] == "1") {
            tokenLevel1 = SESSION[1];
        } else {
            if (SESSION[0] == "2") {
                tokenLevel2 = SESSION[1];
            } else {
                tokenLevel3 = SESSION[1];
            }
        }
    });
});

//SEND TOKEN FOR FRONT-END
global.socket.on('connection', function (socket) {
    socket.on('getToken', function (level) {
        if (level == "1") {
            socket.emit('session', tokenLevel1);
        } else {
            if (level == "2") {
                socket.emit('session', tokenLevel2);
            } else {
                socket.emit('session', tokenLevel3);
            }
        }
        console.log("send Token level: " + level);

    });
});


//SEND USER ADMIN (JSON) FOR FRONT-END
global.socket.on('connection', function (socket) {
    socket.on('BEgetUser', function () {
        fs.readFile("models/SH2/users.json", 'utf8', function (err, users) {
            if (err) {
                return console.log(err);
            }
            console.log('READ USERS 200 OK');
            socket.emit('FEgetUsers', users);
        });


    });
});