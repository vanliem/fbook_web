var express = require('express');
var app = express();
var router = express.Router();

router.get('/', function(req, res, next) {
    res.redirect(req.configs.auth_server_base_url + "?client_id="
        + req.configs.client_id + "&client_secret=" + req.configs.client_secret
        + "&response_type=code&redirect_uri=http://localhost:5000/callback");
});

module.exports = router;
