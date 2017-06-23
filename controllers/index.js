var express = require('express');
var router = express.Router();
var request = require('request');
var objectHeaders = require('../helpers/headers');
var localSession = require('../middlewares/localSession');
var async = require('async');

router.get('/', localSession, function (req, res, next) {
    async.parallel({
        data: function (callback) {
            request({
                url: req.configs.api_base_url + 'home',
                headers: objectHeaders.headers
            }, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    try {
                        var data = JSON.parse(body);
                        callback(null, data);
                    } catch (errorJSONParse) {
                        callback(null, null);
                    }
                } else {
                    callback(null, null);
                }
            });
        },
        suggestedBooks: function (callback) {
            request({
                url: req.configs.api_base_url + 'users/interested-books',
                headers: objectHeaders.headers({'Authorization': req.session.access_token})
            }, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    try {
                        var suggestedBooks = JSON.parse(body);
                        callback(null, suggestedBooks);
                    } catch (errorJSONParse) {
                        callback(null, null);
                    }
                } else {
                    callback(null, null);
                }
            });
        }
    }, function (err, results) {
        if (err) {
            res.redirect('home');
        } else {
            res.render('index', {
                data: results.data,
                suggestedBooks: results.suggestedBooks,
                pageTitle: 'Trang chủ',
                info: req.flash('info'),
                error: req.flash('error'),
            });
        }
    });
});

module.exports = router;
