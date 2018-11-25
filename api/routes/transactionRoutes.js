'use strict';

module.exports = function (app) {
    var transactionController = require('../controllers/transactionController');

    app.route('/api/:userId/transactions')
        .get(transactionController.getAll)
        .post(transactionController.process);

    app.route('/api/:userId/transactions/:transactionId')
        .get(transactionController.get);
};
