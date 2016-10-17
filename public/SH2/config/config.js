$('document').ready(function () {
    window.configIP;
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

    });//Connection API 

    socketIO.emit('readIP', 'readIP'); //emite sinal para receber o IP guardado na placa    
    socketIO.on('getIP_API', function (configIP) {
        window.configIP = JSON.parse(configIP);
        ipAPI_RS = $('#ipAPI_RS').val(window.configIP.configIP[0].ipAPI_RS);
        ipPlaca = $('#ipPlaca').val(window.configIP.configIP[1].ipPlaca);
        ipClientRTC = $('#ipClientRTC').val(window.configIP.configIP[2].ipClientRTC);
        ipServerRTC = $('#ipServerRTC').val(window.configIP.configIP[3].ipServerRTC);

        window.connectWRTC();
        window.connectWebSocket();        
    });

    
});