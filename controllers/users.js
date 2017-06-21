var express = require('express');
var router = express.Router();
var request = require('request');
var objectHeaders = require('../helpers/headers');
var authorize = require('../middlewares/authorize');
var async = require('async');

router.get('/profile', authorize.isAuthenticated, function(req, res, next) {
    async.parallel({
        user: function (callback) {
          request({
                url: req.configs.api_base_url + 'user-profile',
                headers: objectHeaders.headers({'Authorization': req.session.access_token})
            }, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    try {
                        var user = JSON.parse(body);
                        callback(null, user);
                    } catch (errsorJSONParse) {
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
                headers: objectHeaders.headers
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
            req.flash('error', 'You can\'t view user profile');

            return res.redirect('../home');
        } else {
            res.render('users/profile', {
                data: results.user.item,
                pageTitle: 'User profile',
                categories: results.categories,
            });
        }
    });
});

module.exports = router;
