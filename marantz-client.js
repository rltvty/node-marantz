var telnet = require('telnet-client');
var connection = new telnet();

var params = {
    host: 'marantz',
    shellPrompt: ''
};

connection.on('close', function() {
    console.log('connection closed');
});

connection.on('error', function(error) {
    console.log('connection error ' + error);
});

connection.on('data', function(data) {
    data = data.toString().trim();
    if (data.indexOf('MV') == 0) {
        data = data.substr(2);
        if  (data.indexOf('MAX') != 0) {
            if (data.length == 3) {
                data = data.substring(0,2);
                data = parseFloat(data);
                data += 0.5;
            } else {
                data = parseFloat(data);
            }
            console.log('Living Room Volume: ' + data);
            return;
        }
    }
    switch (data) {
        case 'SISAT/CBL':
            console.log('Living Room Source: AppleTV');
            return;
        case 'SIDVD':
            console.log('Living Room Source: ChromeCast');
            return;
        case 'SIBD':
            console.log('Living Room Source: Roku');
            return;

    }
});


connection.connect(params);

module.exports.volumeUp = function() {
    connection.send('MVUP\r');
    return true;
};

module.exports.volumeDown = function() {
    connection.send('MVDOWN\r');
    return true;
};

module.exports.volumeDirect = function(volume) {
    connection.send('MV' + volume + '\r');
    return true;
};

module.exports.source = function(source) {
    switch (source) {
        case 'AppleTV':
            connection.send('SISAT/CBL\r');
            break;
        case 'ChromeCast':
            connection.send('SIDVD\r');
            break;
        case 'Roku':
            connection.send('SIBD\r');
            break;
        default:
            return false;
    }
    return true;
};
