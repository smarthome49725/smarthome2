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
                        
            //Get Imagem login and Set In view
            getImgLogin();

            //Get Alert emails and Set In view
            setTimeout(function () {
                getAlertEmails();
            }, 4000);
            
           

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
            if (typeof messageEvent.data == 'string') {

                receivedAPI = JSON.parse(messageEvent.data);
                //console.log(receivedAPI);
                document.img = receivedAPI;

                switch (receivedAPI.code) {
                    case "rect":
                        faceRectangle(receivedAPI.msg, receivedAPI.userId);
                        console.log(receivedAPI.userId);
                        break;
                    case "userData":
                        userData = JSON.parse(receivedAPI.msg);
                        setUserView(userData);
                        break;
                    case "getalertemail":
                        setEmailInView(receivedAPI.msg);
                        break;
                    case "img":
                        document.img64 = 'data:image/png;base64,' + receivedAPI.msg;

                        $('#imgLogin').attr('src', document.img64);

                        break;
                }

            } else {                
                document.img = messageEvent.data;
                document.getElementById("imgLogin").src = URL.createObjectURL(document.img);
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
        document.sendCodAPI('registerUser', '0', false);
        alert("Ulitize o seu email para fazer login: " + $('#email').val());

        /*if (!isNaN(receivedAPI.userId)) {
            if (userData[0] == undefined) {
                console.log(receivedAPI.userId);
                document.sendCodAPI('registerUser', '0', false);
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
        document.sendCodAPI('unregisterUser', '0', false);
    });

    /***************************************************************
     *                       GENERATE ID USER                      *  
     ***************************************************************/
    $('#btGenIdUser').click(function () {
        document.sendCodAPI('geniduser', '0', false);
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
     *                       SAVE ALERT EMAIL                      *  
     ***************************************************************/
    $('#btSaveAlertEmail').click(function () {
        document.sendCodAPI('updatealertemail', '0', false);
    });

    /***************************************************************
     *                       GET ALERT EMAILS                      *  
     ***************************************************************/
    function getAlertEmails() {
        document.sendCodAPI('getalertemail', '0', false);
    }

    /***************************************************************
     *                       GET IMG LOGIN                         *  
     ***************************************************************/
    function getImgLogin() {
        document.sendCodAPI('getimglogin', '0', false);
    }


    /***************************************************************
     *                      SET ALERT EMAILS IN VIEW               *  
     ***************************************************************/
    function setEmailInView(emails) {
        emails = JSON.parse(emails);
        $('#alertEmail1').val(emails.email1);
        $('#alertEmail2').val(emails.email2);
        $('#alertEmail3').val(emails.email3);
    }


    /***************************************************************
     *                       UPDATE USER                           *  
     ***************************************************************/
    window.updateUser = function (cod, userPosition, userName) {
        var user = JSON.parse(window.userData[userPosition]);
        console.log(user);
        var html = '';

        if (user.blacklist == 'True') {

            html += '<br/><div class="panel panel-default">';
            html += '    <div class="panel-heading">';
            html += 'ID: ' + user.userID;
            html += '        <button onclick="window.alterUser(\'' + 'unregisterUser' + '\'     ,     \'' + user.userID + '\'     ,   \'' + user.nome + '\');" class="btnExcluir glyphicon glyphicon-trash" ></button>';
            html += '    </div>';
            html += '    <div class="panel-body">';
            html += '<input id="userNome" class="form-control" type="text" placeholder="Nome" value=' + user.nome + '><br/>';
            html += '<span>Lista Negra</span><input checked id="userBlackList" type="checkbox"/><br/>';
            html += '<button onclick="window.alterUser(\'' + 'updateuser' + '\'   ,   \'' + user.userID + '\' ,  \'' + user.nome + '\');" class="btn btn-success" id="btUpdate1">Atualizar</button>';
            html += '    </div>';
            html += '</div>';

        } else {

            html += '<br/><div class="panel panel-default">';
            html += '    <div class="panel-heading">';
            html += 'ID: ' + user.userID;
            html += '        <button onclick="window.alterUser(\'' + 'unregisterUser' + '\'     ,     \'' + user.userID + '\'     ,   \'' + user.nome + '\');" class="btnExcluir glyphicon glyphicon-trash" ></button>';
            html += '    </div>';
            html += '    <div class="panel-body">';
            html += '<input id="userNome" class="form-control" type="text" placeholder="Nome" value=' + user.nome + '><br/>';
            html += '<input id="userTel" class="form-control" type="text" placeholder="Telefone" value=' + user.tel + '><br/>';
            html += '<input id="userNasc" class="form-control" type="text" placeholder="Data de Nascimento" value=' + user.nasc + '><br/>';
            html += '<input id="userEmail" class="form-control" type="text" placeholder="Email" value=' + user.email + '><br/>';
            html += '<input id="userPassword" class="form-control" type="password" value="" placeholder="Senha"/><br/>';

            html += '   <select id="userRegisterLevel" class="form-control">';
            html += '      <option value="1">Proprietário</option>';
            html += '      <option value="2">representante </option>';
            html += '      <option value="3">residentes</option>';
            html += '   </select><br/>';

            html += '<span>Lista Negra</span><input id="userBlackList" type="checkbox"/><br/>';
            html += '<button class="form-control" onclick="window.alterUser(\'' + 'updateuser' + '\'   ,   \'' + user.userID + '\' ,  \'' + user.nome + '\');" class="btn btn-success" id="btUpdate1">Atualizar</button>';
            html += '    </div>';
            html += '</div>';
        }

        $('#tableUser').html(html);

        $("#userBlackList").change(function () {
            if (this.checked) {
                $('#userTel').val("");
                $('#userNasc').val("");
                $('#userEmail').val("");
                $('#userPassword').val("");
                $('#userRegisterLevel').val("");

                $('#userTel').hide();
                $('#userNasc').hide();
                $('#userEmail').hide();
                $('#userPassword').hide();
                $('#userRegisterLevel').hide();
            } else {
                $('#userTel').show();
                $('#userNasc').show();
                $('#userEmail').show();
                $('#userPassword').show();
                $('#userRegisterLevel').show();
            }
        });

        $('#userRegisterLevel').val(user.level)

        //$('#userBlackList').prop('checked', user.blacklist);
        console.log(user.blacklist);

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
                document.sendCodAPI(cod, userID, false);
            }
        } else {
            if (window.confirm("Tem certeza que deseja excluir o usuário " + userName + "?")) {
                document.sendCodAPI(cod, userID, false);
            }

        }

    }

    /***************************************************************
     *                       GET USER                              *  
     ***************************************************************/
    $('#btConsultar').click(function () {
        document.sendCodAPI('getuser', '0', false);
    });

    function setUserView(userData) {
        //alert(userData.isArray());
        console.log(userData);
        window.userData = userData;

        if (userData[0]) {
            var user;
            var html = '';
            var nivAcesso = "Indefinido";
            var blacklist;

            for (var i = 0; i < userData.length; i++) {
                user = JSON.parse(userData[i]);

                if (user.level == 1) {
                    nivAcesso = 'Proprietário';
                }
                if (user.level == 2) {
                    nivAcesso = 'Representante';
                }
                if (user.level == 3) {
                    nivAcesso = 'Residente';
                }

                if (user.blacklist == 'True') {
                    blacklist = "Sim";

                    html += '<br/><div class="panel panel-default">';
                    html += '    <div class="panel-heading">';
                    html += 'ID: ' + user.userID;
                    html += '        <button onclick="window.alterUser(\'' + 'unregisterUser' + '\'     ,     \'' + user.userID + '\'     ,   \'' + user.nome + '\');" class="btnExcluir glyphicon glyphicon-trash" ></button>';
                    html += '        <button onclick="window.updateUser(\'' + 'updateuser' + '\'     ,     \'' + i + '\'     ,   \'' + user.nome + '\');" class="btnExcluir glyphicon glyphicon-edit" >Editar</button>';
                    html += '    </div>';
                    html += '    <div class="panel-body">';
                    html += '<p> Nome: ' + user.nome + '</p>';
                    html += '<p>Lista Negra: ' + blacklist + '</p>';
                    html += '    </div>';
                    html += '</div>';

                } else {
                    blacklist = "Não";

                    html += '<br/><div class="panel panel-default">';
                    html += '    <div class="panel-heading">';
                    html += 'ID: ' + user.userID;
                    html += '        <button onclick="window.alterUser(\'' + 'unregisterUser' + '\'     ,     \'' + user.userID + '\'     ,   \'' + user.nome + '\');" class="btnExcluir glyphicon glyphicon-trash" ></button>';
                    html += '        <button onclick="window.updateUser(\'' + 'updateuser' + '\'     ,     \'' + i + '\'     ,   \'' + user.nome + '\');" class="btnExcluir glyphicon glyphicon-edit" >Editar</button>';
                    html += '    </div>';
                    html += '    <div class="panel-body">';
                    html += '<p> Nome: ' + user.nome + '</p>';
                    html += '<p> Tel: ' + user.tel + '</p>';
                    html += '<p>Nascimento: ' + user.nasc + '</p>';
                    html += '<p>Email: ' + user.email + '</p>';
                    html += '<p>Senha: ******** </p>';
                    html += '<p>Nivel de Acesso: ' + nivAcesso + '</p>';
                    html += '<p>Lista Negra: ' + blacklist + '</p>';
                    html += '    </div>';
                    html += '</div>';
                }


            }
        } else {
            html = '';
        }

        $('#tableUser').html(html);
    }

    /***************************************************************
     *                       SET INFO USER LOGGED                  *  
     ***************************************************************/
    $('#infoName').html(getCookie('nome'));
    $('#infoEmail').html(getCookie('email'));




    /***************************************************************
     *                       GET Cookie                            *  
     ***************************************************************/
    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=http://localhost:49725/home.html";
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
    document.sendCodAPI = function (cod, userID, rect) {
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
                if ($("#blackList").prop("checked")) { //User BlackList
                    var cod = {
                        userID: receivedAPI.userId,
                        level: level,
                        cod: "registerUserBL",
                        nome: $('#name').val(),
                        blacklist: $("#blackList").prop("checked")
                    };
                } else {
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
                        password: crypPassword,
                        blacklist: $("#blackList").prop("checked")
                    };
                }

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
            case "updatealertemail":
                var cod = {
                    level: level,
                    cod: cod,
                    email1: $('#alertEmail1').val(),
                    email2: $('#alertEmail2').val(),
                    email3: $('#alertEmail3').val()
                };
                break;
            case "getalertemail":
                var cod = {
                    level: level,
                    cod: cod
                };
                break;
            case "getimglogin":
                var cod = {
                    userID: getCookie("userID"),
                    level: level,
                    cod: cod
                };
                break;

            case "updateuser":
                var crypUserPassword = CryptoJS.SHA1($('#userPassword').val());
                crypUserPassword = crypUserPassword.toString(CryptoJS.enc.Base64);
                var cod = {
                    userID: userID,
                    level: level,
                    registerLevel: registerLevel = $('#userRegisterLevel').val() != undefined ? $('#userRegisterLevel').val() : 0,
                    cod: cod,
                    nome: nome = $('#userNome').val() != undefined ? $('#userNome').val() : "0",
                    tel: tel = $('#userTel').val() != undefined ? $('#userTel').val() : "0",
                    nasc: nasc = $('#userNasc').val() != undefined ? $('#userNasc').val() : "0",
                    email: email = $('#userEmail').val() != undefined ? $('#userEmail').val() : "0",
                    password: crypUserPassword,
                    blacklist: $("#userBlackList").prop("checked")
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

    $('.rect').click(function () {
        if ($('.rect').is(':checked')) {
            document.sendCodAPI ("rect", '0', true);
            $('#myCanvas').show();
            $('#my-video').show();
        } else {
            document.sendCodAPI("rect", '0', false);
            $('#myCanvas').hide();
            $('#my-video').hide();
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
