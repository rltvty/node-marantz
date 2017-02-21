#!/usr/bin/env node
var WebSocketServer = require('websocket').server;

module.exports = function(server) {
    var eventStreamConnections = [];

    var wsServer = new WebSocketServer({
        httpServer: server,
        // You should not use autoAcceptConnections for production
        // applications, as it defeats all standard cross-origin protection
        // facilities built into the protocol and the browser.  You should
        // *always* verify the connection's origin and decide whether or not
        // to accept it.
        autoAcceptConnections: false
    });

    wsServer.on('request', function(request) {
        var requestIP = request.remoteAddress;
        console.log("received connection request from IP: " + requestIP);

        if (requestIP.indexOf('10.10.10.') !== 0 && requestIP !== '::ffff:127.0.0.1') {
            // Make sure we only accept requests from an allowed origin
            request.reject();
            console.log((new Date()) + ' Connection from IP ' + requestIP + ' rejected.');
            return;
        }

        var found = false;
        for (var protocolIndex in request.requestedProtocols) {
            if (found) {
                break;
            }
            var requestedProtocol = request.requestedProtocols[protocolIndex];

            switch (requestedProtocol) {
                case 'echo-protocol':
                    var connection = request.accept(requestedProtocol, request.origin);
                    found = true;
                    console.log((new Date()) + 'echo-protocol connection accepted.');
                    connection.on('message', function(message) {
                        if (message.type === 'utf8') {
                            console.log('Received echo-protocol utf8 message: ' + message.utf8Data);
                            connection.sendUTF(message.utf8Data);
                        } else if (message.type === 'binary') {
                            console.log('Received echo-protocol binary message of ' + message.binaryData.length + ' bytes');
                            connection.sendBytes(message.binaryData);
                        }
                    });
                    break;
                case 'event-stream':
                    var eventStream = request.accept('event-stream', request.origin);
                    found = true;
                    console.log((new Date()) + 'event-stream connection accepted.');
                    eventStream.on('message', function(message) {
                        if (message.type === 'utf8') {
                            console.log('Received event-stream utf8 message: ' + message.utf8Data + ". Ignoring.");
                        } else if (message.type === 'binary') {
                            console.log('Received event-stream binary message of ' + message.binaryData.length + ' bytes. Ignoring.');
                        }
                    });
                    break;
            }
        }
    });

    wsServer.on('connect', function(webSocketConnection) {
        if (webSocketConnection.protocol === 'event-stream') {
            console.log((new Date()) + 'added event-stream peer ' + webSocketConnection.remoteAddress + ' to connection pool');
            eventStreamConnections.push(webSocketConnection);
        }
    });

    wsServer.on('close', function(webSocketConnection, closeReason, description) {
        console.log((new Date()) + webSocketConnection.protocol +  ' peer ' + webSocketConnection.remoteAddress + ' disconnected.');
        if (webSocketConnection.protocol === 'event-stream') {
            eventStreamConnections = eventStreamConnections.filter(function (connection) {
                return connection.connected;
            });
        }
    });

    return {
        sendEvent : function(data) {
            for (var index in eventStreamConnections) {
                eventStreamConnections[index].sendUTF(JSON.stringify(data));
            }
        }
    }
};
