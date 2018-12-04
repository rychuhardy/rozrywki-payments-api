'use strict';

module.exports = function (app) {
    var transactionController = require('../controllers/transactionController');

    app.route('/api/:playerId/transactions')
        .get(transactionController.getAll)
        .post(transactionController.process);

    app.route('/api/:playerId/transactions/:transactionId')
        .get(transactionController.get);
};
