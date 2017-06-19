var request = require('request');
var express = require('express');
var session = require('express-session');
var app = express();

module.exports = {
    isAuthenticated: function (req, res, next) {
        if (!req.session.name || !req.session.email || !req.session.avatar) {
            res.send(401, 'Unauthenticated');
        }

        res.locals.user = {
            "name": req.session.name,
            "email": req.session.email,
            "avatar": req.session.avatar
        };

        next();
    }
};
