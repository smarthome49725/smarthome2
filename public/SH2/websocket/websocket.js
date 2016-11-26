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
    //userData[0] == undefined => No registered user
    //!isNaN(receivedAPI.userId) => IS number
    $('#btCadastro').click(function () {
        sendCodAPI('registerUser', '0', false);
        /*if (!isNaN(receivedAPI.userId)) {
            if (userData[0] == undefined) {
                console.log(receivedAPI.userId);
                sendCodAPI('registerUser', '0', false);
            } else {
                var user = JSON.parse(userData[0]);
                alert("É necessário gerar o ID do usuário para realizar o cadastro");
            }
        } else {
            alert("É necessário gerar o ID do usuário para realizar o cadastro");
        }*/
    });

    /***************************************************************
     *                       UNREGISTER USER                       *  
     ***************************************************************/

    $('#btUnregiste').click(function () {
        alert(userID);
        sendCodAPI('unregisterUser', '0', false);
    });

    /***************************************************************
     *                       GENERATE ID USER                      *  
     ***************************************************************/
    $('#btGenIdUser').click(function () {
        sendCodAPI('geniduser', '0', false);
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
        html += '<input id="userPassword" type="password" value="" placeholder="Senha"/><br/>';

        html += '   <select id="userRegisterLevel">';
        html += '      <option value="1">Proprietário</option>';
        html += '      <option value="2">representante </option>';
        html += '      <option value="3">residentes</option>';
        html += '   </select><br/>';

        html += '<button onclick="window.alterUser(\'' + 'updateuser' + '\'   ,   \'' + user.userID + '\' ,  \'' + user.nome + '\');" class="btn btn-success" id="btUpdate1">Atualizar</button>';
        html += '    </div>';
        html += '</div>';
        $('#tableUser').html(html);

        $(function () {
            $("#userNasc").datepicker();
        });
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
            var nivAcesso;
            for (var i = 0; i < userData.length; i++) {
                user = JSON.parse(userData[i]);

                if (user.level == 1) {
                    nivAcesso = 'Proprietário';
                } else {
                    if (user.level == 2) {
                        nivAcesso = 'Representante';
                    } else {
                        nivAcesso = 'Residente';
                    }
                }

                html += '<div class="panel panel-default">';
                html += '    <div class="panel-heading">';
                html += 'ID: ' + user.userID;
                html += '        <a href="#" onclick="window.alterUser(\'' + 'unregisterUser' + '\'     ,     \'' + user.userID + '\'     ,   \'' + user.nome + '\');" class="btnExcluir glyphicon glyphicon-remove" ></a>';
                html += '        <a href="#" onclick="window.updateUser(\'' + 'updateuser' + '\'     ,     \'' + i + '\'     ,   \'' + user.nome + '\');" class="btnExcluir glyphicon glyphicon-edit" >Editar</a>';
                html += '    </div>';
                html += '    <div class="panel-body">';
                html += '<p> Nome: ' + user.nome + '</p>';
                html += '<p> Tel: ' + user.tel + '</p>';
                html += '<p>Nascimento: ' + user.nasc + '</p>';
                html += '<p>Email: ' + user.email + '</p>';
                html += '<p>Senha: ******** </p>';
                html += '<p>Nivel de Acesso: ' + nivAcesso + '</p>';                
                html += '    </div>';
                html += '</div>';


            }
        } else {
            html = '';
        }

        $('#tableUser').html(html);
    }

    /***************************************************************
     *                       GET USERLOGIN                         *  
     ***************************************************************/
    window.getLogin = function (login, password) {                    
    var cod = {
        cod: getlogin,
        login: login,
        password: password
    };
    cod = JSON.stringify(cod);
    console.log(JSON.parse(cod));
    }


    /***************************************************************
     *                       GET Cookie                            *  
     ***************************************************************/
    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    /***************************************************************
     *                      SEND MSG APIREALSNSE                   *  
     ***************************************************************/
    function sendCodAPI(cod, userID, rect) {
        var level = getCookie("level");        
        switch (cod) {
            case "rect":                
                var cod = {
                    userID: 0,
                    level: level,
                    cod: cod,
                    rect: rect
                };
                break;
            case "registerUser":
                var crypPassword = CryptoJS.SHA1($('#password').val());
                crypPassword = crypPassword.toString(CryptoJS.enc.Base64);
                var cod = {
                    userID: receivedAPI.userId,
                    level: level,
                    registerLevel: $('#registerLevel').val(),
                    cod: cod,
                    nome: $('#name').val(),
                    tel: $('#tel').val(),
                    nasc: $('#nasc').val(),
                    email: $('#email').val(),
                    password: crypPassword
                };                
                break;
            case "unregisterUser":
                var cod = {
                    userID: userID,
                    level: level,
                    cod: cod,
                    nome: $('#name').val(),
                    tel: $('#tel').val(),
                    nasc: $('#nasc').val(),
                    email: $('#email').val()
                };                
                break;
            case "geniduser":
                var cod = {
                    userID: 0,
                    level: level,
                    cod: cod,
                    rect: rect
                };                
                break;
            case "getuser":
                var cod = {
                    userID: userID,
                    level: level,
                    cod: cod,
                    nome: $('#name').val(),
                    tel: $('#tel').val(),
                    nasc: $('#nasc').val(),
                    email: $('#email').val()
                };                
                break;
            case "updateuser":
                var crypUserPassword = CryptoJS.SHA1($('#userPassword').val());
                crypUserPassword = crypUserPassword.toString(CryptoJS.enc.Base64);                
                var cod = {
                    userID: userID,
                    level: level,
                    registerLevel: $('#userRegisterLevel').val(),
                    cod: cod,
                    nome: $('#userNome').val(),
                    tel: $('#userTel').val(),
                    nasc:$('#userNasc').val(),
                    email: $('#userEmail').val(),
                    password: crypUserPassword
                };                
                break;
        }
        cod = JSON.stringify(cod);
        socket.send(cod);
        console.log(JSON.parse(cod));
    }


    /***************************************************************
     *                     CANVAS FACE RECTANGLE                   *  
     ***************************************************************/
    document.getElementById("rect").checked = true;
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
            context.rect(faceRectangleX - 40, faceRectangleY - 20, faceRectangleW, faceRectangleH);
            context.stroke();

            //User ID
            context.fillStyle = "green";
            context.font = "12pt Helvetica";

            //userData[0] == undefined => No registered user
            //!isNaN(receivedAPI.userId) => IS number
            if (!isNaN(receivedAPI.userId)) {
                if (typeof userData[0] == 'string') {
                    var user = JSON.parse(userData[0]);
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
