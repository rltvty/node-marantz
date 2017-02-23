var express = require('express');
var router = express.Router();
var marantz = require('../marantz-client');

router.get('/state', function(req, res, next) {
    res.status(200).json(marantz.getState());
});

router.get('/sources', function(req, res, next) {
    res.status(200).json([
        'AppleTV',
        'Roku',
        'ChromeCast'
    ]);
});

router.post('/zone/:zone/volume/up', function(req, res, next) {
    marantz.volumeUp(req.params.zone);
    res.sendStatus(200);
});

router.post('/zone/:zone/volume/down', function(req, res, next) {
    marantz.volumeDown(req.params.zone);
    res.sendStatus(200);
});

router.post('/zone/:zone/volume/:level', function(req, res, next) {
    marantz.setVolume(req.params.zone, req.params.level);
    res.sendStatus(200);
});

router.post('/zone/:zone/source/:source', function(req, res, next) {
    if (marantz.setSource(req.params.zone, req.params.source)) {
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
});

module.exports = router;
