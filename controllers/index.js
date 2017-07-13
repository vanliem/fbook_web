var express = require('express');
var router = express.Router();
var request = require('request');
var objectHeaders = require('../helpers/headers');
var localSession = require('../middlewares/localSession');
var async = require('async');

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
                    pageTitle: 'Home',
                    info: req.flash('info'),
                    error: req.flash('error'),
                });
            } catch (errorJSONParse) {
                res.redirect('home');
            }
        } else {
            res.redirect('home');
        }
    });
});

module.exports = router;
