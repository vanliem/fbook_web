var indexController = require('../controllers/images');

var index = function (app) {
    app.use('/image', indexController);
};

module.exports = index;
