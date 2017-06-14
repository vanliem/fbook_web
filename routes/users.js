var usersController = require('../controllers/users');
var authorize = require('../middlewares/authorize');

var users = function (app) {
    app.use('/users', authorize.isAuthenticated, usersController);
};

module.exports = users;
