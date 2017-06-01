var util = require('util');

var headers = function (params) {
    var extend = util._extend;
    var defaultHeader = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };

    return params !== undefined ? extend(defaultHeader, params) : defaultHeader;
};

module.exports = headers;
