var request = require('request');
var express = require('express');
var session = require('express-session');
var app = express();

module.exports = {
    isAuthenticated: function (req, res, next) {
        if (!req.session.access_token) {
            res.send(401, 'Unauthenticated');
        }

        res.locals.access_token = req.session.access_token;
        next();
    }
};
