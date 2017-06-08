var express = require('express');
var router = express.Router();
var request = require('request');
var async = require('async');
var headers = require('../helpers/headers');

router.get('/', function (req, res, next) {
    async.parallel({
        home: function (callback) {
            request({
                url: req.configs.api_base_url + 'home',
                headers: headers()
            }, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    try {
                        var home = JSON.parse(body);
                        callback(null, home);
                    } catch (errorJSONParse) {
                        callback(null, null);
                    }
                } else {
                    callback(null, null);
                }
            });
        },
        categories: function (callback) {
            request({
                url: req.configs.api_base_url + 'categories',
                headers: headers()
            }, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    try {
                        var categories = JSON.parse(body);
                        callback(null, categories);
                    } catch (errorJSONParse) {
                        callback(null, null);
                    }
                } else {
                    callback(null, null);
                }
            });
        },
        offices: function (callback) {
            request({
                url: req.configs.api_base_url + 'offices',
                headers: headers()
            }, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    try {
                        var offices = JSON.parse(body);
                        callback(null, offices);
                    } catch (errorJSONParse) {
                        callback(null, null);
                    }
                } else {
                    callback(null, null);
                }
            });
        },
        conditions: function (callback) {
            request({
                url: req.configs.api_base_url + 'books/condition-sort',
                headers: headers()
            }, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    try {
                        var conditions = JSON.parse(body);
                        callback(null, conditions);
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
                res.status(400).send(err);
            } else {
                //res.json(results);
                res.render('index');
            }
        }
    );

});

module.exports = router;
