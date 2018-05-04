var express = require('express');
var router = express.Router();
var marantz = require('../marantz-client');

var sources = [
    'AppleTV',
    'Mac Mini',
    'KVM Switch'
];

router.get('/state', function(req, res) {
    res.status(200).json(marantz.getState());
});

router.get('/sources', function(req, res) {
    res.status(200).json(sources);
});

router.post('/zone/:zone/volume/up', function(req, res) {
    marantz.volumeUp(req.params['zone']);
    res.sendStatus(200);
});

router.post('/zone/:zone/volume/down', function(req, res) {
    marantz.volumeDown(req.params['zone']);
    res.sendStatus(200);
});

router.get('/zone/:zone/volume', function(req, res) {
    res.status(200).json({level: marantz.getState().main.mainLevel});
});

router.post('/zone/:zone/volume', function(req, res) {
    var level = parseInt(req.body.level);
    if (level < 0 || level > 255) {
        res.status(400).json({'error' : 'level must be between 0 and 255'});
    }
    if (marantz.setVolume(req.params['zone'], level)) {
        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
});

router.get('/zone/:zone/source', function(req, res) {
    res.status(200).json({source: marantz.getState().main.source});
});

router.post('/zone/:zone/source', function(req, res) {
    if (sources.indexOf(req.body.source) === -1) {
        res.status(400).json({'error' : 'source must be one of ' + JSON.stringify(sources)});
    }

    if (marantz.setSource(req.params['zone'], req.body.source)) {
        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
});

router.get('/zone/:zone/power', function(req, res) {
    res.status(200).json({value: marantz.getState().main.isPowered});
});

router.post('/zone/:zone/power', function(req, res) {
    if (marantz.setPower(req.params['zone'], req.body.isOn)) {
        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
});

router.get('/zone/:zone/mute', function(req, res) {
    res.status(200).json({value: marantz.getState().main.isMuted});
});

router.post('/zone/:zone/mute', function(req, res) {
    if (marantz.setPower(req.params['zone'], req.body.isOn)) {
        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
});

router.all('*', function (req, res) {
    res.sendStatus(404);
});

module.exports.router = router;
module.exports.marantz = marantz;
