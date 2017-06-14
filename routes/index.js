var indexController = require('../controllers/index');

var index = function (app) {
    app.use('/home', indexController);
};

module.exports = index;
