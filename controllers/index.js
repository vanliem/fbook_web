var express = require('express');
var router = express.Router();
var request = require('request');

router.get('/', function (req, res, next) {
    request({
        url: req.configs.api_base_url + 'home',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            try {
                var data = JSON.parse(body);
                res.json(data);
            } catch (errorJSONParse) {
                res.status(400).json(errorJSONParse);
            }
        }
    });
});

module.exports = router;
