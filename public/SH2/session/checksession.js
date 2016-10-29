var socketIO = io();
window.level = getCookie("level");
socketIO.emit('getToken', window.level);

socketIO.on('session', function (token) {
    if (token != getCookie("token")) {
        location.href = "http://localhost:49725/";
    }
});

$('document').ready(function () {
    $('#exit').click(function () {
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
        location.href = "http://localhost:49725/";
    });
});

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

