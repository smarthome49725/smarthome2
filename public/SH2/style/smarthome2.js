$('document').ready(function () {
    /***************************************************************
     *                 NAV SHOW AND HIDE MENU                      *  
     ***************************************************************/

    var flag = true;
    var flag2 = true;
    var flag3 = true;

    $('#divForm').hide();
    $('#divConfigIP').hide();
    $('#step2').hide();

    $('#btMonitoring').click(function () {
        if (flag === true) {
            $('#step2').show();
            $('#divForm').hide();
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
            $('#divForm').show();
            $('#step2').hide();
            $('#divConfigIP').hide();
            flag2 = false;
            flag = true;
            flag3 = true;
        } else {
            $('#divForm').hide();
            flag2 = true;
        }
    });

    $('#btShowConfig').click(function () {
        if (flag3 === true) {
            $('#divConfigIP').show();
            $('#step2').hide();
            $('#divForm').hide();
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

});