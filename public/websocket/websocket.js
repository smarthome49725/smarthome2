﻿$('document').ready(function () {
    var socket;
    var socketIO = io();


    var ipPlaca;
    var configIP;

    var ipAPI_RS = '0.0.0.0';// CAPTURAR IP GUARDADO NO BD DA PLACA (MONGO DB)   
   
    /***************************************************************
     *                 NAV SHOW AND HIDE                           *  
     ***************************************************************/

    $('#divForm').hide();
    $('#divConfigIP').hide();
    $('#step2').hide();

    var flag = true;
    var flag2 = true;
    var flag3 = true;

    $('#btMonitoring').click(function () {
        if (flag === true) {
            $('#step2').show();
            $('#divForm').hide();
            $('#divConfigIP').hide();
            flag = false;
            flag2 = true;
            flag3 = true;
        } else {
            $('#step2').hide();            
            flag = true;
        }
    });

    $('#cadastro').click(function () {
        if (flag2 === true) {
            $('#divForm').show();
            $('#step2').hide();
            $('#divConfigIP').hide();            
            flag2 = false;
            flag = true;
            flag3 = true;
        } else {
            $('#divForm').hide();            
            flag2 = true;
        }
    });
    
    $('#btShowConfig').click(function () {
        if (flag3 === true) {
            $('#divConfigIP').show();
            $('#step2').hide();
            $('#divForm').hide();
            flag3 = false;
            flag = true;
            flag2 = true;
        } else {
            $('#divConfigIP').hide();            
            flag3 = true;
        }
    });    
   

    /***************************************************************
     *         CONFIG IP-API AND CONNECTION WEBSOCKET              *  
     ***************************************************************/

    socketIO.emit('readIP', 'readIP'); //emite sinal para receber o IP guardado na placa    
    socketIO.on('getIP_API', function (configIP) {

        configIP = JSON.parse(configIP);       

        socket = new WebSocket('ws://' + configIP.configIP[0].ipAPI_RS + '/websession');
        eventsWS();
    });

    //Config and connection with API
    $('#btSaveConnectAPI_RS').click(function () {
        ipAPI_RS = $('#ipAPI_RS').val();
        ipPlaca = $('#ipPlaca').val();
        //var configIP = '{jsonConfig:[{' + '"ipPlaca"' + ':"' + ipPlaca + '"}]}';

        configIP = '{ "configIP" : [' +
   '{' + '"ipAPI_RS"' + ':"' + ipAPI_RS + '"},' +
   '{' + '"ipPlaca"' + ':"' + ipPlaca + '"}]}';

        socketIO.emit('saveIP', configIP);

        configIP = JSON.parse(configIP);

        socket = new WebSocket('ws://' + configIP.configIP[0].ipAPI_RS + '/websession');
        eventsWS();

    });//Connection API 

    /***************************************************************
     *                     REGISTER USER                           *  
     ***************************************************************/ 

    $('#btCadastro').click(function () {
        var nome = $('#name').val();
        var tel = $('#tel').val();
        var age = $('#age').val();
        var email = $('#email').val();
        //ORIGINALvar strJson = 'registerUser' + '{' + '"nome"' + ':"' + nome + '",' + '"tel"' + ':"' + tel + '",' + '"age"' + ':"' + age + '",' + '"email"' + ':"' + email + '"}';
        //Teste banco melgaço
        var strJson = '{' + '"nome"' + ':"' + nome + '",' + '"tel"' + ':"' + tel + '",' + '"age"' + ':"' + age /*+ '",' + '"email"' + ':"' + email*/ + '"}';
        console.log(strJson);
        var json = JSON.parse(strJson);
        console.log(json);
        socket.send('registerUser' + strJson);
    });

    /***************************************************************
     *                       UNREGISTER USER                       *  
     ***************************************************************/

    $('#btUnregiste').click(function () {
        var nome = $('#name').val();
        var tel = $('#tel').val();
        var age = $('#age').val();
        var email = $('#email').val();
        var strJson = '{' + '"nome"' + ':"' + nome + '",' + '"tel"' + ':"' + tel + '",' + '"age"' + ':"' + age + '",' + '"email"' + ':"' + email + '"}';
        console.log(strJson);
        var json = JSON.parse(strJson);
        console.log(json);            
        socket.send('unregisterUser' + strJson);
    });

    /***************************************************************
	 *                     EVENTS WEBSOCKET                        *  
	 ***************************************************************/

    function eventsWS() {

        socket.onopen = function () {
            console.log('CONNECTION ESTABLISHED!');
            $('#StatusConnection').css("background", "green");
            $('#lbStatus').text("CONNECTED");
        };//Socket onopen

        socket.onclose = function () {
            console.log('CLOSED CONNECTION!');
            $('#StatusConnection').css("background", "red");
            $('#lbStatus').text("NOT CONNECTED");
        };

        socket.onerror = function (errorEvent) {
            console.log(errorEvent);
            $('#StatusConnection').css("background", "red");
            $('#lbStatus').text("NOT CONNECTED");
        };

        socket.onmessage = function (messageEvent) {
            console.log(messageEvent.data);
            var msgFormated = messageEvent.data;
            var msgFormated = msgFormated.split(" ");
            console.log("msgFormated: " + msgFormated);
            faceRectangle(msgFormated);
            /*if (messageEvent.data === 'detected') {
             console.log(messageEvent.data);
             $(".lbFace").text("Detected");
             $('#my-video').css("border", "5px solid yellow");
             $('#remote-video').css("border", "5px solid yellow");
             } else {
             $(".lbFace").text("Not Detected");
             $('#my-video').css("border", "5px solid red");
             $('#remote-video').css("border", "5px solid red");
             }*/
        };

    }//eventsWS

    $('#onrect').click(function () {
        socket.send("onrect");
    });

    $('#end-monitoring').click(function () {
        socket.send("offrect");
    });



    /***************************************************************
     *                     CANVAS FACE RECTANGLE                   *  
     ***************************************************************/

    $("#hideCanvas").click(function () {
        var canvas = document.getElementById('myCanvas');
        if (canvas.getContext) {
            var context = canvas.getContext('2d');
            context.clearRect(0, 0, canvas.width, canvas.height);
        } else {
            alert("Canvas is not supported in your browser");
        }

    });

    function faceRectangle(msgFormated) {
        var canvas = document.getElementById('myCanvas');
        //canvas.width = imageSize.width;
        //canvas.height = imageSize.height;

        canvas.width = 568;
        canvas.height = 428;

        var x = Math.floor((Math.random() * 200));
        var y = Math.floor((Math.random() * 200));
        userId = x;

        if (canvas.getContext) {
            var context = canvas.getContext('2d');
            var faceRectangleX = msgFormated[0];
            var faceRectangleY = msgFormated[1];
            var faceRectangleW = msgFormated[2];
            var faceRectangleH = msgFormated[3];

            context.beginPath();
            context.lineWidth = 3;
            context.strokeStyle = 'yellow';
            context.rect(faceRectangleX, faceRectangleY, faceRectangleW, faceRectangleH);
            context.stroke();

            //User ID
            context.fillStyle = "yellow";


            context.font = "7pt Helvetica";
            context.fillText("User ID: " + userId, faceRectangleX, faceRectangleY - 4);
        } else {
            alert("Canvas is not supported in your browser");
        }
    };



    //DAR UTILIDADE A ESTE BUTTON
    $('#btSettings').click(function () {



    });

});
