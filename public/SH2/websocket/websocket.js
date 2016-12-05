$('document').ready(function () {

    var socket;
    var socketIO = io();
    var receivedAPI;
    var userData;
    var userInView;

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
                    case "userinview":
                        userInView = JSON.parse(receivedAPI.msg);
                        setUserView(userInView);
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
     *                    RESTART CONNECTION                       *  
     ***************************************************************/
    $('#restartConnection').click(function () {
        location.reload(true);
    });

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
    $('#name').click(function () {
        document.sendCodAPI('geniduser', '0', false);
        console.log('enviou');
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
            
            //NOME   
            html += '           <div class="row clearfix" id="divUserNome">';
            html += '               <div class="col-lg-2 col-md-2 col-sm-4 col-xs-5 form-control-label">';
            html += '                   <label for="userNome">Nome</label>';
            html += '               </div>';
            html += '               <div class="col-lg-10 col-md-10 col-sm-8 col-xs-7" style="margin: 0 0 0 0;">';
            html += '                   <div class="form-group">';
            html += '                       <div class="form-line">';
            html += '                           <input id="userNome" class="form-control" type="text" placeholder="Nome" value=' + user.nome + '>';
            html += '                       </div>';
            html += '                   </div>';
            html += '               </div>';
            html += '           </div>';
            //E-mail
            html += '           <div class="row clearfix" id="divUserEmail">';
            html += '               <div class="col-lg-2 col-md-2 col-sm-4 col-xs-5 form-control-label">';
            html += '                   <label for="userEmail">E-mail</label>';
            html += '               </div>';
            html += '               <div class="col-lg-10 col-md-10 col-sm-8 col-xs-7" style="margin: 0 0 0 0;">';
            html += '                   <div class="form-group">';
            html += '                       <div class="form-line">';
            html += '                           <input id="userEmail" class="form-control" type="text" placeholder="Email" value=' + user.email + '>';
            html += '                       </div>';
            html += '                   </div>';
            html += '               </div>';
            html += '           </div>';
            //TELEPHONE
            html += '           <div class="row clearfix" id="divUserTel">';
            html += '               <div class="col-lg-2 col-md-2 col-sm-4 col-xs-5 form-control-label">';
            html += '                   <label for="userTel">Telefone</label>';
            html += '               </div>';
            html += '               <div class="col-lg-10 col-md-10 col-sm-8 col-xs-7" style="margin: 0 0 0 0;">';
            html += '                   <div class="form-group">';
            html += '                       <div class="form-line">';
            html += '                           <input id="userTel" class="form-control" type="text" placeholder="Telefone" value=' + user.tel + '>';
            html += '                       </div>';
            html += '                   </div>';
            html += '               </div>';
            html += '           </div>';
            //Birth
            html += '           <div class="row clearfix" id="divUserNasc">';
            html += '               <div class="col-lg-2 col-md-2 col-sm-4 col-xs-5 form-control-label">';
            html += '                   <label for="userNasc">Nascimento</label>';
            html += '               </div>';
            html += '               <div class="col-lg-10 col-md-10 col-sm-8 col-xs-7" style="margin: 0 0 0 0;">';
            html += '                   <div class="form-group">';
            html += '                       <div class="form-line">';
            html += '                           <input id="userNasc" class="form-control" type="text" placeholder="Data de Nascimento" value=' + user.nasc + '>';
            html += '                       </div>';
            html += '                   </div>';
            html += '               </div>';
            html += '           </div>';
            //PASSWORD
            html += '           <div class="row clearfix" id="divUserPassword">';
            html += '               <div class="col-lg-2 col-md-2 col-sm-4 col-xs-5 form-control-label">';
            html += '                   <label for="userPassword">Senha</label>';
            html += '               </div>';
            html += '               <div class="col-lg-10 col-md-10 col-sm-8 col-xs-7" style="margin: 0 0 0 0;">';
            html += '                   <div class="form-group">';
            html += '                       <div class="form-line">';
            html += '                           <input id="userPassword" class="form-control" type="password" value="" placeholder="Senha"/>';
            html += '                       </div>';
            html += '                   </div>';
            html += '               </div>';
            html += '           </div>';      
            //LEVEL
            html += '           <div class="row clearfix" id="divUserRegisterLevel">';
            html += '               <div class="col-lg-2 col-md-2 col-sm-4 col-xs-5 form-control-label">';
            html += '                   <label for="userPassword">Nível de acesso</label>';
            html += '               </div>';
            html += '               <div class="col-lg-10 col-md-10 col-sm-8 col-xs-7" style="margin: 0 0 0 0;">';
            html += '                   <div class="form-group">';
            html += '                       <div class="form-line">';
            html += '                           <select id="userRegisterLevel" class="form-control">';
            html += '                               <option value="selecion">Selecione</option>';
            html += '                               <option value="1">Proprietário</option>';
            html += '                               <option value="2">representante </option>';
            html += '                               <option value="3">residentes</option>';
            html += '                            </select>';
            html += '                       </div>';
            html += '                   </div>';
            html += '               </div>';
            html += '           </div>';
            //BLACKLIST
            html += '           <div class="row clearfix">';
            html += '               <div class="col-lg-offset-2 col-md-offset-2 col-sm-offset-4 col-xs-offset-5">';
            html += '                    <input id="userBlackList" type="checkbox" class="filled-in"/>';
            html += '                    <label for="userBlackList">Lista Negra</label>';
            html += '               </div>';
            html += '           </div>';                    
      
            html += '     </div>';
          
            //Custom House';
            html += '                       <div id="customHouse">';
            html += '                           <hr/>';
            html += '                           <h4 style="margin-left: 40px">Lânpadas:</h4><br/>';
            //                           <!--Bathroom-->
            html += '                           <div class="row clearfix panel-switch-btn" id="">';
            html += '                               <div class="col-lg-2 col-md-2 col-sm-4 col-xs-5 form-control-label">';
            html += '                                   <label for="updateLightBathroom">Banheiro</label>';
            html += '                               </div>';
            html += '                               <div class="col-lg-10 col-md-10 col-sm-8 col-xs-7">';
            html += '                                   <div class="form-group">';
            html += '                                       <div class="form-line">';
            html += '                                           <div class="switch">';
            html += '                                               <label>OFF<input type="checkbox" id="updateLightBathroom" class=""><span class="lever switch-col-cyan"></span>ON</label>';
            html += '                                           </div>';
            html += '                                       </div>';
            html += '                                   </div>';
            html += '                               </div>';
            html += '                           </div>';          
            //                           <!--Kitchen-->
            html += '                           <div class="row clearfix panel-switch-btn" id="">';
            html += '                               <div class="col-lg-2 col-md-2 col-sm-4 col-xs-5 form-control-label">';
            html += '                                   <label for="updateLightKitchen">Cozinha</label>';
            html += '                               </div>';
            html += '                               <div class="col-lg-10 col-md-10 col-sm-8 col-xs-7">';
            html += '                                   <div class="form-group">';
            html += '                                       <div class="form-line">';
            html += '                                           <div class="switch">';
            html += '                                               <label>OFF<input type="checkbox" id="updateLightKitchen" class=""><span class="lever switch-col-cyan"></span>ON</label>';
            html += '                                           </div>';
            html += '                                       </div>';
            html += '                                   </div>';
            html += '                               </div>';
            html += '                           </div>';        
            //                           <!--Bedroom-->';
            html += '                           <div class="row clearfix panel-switch-btn" id="">';
            html += '                               <div class="col-lg-2 col-md-2 col-sm-4 col-xs-5 form-control-label">';
            html += '                                   <label for="updateLightBedroom">Quarto</label>';
            html += '                               </div>';
            html += '                               <div class="col-lg-10 col-md-10 col-sm-8 col-xs-7">';
            html += '                                   <div class="form-group">';
            html += '                                       <div class="form-line">';
            html += '                                           <div class="switch">';
            html += '                                               <label>OFF<input type="checkbox" id="updateLightBedroom" class=""><span class="lever switch-col-cyan"></span>ON</label>';
            html += '                                           </div>';
            html += '                                       </div>';
            html += '                                   </div>';
            html += '                               </div>';
            html += '                           </div>';         
            //                           <!--Room1-->
            html += '                           <div class="row clearfix panel-switch-btn" id="">';
            html += '                               <div class="col-lg-2 col-md-2 col-sm-4 col-xs-5 form-control-label">';
            html += '                                   <label for="updateLightRoom1">Sala Princilal</label>';
            html += '                               </div>';
            html += '                               <div class="col-lg-10 col-md-10 col-sm-8 col-xs-7">';
            html += '                                   <div class="form-group">';
            html += '                                       <div class="form-line">';
            html += '                                           <div class="switch">';
            html += '                                               <label>OFF<input type="checkbox" id="updateLightRoom1" class=""><span class="lever switch-col-cyan"></span>ON</label>';
            html += '                                           </div>';
            html += '                                       </div>';
            html += '                                   </div>';
            html += '                               </div>';
            html += '                           </div>';        
            //                           <!--Room2-->
            html += '                           <div class="row clearfix panel-switch-btn" style="margin: 0 0 0 0;">';
            html += '                               <div class="col-lg-2 col-md-2 col-sm-4 col-xs-5 form-control-label">';
            html += '                                   <label for="updateLightRoom2">Sala de Jantar</label>';
            html += '                               </div>';
            html += '                               <div class="col-lg-10 col-md-10 col-sm-8 col-xs-7">';
            html += '                                   <div class="form-group">';
            html += '                                       <div class="form-line">';
            html += '                                           <div class="switch">';
            html += '                                               <label>OFF<input type="checkbox" id="updateLightRoom2" class=""><span class="lever switch-col-cyan"></span>ON</label>';
            html += '                                           </div>';
            html += '                                       </div>';
            html += '                                   </div>';
            html += '                               </div>';
            html += '                           </div>';

            html += '                           <hr/>';
            //                           <!--TV-->';
            html += '                           <div class="row clearfix panel-switch-btn" id="">';
            html += '                               <div class="col-lg-2 col-md-2 col-sm-4 col-xs-5 form-control-label">';
            html += '                                   <label for="updateTV">Televisão</label>';
            html += '                               </div>';
            html += '                               <div class="col-lg-10 col-md-10 col-sm-8 col-xs-7">';
            html += '                                   <div class="form-group">';
            html += '                                       <div class="form-line">';
            html += '                                           <div class="switch">';
            html += '                                               <label>OFF<input type="checkbox" id="updateTV" class=""><span class="lever switch-col-cyan"></span>ON</label>';
            html += '                                           </div>';
            html += '                                       </div>';
            html += '                                   </div>';
            html += '                               </div>';
            html += '                           </div>';
        
            //                           <!--Curtain-->';
            html += '                           <div class="row clearfix panel-switch-btn" id="">';
            html += '                               <div class="col-lg-2 col-md-2 col-sm-4 col-xs-5 form-control-label">';
            html += '                                   <label for="updateCurtain">Cortina</label>';
            html += '                               </div>';
            html += '                               <div class="col-lg-10 col-md-10 col-sm-8 col-xs-7">';
            html += '                                   <div class="form-group">';
            html += '                                       <div class="form-line">';
            html += '                                           <div class="switch">';
            html += '                                               <label>OFF<input type="checkbox" id="updateCurtain" class=""><span class="lever switch-col-cyan"></span>ON</label>';
            html += '                                           </div>';
            html += '                                       </div>';
            html += '                                   </div>';
            html += '                               </div>';
            html += '                           </div>';
            //                           <!--air_conditioning-->';
            html += '                           <div class="row clearfix panel-switch-btn" id="">';
            html += '                               <div class="col-lg-2 col-md-2 col-sm-4 col-xs-5 form-control-label" style="padding: 0 0 0 0;">';
            html += '                                   <label for="updateAir_conditioning">Ar-condicionado</label>';
            html += '                               </div>';
            html += '                               <div class="col-lg-10 col-md-10 col-sm-8 col-xs-7">';
            html += '                                   <div class="form-group">';
            html += '                                       <div class="form-line">';
            html += '                                           <div class="switch">';
            html += '                                               <label>OFF<input type="checkbox" id="updateAir_conditioning" class=""><span class="lever switch-col-cyan"></span>ON</label>';
            html += '                                           </div>';
            html += '                                       </div>';
            html += '                                   </div>';
            html += '                               </div>';
            html += '                           </div>';
            
            html += '                       </div>';

            html += '           <button class="btn btn-primary btn-lg m-l-15 waves-effect" onclick="window.alterUser(\'' + 'updateuser' + '\'   ,   \'' + user.userID + '\' ,  \'' + user.nome + '\');" class="btn btn-success" id="btUpdate1">Atualizar</button>';

            html += '   </div>';
        }

        $('#userInfo').html(html);
        
        $("#updateLightBathroom").prop("checked", $.parseJSON(user.lightBathroom.toLowerCase()));
        $("#updateLightKitchen").prop("checked", $.parseJSON(user.lightKitchen.toLowerCase()));
        $("#updateLightBedroom").prop("checked", $.parseJSON(user.lightBathroom.toLowerCase()));
        $("#updateLightRoom1").prop("checked", $.parseJSON(user.lightBedroom.toLowerCase()));
        $("#updateLightRoom2").prop("checked", $.parseJSON(user.lightRoom1.toLowerCase()));
        $("#updateTV").prop("checked", $.parseJSON(user.lightRoom2.toLowerCase()));
        $("#updateCurtain").prop("checked", $.parseJSON(user.TV.toLowerCase()));
        $("#updateAir_conditioning").prop("checked", $.parseJSON(user.air_conditioning.toLowerCase()));

        $("#userBlackList").change(function () {
            if (this.checked) {                
                $('#userEmail').val("");
                $('#userTel').val("");
                $('#userNasc').val("");                
                $('#userPassword').val("");
                $('#userRegisterLevel').val("");

                $('#divUserEmail').hide();
                $('#divUserTel').hide();                
                $('#divUserNasc').hide();
                $('#divUserPassword').hide();
                $('#divUserRegisterLevel').hide();
            } else {
                $('#divUserEmail').show();
                $('#divUserTel').show();
                $('#divUserNasc').show();
                $('#divUserPassword').show();
                $('#divUserRegisterLevel').show();
                $('#userRegisterLevel').val('selecion')
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
                    user.blacklist
                    var lightBathroom = user.lightBathroom == "True" ? "Ligar" : "Desligar";
                    var lightKitchen = user.lightKitchen == "True" ? "Ligar" : "Desligar";                    
                    var lightBedroom = user.lightBedroom == "True" ? "Ligar" : "Desligar";
                    var lightRoom1 = user.lightRoom1 == "True" ? "Ligar" : "Desligar";
                    var lightRoom2 = user.lightRoom2 == "True" ? "Ligar" : "Desligar";
                    var TV = user.TV == "True" ? "Ligar" : "Desligar";
                    var curtain = user.curtain == "True" ? "Ligar" : "Desligar";
                    var air_conditioning = user.air_conditioning == "True" ? "Ligar" : "Desligar";
                    

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

                    html += '<hr/>';
                    html += '<h4>Lânpadas:</h4>';                   

                    html += '<p>Banheiro: ' + lightBathroom + '</p>';
                    html += '<p>Cozinha: ' + lightKitchen + '</p>';
                    html += '<p>Quarto: ' + lightBedroom + '</p>';
                    html += '<p>Sala Principal: ' + lightRoom1 + '</p>';
                    html += '<p>Sala de Jantar: ' + lightRoom2 + '</p>';
                    html += '<hr/>';
                    html += '<p>Televisão: ' + TV + '</p>';
                    html += '<p>Cortina: ' + curtain + '</p>';
                    html += '<p>Ar-Condicionado: ' + air_conditioning + '</p>';
                 

                    html += '    </div>';
                    html += '</div>';
                }


            }
        } else {
            html = '';
        }

        $('#userInfo').html(html);
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
                var crypPassword = CryptoJS.SHA1($('#password').val());
                crypPassword = crypPassword.toString(CryptoJS.enc.Base64);
                var cod = {
                    userID: 110,//receivedAPI.userId,
                    level: level,
                    registerLevel: $('#registerLevel').val(),
                    cod: cod,
                    nome: $('#name').val(),
                    tel: $('#tel').val(),
                    nasc: $('#nasc').val(),
                    email: $('#email').val(),
                    password: crypPassword,
                    blacklist: $("#blackList").prop("checked"),
                        
                    lightBathroom: $("#lightBathroom").prop("checked"),
                    lightKitchen: $("#lightKitchen").prop("checked"),
                    lightBedroom: $("#lightBedroom").prop("checked"),
                    lightRoom1: $("#lightRoom1").prop("checked"),
                    lightRoom2: $("#lightRoom2").prop("checked"),
                    TV: $("#TV").prop("checked"),                   
                    curtain: $("#curtain").prop("checked"),
                    air_conditioning: $("#air_conditioning").prop("checked")                    
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
                    userID: 110,//userID,
                    level: level,
                    registerLevel: registerLevel = $('#userRegisterLevel').val() != undefined ? $('#userRegisterLevel').val() : 0,
                    cod: cod,
                    nome: nome = $('#userNome').val() != undefined ? $('#userNome').val() : "0",
                    tel: tel = $('#userTel').val() != undefined ? $('#userTel').val() : "0",
                    nasc: nasc = $('#userNasc').val() != undefined ? $('#userNasc').val() : "0",
                    email: email = $('#userEmail').val() != undefined ? $('#userEmail').val() : "0",
                    password: crypUserPassword,
                    blacklist: $("#userBlackList").prop("checked"),

                    lightBathroom: $("#updateLightBathroom").prop("checked"),
                    lightKitchen: $("#updateLightKitchen").prop("checked"),
                    lightBedroom: $("#updateLightBedroom").prop("checked"),
                    lightRoom1: $("#updateLightRoom1").prop("checked"),
                    lightRoom2: $("#updateLightRoom2").prop("checked"),
                    TV: $("#updateTV").prop("checked"),
                    curtain: $("#updateCurtain").prop("checked"),
                    air_conditioning: $("#updateAir_conditioning").prop("checked")
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

    /*$('.rect').click(function () {
        if ($('.rect').is(':checked')) {
            //document.sendCodAPI ("rect", '0', true);
            $('#myCanvas').show();
            $('#my-video').show();
        } else {
            document.sendCodAPI("rect", '0', false);
            $('#myCanvas').hide();
            $('#my-video').hide();
        }

    });*/


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

            context.font = "12pt Helvetica";




            if (!isNaN(receivedAPI.userId)) {
                if (typeof userInView[0] == 'string') {
                    var user = JSON.parse(userInView[0]);

                    userId = user.nome;

                    if (user.blacklist == 'True') {                   
                    context.fillStyle = "red";
                    context.strokeStyle = 'red';
                    document.getElementById('soundAlert').play();
                    } else {
                        context.fillStyle = "green";
                        context.strokeStyle = 'green';
                        document.getElementById('soundAlert').pause();
                    }                    
                    //setUserView(userInView);
                    context.rect(faceRectangleX - 40, faceRectangleY - 20, faceRectangleW, faceRectangleH);
                    context.stroke();
                    context.fillText("Usuário: " + userId, faceRectangleX, faceRectangleY - 25);
                } else {
                    context.fillStyle = "yellow";
                    context.strokeStyle = 'yellow';
                    context.rect(faceRectangleX - 40, faceRectangleY - 20, faceRectangleW, faceRectangleH);
                    context.stroke();
                    context.fillText("Usuário: " + userId, faceRectangleX, faceRectangleY - 25);
                    document.getElementById('soundAlert').pause();
                }


            }

            if (userId == 'Unrecognized') {
                userId = 'Não reconhecido';
                context.fillStyle = "yellow";
                context.strokeStyle = 'yellow';
                context.rect(faceRectangleX - 40, faceRectangleY - 20, faceRectangleW, faceRectangleH);
                context.stroke();
                context.fillText("Usuário: " + userId, faceRectangleX, faceRectangleY - 25);
                $('#userInfo').html('');
            }

            if (userId == 'No users in view') {
                userId = 'Nenhum usuário em exibição';
                $('#userInfo').html('');
            }
            
     
    

    
           
        } else {
            alert("Canvas is not supported in your browser");
        }
    };


});
