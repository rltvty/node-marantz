var express = require('express');
var router = express.Router();
var marantz = require('../marantz-client');

var sources = [
    'AppleTV',
    'Roku',
    'ChromeCast'
]

router.get('/state', function(req, res, next) {
    res.status(200).json(marantz.getState());
});

router.get('/sources', function(req, res, next) {
    res.status(200).json(sources);
});

router.post('/zone/:zone/volume/up', function(req, res, next) {
    marantz.volumeUp(req.params.zone);
    res.sendStatus(200);
});

router.post('/zone/:zone/volume/down', function(req, res, next) {
    marantz.volumeDown(req.params.zone);
    res.sendStatus(200);
});

router.get('/zone/:zone/volume', function(req, res, next) {
    res.status(200).json({level: marantz.getState().main.mainLevel});
});

router.post('/zone/:zone/volume', function(req, res, next) {
    var level = parseInt(req.body.level);
    if (level < 0 || level > 255) {
        res.status(400).json({'error' : 'level must be between 0 and 255'});
    }
    if (marantz.setVolume(req.params.zone, level)) {
        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
});

router.get('/zone/:zone/source', function(req, res, next) {
    res.status(200).json({source: marantz.getState().main.source});
});

router.post('/zone/:zone/source', function(req, res, next) {
    if (sources.indexOf(req.body.source) === -1) {
        res.status(400).json({'error' : 'source must be one of ' + JSON.stringify(sources)});
    }

    if (marantz.setSource(req.params.zone, req.body.source)) {
        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
});

router.get('/zone/:zone/power', function(req, res, next) {
    res.status(200).json({source: marantz.getState().main.isOn});
});

router.post('/zone/:zone/power', function(req, res, next) {
    if (marantz.setPower(req.params.zone, req.body.isOn)) {
        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
});

router.get('/zone/:zone/mute', function(req, res, next) {
    res.status(200).json({source: marantz.getState().main.isOn});
});

router.post('/zone/:zone/mute', function(req, res, next) {
    if (marantz.setPower(req.params.zone, req.body.isOn)) {
        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
});

module.exports.router = router;
module.exports.marantz = marantz;
