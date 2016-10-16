$('document').ready(function () {

    window.level = window.prompt("Level", "1"); 

    /***************************************************************
     *                        CONFIG IP-API                        *  
     ***************************************************************/
    var socketIO = io();

    $('#btSaveConnectAPI_RS').click(function () {
        ipAPI_RS = $('#ipAPI_RS').val();
        ipPlaca = $('#ipPlaca').val();
        ipClientRTC = $('#ipClientRTC').val();
        ipServerRTC = $('#ipServerRTC').val();

        configIP = '{ "configIP" : [' +
   '{' + '"ipAPI_RS"' + ':"' + ipAPI_RS + '"},' +
   '{' + '"ipPlaca"' + ':"' + ipPlaca + '"},' +
   '{' + '"ipClientRTC"' + ':"' + ipClientRTC + '"},' +
   '{' + '"ipServerRTC"' + ':"' + ipServerRTC + '"}]}';

        socketIO.emit('saveIP', configIP);
               
        window.connectWebSocket();

    });//Connection API 

});