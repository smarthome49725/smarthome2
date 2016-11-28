$('document').ready(function () {
    var socketIO = io();
    var socket;

    var login;
    var password;

    //SESSION CONTROL
    $('#btLogin').click(function () {
        login = $('#login').val();
        password = CryptoJS.SHA1($('#password').val());
        var password = password.toString(CryptoJS.enc.Base64);
        $('#login').val('');
        $('#password').val('');

        socketIO.emit('BEgetUser');
        socketIO.on('FEgetUsers', function (users) {  
            users = JSON.parse(users);
            if (users.admin[0].login == login && users.admin[0].password == password) {           
                logar(users.admin[0].level);
            } else {                
                getLogin(login, password);                
            }
        });
    });

    //SEND TOKEN FOR BROWSER, NODEJS (SESSION VARIABLE) AND REDIRECTION TO PAGE HOME
    function logar(userData) {
        userData = JSON.parse(userData);               
        var token = Math.floor(Math.random() * 1000000);
        socketIO.emit('BEsetToken', userData.level + ':' + token);

        setCookie("token", token, 1);

        setCookie("level", userData.level, 1);

        setCookie("userID", userData.userID, 1);
        setCookie("nome", userData.nome, 1);
        setCookie("email", userData.email, 1);
        setCookie("nasc", userData.nasc, 1);
        setCookie("tel", userData.tel, 1);       

        location.href = "http://localhost:49725/home.html";
    }

    //SET COOKIE IN BROWSER
    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=http://localhost:49725/home.html";
    }


    /***************************************************************
     *                     EVENTS WEBSOCKET                        *  
     ***************************************************************/
    function eventsWS() {
        socket.onopen = function () {
            console.log('CONNECTION ESTABLISHED!');
        };

        socket.onclose = function () {
            console.log('CLOSED CONNECTION!');
        };

        socket.onerror = function (errorEvent) {
            console.log(errorEvent);
        };

        socket.onmessage = function (messageEvent) {
            console.log("RECEIVED API :" + messageEvent.data);            
            receivedAPI = JSON.parse(messageEvent.data);

            document.u = receivedAPI.msg;           
            
            if (receivedAPI.code == 200) {
                logar(receivedAPI.msg);
            } else {
                $('#alertIndex').html('<div id="alertInvalidLogin" class="alert alert-warning">' +
                '<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>' +
                '<p align="center">Login ou senha inválida!</p>' +
                '</div>');
                setTimeout(function () {
                    $('#alertIndex').html('');
                }, 4000);
            }
        };
    }

    /***************************************************************
     *                    CONNECT WEBSOCKET                        *  
     ***************************************************************/

    function connectWebSocket(ipAPI_RS) {
        socket = new WebSocket('ws://' + ipAPI_RS + '/level1');
        eventsWS();
    }

    /***************************************************************
 *                       GET USERLOGIN                         *  
 ***************************************************************/
    function getLogin(login, password) {
        var cod = {
            cod: "getlogin",
            login: login,
            password: password,
        };
        cod = JSON.stringify(cod);
        console.log(JSON.parse(cod));
        socket.send(cod);
    }

    socketIO.on('getIP_API', function (configIP) {
        var ipAPI_RS = JSON.parse(configIP);
        console.log(ipAPI_RS.configIP[0].ipAPI_RS);
        connectWebSocket(ipAPI_RS.configIP[0].ipAPI_RS);
    });

    socketIO.emit('readIP', 'readIP');

});