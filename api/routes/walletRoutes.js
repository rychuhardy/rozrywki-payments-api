'use strict';

module.exports = function (app) {
    var walletController = require('../controllers/walletController');

    app.route('api/:playerId/wallet')
        .get(walletController.get)
        .post(walletController.transfer);

    // app.route('/api/:playerId/wallet/history')
    //     .get(walletController.getHistory);

};

