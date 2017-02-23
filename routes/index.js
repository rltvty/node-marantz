var express = require('express');
var router = express.Router();
var marantz = require('../marantz-client');

router.post('/volume/up', function(req, res, next) {
    marantz.volumeUp();
    res.sendStatus(200);
});

router.post('/volume/down', function(req, res, next) {
    marantz.volumeDown();
    res.sendStatus(200);
});

router.post('/volume/:level', function(req, res, next) {
    marantz.volumeDirect(req.params.level);
    res.sendStatus(200);
});

router.post('/source/:source', function(req, res, next) {
    if (marantz.source(req.params.source)) {
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
});

module.exports = router;
