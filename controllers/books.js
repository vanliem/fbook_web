var express = require('express');
var router = express.Router();
var request = require('request');
var util = require('util');
var async = require('async');
var headers = require('../helpers/headers');

router.get('/', function (req, res, next) {
    req.checkQuery('field', 'Invalid field').notEmpty().isAlpha();

    req.getValidationResult().then(function (result) {
        if (!result.isEmpty()) {
            res.status(400).send('There have been validation errors: ' + util.inspect(result.array()));
            return;
        } else {
            var page = req.query.page ? req.query.page : 1;
            var field = req.query.field;
            async.parallel({
                section: function (callback) {
                    request({
                        url: req.configs.api_base_url + 'books/?field=' + field + '&page=' + page,
                        headers: headers()
                    }, function (error, response, body) {
                        if (!error && response.statusCode === 200) {
                            try {
                                var section = JSON.parse(body);
                                callback(null, section);
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
                }
            }, function (err, results) {
                if (err) {
                    res.status(400).send(err);
                } else {
                    res.render('books/section', {section_name: field, section: results.section, categories: results.categories});
                }
            });
        }
    });
});

router.get('/:id', function (req, res, next) {
    req.checkParams('id', 'Invalid id').notEmpty().isInt();
    req.getValidationResult().then(function (result) {
        if (!result.isEmpty()) {
            res.status(400).send('There have been validation errors: ' + util.inspect(result.array()));
            return;
        } else {
            request({
                url: req.configs.api_base_url + 'books/' + req.params.id,
                headers: headers()
            }, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    try {
                        var data = JSON.parse(body);
                        res.json(data);
                    } catch (errorJSONParse) {
                        res.status(400).json(errorJSONParse);
                    }
                } else {
                    var errorResponse = JSON.parse(body);
                    res.status(400).json(errorResponse.message.description);
                }
            });
        }
    });
});

module.exports = router;
