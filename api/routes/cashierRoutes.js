'use strict';

module.exports = function (app) {
    var cashierController = require('../controllers/cashierController');

    app.route('/api/cashiers/')
        .post(cashierController.createCashier);

    app.route('/api/cashiers/:cashierId')
        .get(cashierController.getCashier);

    app.route('/api/cashiers/:cashierId/transactions')
        .post(cashierController.confirmTransaction)
        .get(cashierController.getCashTransactions);

    app.route('/api/cashiers/:cashierId/payoutTransactions')
        .post(cashierController.payoutTransaction);
};

