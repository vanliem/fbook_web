var request = require('request');
var express = require('express');
var session = require('express-session');
var app = express();

module.exports = {
    isAuthenticated: function (req, res, next) {
        if (typeof req.session.name == 'undefined' || typeof req.session.email == 'undefined') {
            return res.redirect('back');
        }

        res.locals.user = {
            'name': req.session.name,
            'email': req.session.email,
            'avatar': req.session.avatar
        };

        next();
    }
};
