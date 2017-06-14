var express = require('express');
var request = require('request');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var objectHeaders = require('../helpers/headers');
var router = express.Router();

router.get('/', function(req, res, next) {
    if (!req.session.access_token) {
        request.post({
            headers: objectHeaders.urlencodedHeaders,
            url:     req.configs.auth_server_authorization_code_url,
            body:    "client_id=" + req.configs.client_id + "&client_secret="
                + req.configs.client_secret + '&code=' + req.query.code
        }, function(error, response, body){
            if (!error && response.statusCode === 200) {
                try {
                    var data = JSON.parse(body);

                    if (data.hasOwnProperty('access_token')) {
                        req.session.access_token = data.access_token;

                        res.redirect('home');
                    }
                } catch (errorJSONParse) {
                    res.json("Login fail");
                }
            } else {
                res.json("Login fail");
            }
        });
    } else {
        res.redirect('home');
    }
});

module.exports = router;
