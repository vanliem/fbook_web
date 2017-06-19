var express = require('express');
var router = express.Router();
var request = require('request');
var objectHeaders = require('../helpers/headers');
var localSession = require('../middlewares/localSession');

router.get('/', localSession, function (req, res, next) {
    request({
        url: req.configs.api_base_url + 'home',
        headers: objectHeaders.headers
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            try {
                var data = JSON.parse(body);
                res.render('index', {
                    data: data,
                    pageTitle: 'Trang chủ',
                    info: req.flash('info')
                });
            } catch (errorJSONParse) {
                res.status(400).json(errorJSONParse);
            }
        } else {
            var errorResponse = JSON.parse(body);
            res.status(400).json(errorResponse.message.description);
        }
    });

});

module.exports = router;
