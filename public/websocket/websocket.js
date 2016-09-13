$('document').ready(function () {
    var socket = new WebSocket('ws://192.168.10.106:8080/websession');    
    socket.onopen = function () {
        console.log('CONNECTION ESTABLISHED!');
    };

    socket.onclose = function () {
        console.log('CLOSED CONNECTION!');
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

    socket.onerror = function (errorEvent) {
        console.log('onerror');
        console.log(errorEvent);

    };

    $('#onrect').click(function () {
        socket.send("onrect");
    });

    $('#end-monitoring').click(function () {
        socket.send("offrect");
    });


    //CANVASS
    //faceRectangle
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
    }
    ;

    $('#divForm').hide();
    var flag = true;
    $('#cadastro').click(function () {

        if (flag === true) {
            $('#divForm').show();
            flag = false;
        } else {
            $('#divForm').hide();
            flag = true;
        }
    });

    /***************************************************************
     *                                                             *
     *               CONTROLE DA API REALSENSE                     *
     *              											   *
     ***************************************************************/
    
    $('#btCadastro').click(function () {
        var nome = $('#name').val();
        var tel = $('#tel').val();
        var age = $('#age').val();
        var email = $('#email').val();
        var strJson = 'save{' + '"nome":"' + nome + '",' + '"tel":"' + tel + '",' + '"age":"' + age + '"}';
        console.log(strJson);
        var json = JSON.parse(strJson);
        console.log(json);
        socket.send(strJson);

    });
    
    $('#btUnregister').click(function () {        
        var strJson = 'unregister{' + '"nome":"' + nome + '",' + '"tel":"' + tel + '",' + '"age":"' + age + '"}';
        console.log(strJson);
        var json = JSON.parse(strJson);
        console.log(json);
        socket.send(strJson);

    });
    
    


});
