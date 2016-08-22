$('document').ready(function () {
    var socket = io();
    var flag;
    socket.emit('flag', 'flag');
    socket.on('flag', function (flag) {


        // Matem compatibilidade com outros navegadores
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        /* O objeto pares é onde criamos e receber ligações.
         * PeerJS usa PeerServer para metadados sessão e sinalização candidato
         * debug: 3 (imprime todos os logs)
         */

        //Pega a key do servidor local
        if (flag) {
            var peer = new Peer('49725', {
                host: '192.168.10.100',
                //host: '192.168.1.2',
                port: 9000,
                path: '/peerjs',
                debug: 3,
                config: {
                    'iceServers': [
                            { url: 'stun:stun1.l.google.com:19302' },
                            {
                                url: 'turn:numb.viagenie.ca',
                                credential: 'muazkh', username: 'webrtc@live.com'
                            }
                    ]
                }
            });
        } else {
            var peer = new Peer({
                host: '192.168.10.100',
               //host: '192.168.1.2',
                port: 9000,
                path: '/peerjs',
                debug: 3,
                config: {
                    'iceServers': [
                            { url: 'stun:stun1.l.google.com:19302' },
                            {
                                url: 'turn:numb.viagenie.ca',
                                credential: 'muazkh', username: 'webrtc@live.com'
                            }
                    ]
                }
            });
        }


        /* Cada objeto de pares é atribuído um aleatório, exclusivo ID quando ele é criado.
         * Exibe o id do peer qundo a conexão 
         */
        peer.on('open', function () {

            socket = io();
            socket.emit('requestPeerId', peer.id);

            $('#my-id').text(peer.id);
        });

        /* Recebe chamada de video e audio
         * Evento 'call' é emitido quando outro par faz a chamada
         */
        peer.on('call', function (call) {
            // Atender a chamada automaticamente (em vez de solicitar usuário) para fins de demonstração
            call.answer(window.localStream);
            step3(call);
        });
        peer.on('error', function (err) {
            console.log(err.message);
            // Return to step 2 if error occurs   
        });


        $('#iniciar').click(function () {
            // Get things started 
            // inicia stream de video e audio      
            step1();
        });

        // Click handlers setup
        //$(function(){ //função autoexecutável    
        $('#make-call').click(function () {

            /* Inicia uma chamada
             * passa para peer.call o id do host hemoto 
             * O retorno do call evento fornecer um objeto MediaConnection. 
             * O próprio objeto MediaConnection emite um stream evento cujo retorno inclui o 
             * fluxo de vídeo / áudio do outro par.
             */
            var socket = io();
            socket.emit('requestPeerId', 'getPeerId');
            socket.on('requestPeerId', function (peer_id) {
                //var call = peer.call('49725', window.localStream);

                var call = peer.call($('#id-guest').val(), window.localStream);            
                step3(call);
            });
        });

        $('#end-call').click(function () {
            window.existingCall.close();
        });

        function step1() {            
            // Get audio/video stream
            navigator.getUserMedia({ audio: true, video: true }, function (stream) {
                // Set your video displays
                $('#my-video').prop('src', URL.createObjectURL(stream));

                window.localStream = stream;
            }, function () {
                $('#step1-error').show();
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
                $('#remote-video').prop('src', URL.createObjectURL(stream));
            });

            // UI stuff
            window.existingCall = call;
            $('#their-id').text(call.peer);
            call.on('close');

        }
     
    });


});