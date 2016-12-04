window.connectWRTC = function () {
    //alert(window.configIP.configIP[1].ipPlaca);
    var socket = io();

    // Matem compatibilidade com outros navegadores
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    /* O objeto pares � onde criamos e receber liga��es.
    * PeerJS usa PeerServer para metadados sess�o e sinaliza��o candidato
    * debug: 3 (imprime todos os logs)
    */
    var peer = new Peer(window.level, {
        host: window.configIP.configIP[1].ipPlaca,
        port: 9000,
        path: '/smarthome2',
        debug: 3,
        config: {
            'iceServers': [
                { url: 'stun:stun1.l.google.com:19302' },
                {
                    url: 'turn:numb.viagenie.ca',
                    credential: 'smarthome2', username: 'webrtc@live.com'
                }
            ]
        }
    });

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

    /* Cada objeto de pares � atribu�do um aleat�rio, exclusivo ID quando ele � criado.
     * Exibe o id do peer qundo a conex�o 
     */
    peer.on('open', function () {

        /*socket = io();
        socket.emit('requestPeerId', peer.id);*/

        $('#my-id').text(peer.id);
    });

    /* Recebe chamada de video e audio
     * Evento 'call' � emitido quando outro par faz a chamada
     */
    peer.on('call', function (call) {
        // Atender a chamada automaticamente (em vez de solicitar usu�rio) para fins de demonstra��o
        call.answer(window.localStream);
        step3(call);
    });
    peer.on('error', function (err) {
        console.log(err.message);
        // Return to step 2 if error occurs   
    });

    $(".rect").change(function () {
        if (this.checked) {
            step1();
        }
    });
        
    if (getCookie('level') == '1') {
        step1();
    }

    // Click handlers setup
    //$(function(){ //fun��o autoexecut�vel    
    $('#make-call').click(function () {

        /* Inicia uma chamada
         * passa para peer.call o id do host hemoto 
         * O retorno do call evento fornecer um objeto MediaConnection. 
         * O pr�prio objeto MediaConnection emite um stream evento cujo retorno inclui o 
         * fluxo de v�deo / �udio do outro par.
         */
        /*var socket = io();
        socket.emit('requestPeerId', 'getPeerId');
        socket.on('requestPeerId', function (peer_id) {*/
        //var call = peer.call('49725', window.localStream);

        //var call = peer.call($('#id-guest').val(), window.localStream);
        var call = peer.call(2, window.localStream);
        var call = peer.call(3, window.localStream);

        step3(call);
        // });
    });

    $('#end-call').click(function () {
        window.existingCall.close();
    });

    function step1() {
        // Get audio/video stream
        navigator.getUserMedia({ audio: true, video: true }, function (stream) {
            // Set your video displays            	
            //Mirror video
            $('#my-video').css("-moz-transform", "scale(-1, 1)")
                .css("-webkit-transform", "scale(-1, 1)")
                .css("-o-transform", "scale(-1, 1)")
                .css("transform", "filter: FlipH");

            $('#my-video').prop('src', URL.createObjectURL(stream));

            window.localStream = stream;
            if (window.localStream.active) {
                setTimeout(function () {
                    document.sendCodAPI("rect", '0', true);
                }, 8000);

            }

        }, function () {
            alert('ERRO STEP 1');
        });
    }

    function step3(call) {
        // se existir uma chamada presente, fecha a mesma e abre a ultima que chamou
        if (window.existingCall) {
            window.existingCall.close();
        }

        /* Wait for stream on the call, then set peer video display
         * Exibe video para host remoto
         */
        call.on('stream', function (stream) {
            //Mirror video
            $('#remote-video').css("-moz-transform", "scale(-1, 1)")
                .css("-webkit-transform", "scale(-1, 1)")
                .css("-o-transform", "scale(-1, 1)")
                .css("transform", "filter: FlipH");

            document.getElementById('remote-video').style.cssText = "-moz-transform: scale(-1, 1); \
            		-webkit-transform: scale(-1, 1); -o-transform: scale(-1, 1); \
            		transform: scale(-1, 1); filter: FlipH;";

            $('#remote-video').prop('src', URL.createObjectURL(stream));
        });

        // UI stuff
        window.existingCall = call;
        $('#their-id').text(call.peer);
        call.on('close');

    }
}