$('document').ready(function () {
    var socketIO = io();   

    //SESSION CONTROL
    $('#btLogin').click(function () {
        socketIO.emit('BEgetUser');
        var login = $('#login').val();
        var password = CryptoJS.SHA1($('#password').val());                
        var password = password.toString(CryptoJS.enc.Base64);
        $('#login').val('');
        $('#password').val('');

        socketIO.on('FEgetUsers', function (users) {                    
            users = JSON.parse(users);           
            if (users.admin[0].login == login && users.admin[0].password == password) {
                logar(users.admin[0].level);
            } else {                              
                $('#alertIndex').html('<div id="alertInvalidLogin" class="alert alert-warning">' +
                '<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>' +
                '<p align="center">Login ou senha inválida!</p>' +
                '</div>');
                setTimeout(function () {
                    $('#alertIndex').html('');
                }, 3000);
            }
        });     
    });

    //SEND TOKEN FOR BROWSER, NODEJS (SESSION VARIABLE) AND REDIRECTION TO PAGE HOME
    function logar(level) {        
        var token = Math.floor(Math.random() * 1000000);
        socketIO.emit('BEsetToken', level + ':' + token);
        setCookie("token", token, 1);
        setCookie("level", level, 1);
        location.href = "http://localhost:49725/home.html";
    }

    //SET COOKIE IN BROWSER
    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=http://localhost:49725/home.html";
    }
});