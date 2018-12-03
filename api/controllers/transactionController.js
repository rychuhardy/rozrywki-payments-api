'use strict';


var mongoose = require('mongoose'),
    Transaction = mongoose.model('Transactions');

exports.getAll = function (req, res) {
    const playerId = req.params.playerId;
    Transaction.find({ playerId: playerId }, function (err, txs) {
        if (err)
            res.send(err);
        res.json(transaction);
    });
};




exports.process = function (req, res) {
    // todo add validation etc
    var transaction = new Transaction(req.body);
    transaction.playerId = req.params.playerId;
    transaction.save(function (err, tran) {
        if (err)
            res.send(err);
        res.json(tran);
    });
};


exports.get = function (req, res) {
    Transaction.findById(req.params.transactionId, function (err, transaction) {
        if (err)
            res.send(err);
        res.json(transaction);
    });
};
