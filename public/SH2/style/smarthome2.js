$('document').ready(function () {
    /***************************************************************
     *                 NAV SHOW AND HIDE MENU                      *  
     ***************************************************************/

    var flag = true;
    var flag2 = true;
    var flag3 = true;

    var showRegister = true;
    $('#divRegister').hide();

    var showConfigIP = true;
    $('#divConfigIP').hide();

    var showConfigEmails = true; 
    $('#divConfigEmails').hide();

    $('#step2').hide();

    $('#btMonitoring').click(function () {
        if (flag === true) {
            $('#step2').show();
            $('#divRegister').hide();
            $('#divConfigIP').hide();
            flag = false;
            flag2 = true;
            flag3 = true;
        } else {
            $('#step2').hide();
            flag = true;
        }
    });

    $('#btUsuarios').click(function () {
        if (flag2 === true) {
            $('#divRegister').show();
            $('#step2').hide();
            $('#divConfigIP').hide();
            flag2 = false;
            flag = true;
            flag3 = true;
        } else {
            $('#divRegister').hide();
            flag2 = true;
        }
    });

    $('#btShowConfig').click(function () {
        if (flag3 === true) {
            $('#divConfigIP').show();
            $('#step2').hide();
            $('#divRegister').hide();
            flag3 = false;
            flag = true;
            flag2 = true;
        } else {
            $('#divConfigIP').hide();
            flag3 = true;
        }
    });

    $("#blackList").change(function () {
        if (this.checked) {
            $('#name').attr('placeholder', 'Digite o nome do suspeito');
            $('#formEmail').hide();
            $('#formTel').hide();
            $('#formNasc').hide();
            $('#formPassword').hide();
            $('#formRegisterLevel').hide();

            $('#tel').val("");
            $('#nasc').val("");
            $('#email').val("");
            $('#password').val("");
            $('#registerLevel').val("");
        } else {
            $('#name').attr('placeholder', 'Digite o seu nome');
            $('#formEmail').show();
            $('#formTel').show();
            $('#formNasc').show();
            $('#formPassword').show();
            $('#formRegisterLevel').show();
            $('#registerLevel').val("selecion");
        }
    });


    $('#linkCadastro').click(function () {
        $('#divConfigIP').hide();
        showConfigIP = true;

        $('#divConfigEmails').hide();
        showConfigEmails = true;


        if (showRegister) {
            $('#divRegister').show();
            showRegister = false;
        } else {
            $('#divRegister').hide();
            showRegister = true;
        }
    });
    

    $('#linkConfigIP').click(function () {
        $('#divRegister').hide();
        showRegister = true;
 
        $('#divConfigEmails').hide();
        showConfigEmails = true;

        if (showConfigIP) {            
            $('#divConfigIP').show();
            showConfigIP = false;
        } else {
            $('#divConfigIP').hide();
            showConfigIP = true;
        }
    });

    $('#linkConfigEmails').click(function () {
        $('#divRegister').hide();
        showRegister = true;

        $('#divConfigIP').hide();
        showConfigIP = true;

        if (showConfigEmails) {
            $('#divConfigEmails').show();
            showConfigEmails = false;
        } else {
            $('#divConfigEmails').hide();
            showConfigEmails = true;
        }
    });



});