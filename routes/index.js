var express = require('express');
var router = express.Router();
var plum_config = require('../plum-config');
var plum_request = require('../marantz-request');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).send(
      "GET  /rooms\n" +
      "GET  /rooms/:room_name\n" +
      "POST /rooms/:room_name?level\n" +
      "GET  /controls\n" +
      "GET  /controls/:control_id\n" +
      "POST /controls/:control_id?level\n" +
      "\n"
  );
});

router.get('/rooms', function(req, res, next) {
    res.status(200).json(plum_config.rooms());
});

router.get('/rooms/:room_name', function(req, res, next) {
    getStatus(getRoomProps(req), res);
});

router.post('/rooms/:room_name', function(req, res, next) {
    setLevel(getRoomProps(req), getLevel(req), res);
});

router.get('/controls', function(req, res, next) {
    res.status(200).json(plum_config.controls());
});

router.get('/controls/:control_id', function(req, res, next) {
    getStatus(getControlProps(req), res);
});

router.post('/controls/:control_id', function(req, res, next) {
    setLevel(getControlProps(req), getLevel(req), res);
});

function getRoomProps(req) {
    var room_props = plum_config.room_props(req.params.room_name);
    if (room_props == null) {
        res.status(404).json({'error' : req.params.room_name + ' not found'});
    } else {
        return room_props;
    }
}

function getControlProps(req) {
    var control_props = plum_config.control_props(req.params.control_id);
    if (control_props == null) {
        res.status(404).json({'error' : req.params.control_id + ' not found'});
    } else {
        return control_props;
    }
}

function getLevel(req) {
    var level = parseInt(req.body.level);
    if (level < 0 || level > 255) {
        res.status(400).json({'error' : 'level must be between 0 and 255'});
    } else {
        return level;
    }
}

function setLevel(props, level, res) {
    var house_token = plum_config.house_token();
    plum_request.setLevel(house_token, props, level,
        function callback(error, response, body) {
            if (!error) {
                res.status(response.statusCode).send(body);
            } else {
                res.status(500).send(error)
            }
        });
}

function getStatus(props, res) {
    var house_token = plum_config.house_token();
    plum_request.status(house_token, props,
        function callback(error, response, body) {
            if (!error) {
                if (response.statusCode == 200) {
                    res.status(200).json({level:body.level, power:body.power});
                } else {
                    res.status(response.statusCode).send(body);
                }
            } else {
                res.status(500).send(error)
            }
        });
}

module.exports = router;
