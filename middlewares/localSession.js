var session = require('express-session');

localSession = function(req, res, next) {
    res.locals.user = {
        "name": req.session.name,
        "email": req.session.email,
        "avatar": req.session.avatar
    };

    next();
};

module.exports = localSession;
