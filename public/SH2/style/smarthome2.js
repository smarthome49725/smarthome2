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

    $(function () {
        $("#nasc").datepicker();
    });

    $("#blackList").change(function () {
        if (this.checked) {
            $('#trTel').hide();
            $('#trNasc').hide();
            $('#trEmail').hide();
            $('#trPassword').hide();
            $('#trRegisterLevel').hide();

            $('#tel').val("");
            $('#nasc').val("");
            $('#email').val("");
            $('#password').val("");
            $('#registerLevel').val("");
        } else {
            $('#trTel').show();
            $('#trNasc').show();
            $('#trEmail').show();
            $('#trPassword').show();
            $('#trRegisterLevel').show();
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