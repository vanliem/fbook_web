var express = require('express');
var router = express.Router();

router.get('/user/icon-default', function (req, res, next) {
    var options = {
        root: 'public/',
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    };
    var fileName = 'images/user/icon_default.png';
    res.sendFile(fileName, options, function (err) {
        if (err) {
            next(err);
        } else {
            console.log('Sent:', fileName);
        }
    });
});

router.get('/book/thumb-default', function (req, res, next) {
    var options = {
        root: 'public/',
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    };
    var fileName = 'images/book_thumb_default.jpg';
    res.sendFile(fileName, options, function (err) {
        if (err) {
            next(err);
        } else {
            console.log('Sent:', fileName);
        }
    });
});


module.exports = router;
