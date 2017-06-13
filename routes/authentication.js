var loginController = require('../controllers/login');
var callbackController = require('../controllers/callback');

module.exports = {
    login: function (app) {
        app.use('/login', loginController);
    },
    callback: function (app) {
        app.use('/callback', callbackController);
    }
};
