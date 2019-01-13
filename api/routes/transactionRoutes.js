'use strict';

module.exports = function (app) {
    var transactionController = require('../controllers/transactionController');

    app.route('/api/transactions')
        .get(transactionController.getTransactions)
        .post(transactionController.initialize);

    app.route('/api/transactions/:transactionId')
        .get(transactionController.get)
        .patch(transactionController.process);

};
