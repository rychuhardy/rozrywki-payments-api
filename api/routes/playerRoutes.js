'use strict';

module.exports = function (app) {
    var walletController = require('../controllers/walletController');
    var playerController = require('../controllers/playerController');

    app.route('/api/players/')
        .post(playerController.createPlayer)

    app.route('/api/players/:playerId')
        .get(playerController.getPlayer)

    app.route('/api/players/:playerId/wallet')
        .post(walletController.transfer);

    app.route('/api/players/:playerId/balance')
        .get(walletController.get)

};

