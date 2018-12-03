'use strict';


var mongoose = require('mongoose'),
    Transaction = mongoose.model('Transactions');

const txToJson = (tx) => {
    return {
        id: tx._id,
        amount: tx.amount,
        status: tx.status,
        createdDate: tx.createdDate,
    }
}

exports.getAll = function (req, res) {
    const playerId = req.params.playerId;
    Transaction.find({ playerId: playerId }).sort({ createdDate: 'desc' }).exec(function (err, txs) {
        if (err)
            res.send(err);
        res.json(txs.map(txToJson));
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
