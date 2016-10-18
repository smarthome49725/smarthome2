﻿$('document').ready(function () {

    var socket;
    var socketIO = io();
    //var configIP;

    /***************************************************************
	 *                     EVENTS WEBSOCKET                        *  
	 ***************************************************************/

    window.eventsWS = function () {
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

    /***************************************************************
     *                    CONNECT WEBSOCKET                        *  
     ***************************************************************/

    window.connectWebSocket = function () {      
            socket = new WebSocket('ws://' + configIP.configIP[0].ipAPI_RS + '/level' + window.level);
            eventsWS();     
    }  


    /***************************************************************
     *                     REGISTER USER                           *  
     ***************************************************************/

    $('#btCadastro').click(function () {      
        sendCodAPI('registerUser', false);
    });

    /***************************************************************
     *                       UNREGISTER USER                       *  
     ***************************************************************/

    $('#btUnregiste').click(function () {
       sendCodAPI('unregisterUser', false);
    });


    /***************************************************************
     *                      SEND MSG APIREALSNSE                   *  
     ***************************************************************/
    function sendCodAPI(cod, rect) {
        switch (cod) {
            case "rect":
                cod = '{' + '"level"' + ':"' + window.level + '",' + '"cod"' + ':"' + cod + '",' + '"rect"' + ':"' + rect + '"}';
                break;
            case "registerUser":
                var nome = $('#name').val();
                var tel = $('#tel').val();
                var age = $('#age').val();
                var email = $('#email').val();
                var cod = '{' + '"level"' + ':"' + window.level + '",' + '"cod"' + ':"' + cod + '",' + '"nome"' + ':"' + nome + '",' + '"tel"' + ':"' + tel + '",' + '"age"' + ':"' + age + '",' + '"email"' + ':"' + email + '"}';
                break;
            case "unregisterUser":
                var nome = $('#name').val();
                var tel = $('#tel').val();
                var age = $('#age').val();
                var email = $('#email').val();
                var cod = '{' + '"level"' + ':"' + window.level + '",' + '"cod"' + ':"' + cod + '",' + '"nome"' + ':"' + nome + '",' + '"tel"' + ':"' + tel + '",' + '"age"' + ':"' + age + '",' + '"email"' + ':"' + email + '"}';
                break;
        }

        socket.send(cod);
        console.log(JSON.parse(cod));
    }


    /***************************************************************
     *                     CANVAS FACE RECTANGLE                   *  
     ***************************************************************/
    $('#rect').click(function () {
        if ($('#rect').is(':checked')) {
            sendCodAPI("rect", true);
            $('#myCanvas').show();
        } else {
            sendCodAPI("rect", false);
            $('#myCanvas').hide();


        }

    });


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


});
