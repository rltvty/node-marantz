var request = require('request');
//require('request-debug')(request);
var util = require('util');

module.exports.status = function(house_token, room_props, callback) {
    var options = {
        url: util.format("https://%s:%s/v2/getLogicalLoadMetrics", room_props.ip, room_props.port),
        headers: {
            'User-Agent': 'Plum/2.3.0 (iPhone; iOS 9.2.1; Scale/2.00)',
            'X-Plum-House-Access-Token': house_token,
            'Connection': 'keep-alive',
            'Accept': '*/*'
        },
        json: {"llid": room_props.load_id},
        strictSSL: false,
        method: 'POST',
        gzip: true
    };

    request(options, callback);
};


module.exports.setLevel = function(house_token, room_props, level, callback) {
    var options = {
        url: util.format("https://%s:%s/v2/setLogicalLoadLevel", room_props.ip, room_props.port),
        headers: {
            'User-Agent': 'Plum/2.3.0 (iPhone; iOS 9.2.1; Scale/2.00)',
            'X-Plum-House-Access-Token': house_token,
            'Connection': 'keep-alive',
            'Accept': '*/*'
        },
        json: {"llid": room_props.load_id, "level" : level},
        strictSSL: false,
        method: 'POST',
        gzip: true
    };

    request(options, callback);
};