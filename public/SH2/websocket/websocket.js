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
                    console.log(receivedAPI.userId);
                    break;
                case "userData":
                    userData = JSON.parse(receivedAPI.msg);
                    setUserView(userData);
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
            sendCodAPI('registerUser', '0', false);
        }
    });

    /***************************************************************
     *                       UNREGISTER USER                       *  
     ***************************************************************/

    $('#btUnregiste').click(function () {
        alet(userID);
        sendCodAPI('unregisterUser', '0', false);
    });

    /***************************************************************
     *                       GENERATE ID USER                      *  
     ***************************************************************/
    $('#btGenIdUser').click(function () {
        sendCodAPI('geniduser', '0', false);
    });

    /***************************************************************
    *                       GENERATE ID USER                      *  
    ***************************************************************/
    $('#btRmIdUser').click(function () {
        sendCodAPI('rmiduser', '0', false);
    });


    /***************************************************************
     *                       GET USER IN VIEW                      *  
     ***************************************************************/

    function getUserInView(userId, userData) {
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
     *                       UPDATE USER                           *  
     ***************************************************************/
    window.updateUser = function (cod, userPosition, userName) {
        var user = JSON.parse(window.userData[userPosition]);
        console.log(user);
        var html = '';

        html += '<div class="panel panel-default">';
        html += '    <div class="panel-heading">';
        html += 'ID: ' + user.userID;
        html += '        <a href="#" onclick="window.alterUser(\'' + 'unregisterUser' + '\'     ,     \'' + user.userID + '\'     ,   \'' + user.nome + '\');" class="btnExcluir glyphicon glyphicon-remove" ></a>';
        html += '    </div>';
        html += '    <div class="panel-body">';
        html += '<input id="userNome" type="text" value=' + user.nome + '><br/>';
        html += '<input id="userTel" type="text" value=' + user.tel + '><br/>';
        html += '<input id="userNasc" type="text" value=' + user.nasc + '><br/>';
        html += '<input id="userEmail" type="text" value=' + user.email + '><br/>';
        html += '<button onclick="window.alterUser(\'' + 'updateuser' + '\'   ,   \'' + user.userID + '\' ,  \'' + user.nome + '\');" class="btn btn-success" id="btUpdate1">Atualizar</button>';
        html += '    </div>';
        html += '</div>';
        $('#tableUser').html(html);
    }

    /***************************************************************
     *                       ALTER USER                            *  
     ***************************************************************/
    window.alterUser = function (cod, userID, userName) {
        if (cod == 'updateuser') {
            if (window.confirm("Tem certeza que deseja atualizar os dados do usuário " + userName + "?")) {
                sendCodAPI(cod, userID, false);
            }
        } else {
            if (window.confirm("Tem certeza que deseja excluir o usuário " + userName + "?")) {
                sendCodAPI(cod, userID, false);
            }

        }

    }

    /***************************************************************
     *                       GET USER                              *  
     ***************************************************************/
    $('#btConsultar').click(function () {
        sendCodAPI('getuser', '0', false);
    });

    function setUserView(userData) {
        //alert(userData.isArray());
        console.log(userData);
        window.userData = userData;

        if (userData[0]) {
            var user;
            var html = '';
            for (var i = 0; i < userData.length; i++) {
                user = JSON.parse(userData[i]);

                html += '<div class="panel panel-default">';
                html += '    <div class="panel-heading">';
                html += 'ID: ' + user.userID;
                html += '        <a href="#" onclick="window.alterUser(\'' + 'unregisterUser' + '\'     ,     \'' + user.userID + '\'     ,   \'' + user.nome + '\');" class="btnExcluir glyphicon glyphicon-remove" ></a>';
                html += '        <a href="#" onclick="window.updateUser(\'' + 'updateuser' + '\'     ,     \'' + i + '\'     ,   \'' + user.nome + '\');" class="btnExcluir glyphicon glyphicon-edit" >Editar</a>';
                html += '    </div>';
                html += '    <div class="panel-body">';
                html += '<p> Nome:' + user.nome + '</p>';
                html += '<p> Tel:' + user.tel + '</p>';
                html += '<p>Nascimento:' + user.nasc + '</p>';
                html += '<p>Email:' + user.email + '</p>';
                html += '    </div>';
                html += '</div>';


            }
        } else {
            html = '';
        }

        $('#tableUser').html(html);
    }

    /***************************************************************
     *                      SEND MSG APIREALSNSE                   *  
     ***************************************************************/
    function sendCodAPI(cod, userID, rect) {
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
                var cod = '{' + '"userID"' + ':"' + userID + '",' + '"level"' + ':"' + "1" + '",' + '"cod"' + ':"' + cod + '",' + '"nome"' + ':"' + nome + '",' + '"tel"' + ':"' + tel + '",' + '"nasc"' + ':"' + nasc + '",' + '"email"' + ':"' + email + '"}';
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
            case "updateuser":
                var cod = '{' + '"userID"' + ':"' + userID + '",' + '"level"' + ':"' + "1" + '",' + '"cod"' + ':"' + cod + '",' + '"nome"' + ':"' + $('#userNome').val() + '",' + '"tel"' + ':"' + $('#userTel').val() + '",' + '"nasc"' + ':"' + $('#userNasc').val() + '",' + '"email"' + ':"' + $('#userEmail').val() + '"}';
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
            sendCodAPI("rect", '0', true);
            $('#myCanvas').show();
        } else {
            sendCodAPI("rect", '0', false);
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

            if (typeof (userData) == 'object' && userData[0] != undefined) {
                var user = JSON.parse(userData[0]);
                if (userId > 0) {
                    userId = user.nome;
                }
            }

            if (userId == 'Unrecognized') {
                userId = 'Não reconhecido';
            }

            if (userId == 'No users in view') {
                userId = 'Nenhum usuário em exibição';
            }

            


            context.fillText("Usuário: " + userId, faceRectangleX, faceRectangleY - 4);
        } else {
            alert("Canvas is not supported in your browser");
        }
    };


});
