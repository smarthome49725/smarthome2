$('document').ready(function () {

    var socket;
    var socketIO = io();
    var receivedAPI;
    var userData;
 
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
            //console.log(messageEvent.data);
            receivedAPI = JSON.parse(messageEvent.data);
            //console.log(receivedAPI);

            switch (receivedAPI.code) {
                case "rect":
                    faceRectangle(receivedAPI.msg, receivedAPI.userId);
                    break;
                case "userData":
                    userData = JSON.parse(receivedAPI.msg);
                    //console.log(JSON.parse(receivedAPI.msg));
                   
                    //setUserView(receivedAPI.msg);

                    //var user = getUserInView(101);
                    //console.log(user.nome);
                    break;
            }

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
        console.log(receivedAPI.userId);
        if (!receivedAPI.userId) {
            alert("É necessário gerar o ID do usuário para realizar o cadastro");
        } else {
            sendCodAPI('registerUser', false);
        }
    });

    /***************************************************************
     *                       UNREGISTER USER                       *  
     ***************************************************************/

    $('#btUnregiste').click(function () {
        sendCodAPI('unregisterUser', false);
    });

    /***************************************************************
     *                       GENERATE ID USER                      *  
     ***************************************************************/
    $('#btGenIdUser').click(function () {
        sendCodAPI('geniduser', false);
    });

    /***************************************************************
    *                       GENERATE ID USER                      *  
    ***************************************************************/
    $('#btRmIdUser').click(function () {
        sendCodAPI('rmiduser', false);
    });


    /***************************************************************
     *                       GET USER IN VIEW                      *  
     ***************************************************************/

    function getUserInView(userId) {        
        console.log(userData);
        if (userData) {
            for (var i = 0; i < userData.length; i++) {                

                var user = JSON.parse(userData[i]);

                if (user.userID == userId) {
                    return user;
                    
                }
            }
        }
    }

    /***************************************************************
     *                       GET USER                              *  
     ***************************************************************/
    $('#btConsultar').click(function () {
        sendCodAPI('getuser', false);
    });

    function setUserView(userData) {
        console.log(userData);
        if (userData[0]){
            var user;
            for (var i = 0; i < userData.length; i++) {
                user = JSON.parse(userData[i]);
                var html = html + "" +
                   "<table border='1'> \
                <tr> \
                    <th>NOME</th> \
                    <td>" + user.nome + "</td>\
                </tr> \
                <tr>\
                    <th>Tel</th>\
                    <td>" + user.tel + "</td> \
                </tr> \
                <tr>\
                    <th>Nascimento</th>\
                    <td>" + userData.nasc + "</td> \
                </tr> \
                <tr>\
                    <th>Email</th>\
                    <td>" + user.email + "</td> \
                </tr> \
            </table> \
            <br/>";
            }
        } else {
            html = "";
        }

        $('#tableUser').html(html);
    }



    /***************************************************************
     *                      SEND MSG APIREALSNSE                   *  
     ***************************************************************/
    function sendCodAPI(cod, rect) {
        switch (cod) {
            case "rect":
                cod = '{' + '"userID"' + ':"' + "0" + '",' + '"level"' + ':"' + "1" + '",' + '"cod"' + ':"' + cod + '",' + '"rect"' + ':"' + rect + '"}';
                break;
            case "registerUser":
                var nome = $('#name').val();
                var tel = $('#tel').val();
                var nasc = $('#nasc').val();
                var email = $('#email').val();                
                var cod = '{' + '"userID"' + ':"' + receivedAPI.userId + '",' + '"level"' + ':"' + "1" + '",' + '"cod"' + ':"' + cod + '",' + '"nome"' + ':"' + nome + '",' + '"tel"' + ':"' + tel + '",' + '"nasc"' + ':"' + nasc + '",' + '"email"' + ':"' + email + '"}';
                break;
            case "unregisterUser":
                var nome = $('#name').val();
                var tel = $('#tel').val();
                var nasc = $('#nasc').val();
                var email = $('#email').val();
                var cod = '{' + '"userID"' + ':"' + "0" + '",' + '"level"' + ':"' + "1" + '",' + '"cod"' + ':"' + cod + '",' + '"nome"' + ':"' + nome + '",' + '"tel"' + ':"' + tel + '",' + '"nasc"' + ':"' + nasc + '",' + '"email"' + ':"' + email + '"}';
                break;
            case "geniduser":
                cod = '{' + '"userID"' + ':"' + "0" + '",' + '"level"' + ':"' + "1" + '",' + '"cod"' + ':"' + cod + '",' + '"rect"' + ':"' + rect + '"}';
                break;
            case "rmiduser":
                cod = '{' + '"userID"' + ':"' + "0" + '",' + '"level"' + ':"' + "1" + '",' + '"cod"' + ':"' + cod + '",' + '"rect"' + ':"' + rect + '"}';
                break;
            case "getuser":
                var nome = $('#name').val();
                var tel = $('#tel').val();
                var nasc = $('#nasc').val();
                var email = $('#email').val();
                var cod = '{' + '"userID"' + ':"' + "0" + '",' + '"level"' + ':"' + "1" + '",' + '"cod"' + ':"' + cod + '",' + '"nome"' + ':"' + nome + '",' + '"tel"' + ':"' + tel + '",' + '"nasc"' + ':"' + nasc + '",' + '"email"' + ':"' + email + '"}';
                break;
        }

        socket.send(cod);
        //console.log(JSON.parse(cod));
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

    function faceRectangle(coords, userId) {
        var coordsFormated = coords.split(" "); //Separate coordinates

        var canvas = document.getElementById('myCanvas');
        //canvas.width = imageSize.width;
        //canvas.height = imageSize.height;

        canvas.width = 568;
        canvas.height = 428;

        if (canvas.getContext) {
            var context = canvas.getContext('2d');
            var faceRectangleX = coordsFormated[0];
            var faceRectangleY = coordsFormated[1];
            var faceRectangleW = coordsFormated[2];
            var faceRectangleH = coordsFormated[3];

            context.beginPath();
            context.lineWidth = 3;
            context.strokeStyle = 'yellow';
            context.rect(faceRectangleX, faceRectangleY, faceRectangleW, faceRectangleH);
            context.stroke();

            //User ID
            context.fillStyle = "green";
            context.font = "12pt Helvetica";
           //userId = userId == 'Unrecognized' ? 'Não reconhecido' : getUserInView(100);
            //userId = userId == 'No users in view' ? 'Nenhum usuário em exibição' : getUserInView(100);
           

            var user = getUserInView(userId);


            if (userId == 'Unrecognized') {
                userId = 'Não reconhecido';
            }

            if (userId == 'No users in view') {
                userId = 'Nenhum usuário em exibição';
            }

            if (userId > 0) {

                userId = user.nome;
            }            
           
            context.fillText("Usuário: " + userId, faceRectangleX, faceRectangleY - 4);            
        } else {
            alert("Canvas is not supported in your browser");
        }
    };


});
