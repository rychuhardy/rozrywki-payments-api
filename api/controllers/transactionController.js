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
    // todo check if has access
    const playerId = req.params.playerId;
    Transaction.find({ playerId: playerId }).sort({ createdDate: 'desc' }).exec(function (err, txs) {
        if (err)
            res.send(err);
        res.json(txs.map(txToJson));
    });
};

exports.initialize = function (req, res) {
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
    // todo check if has access
    Transaction.find({
        _id: req.params.transactionId,
        playerId: req.params.playerId
    }, function (err, txs) {
        if (err) res.send(err);
        if (txs.length !== 1) {
            res.status(404).json({ error: "Not found" })
        }
        else {
            res.json(txToJson(txs[0]));
        }
    });
};

exports.process = function(req, res) {
    // todo this should not be allowed for player

    // change status of bet
    // from initalized to: betCancelled, betVoided => update isPaidOut and wallet
    // from initialized to: completed => update hasWon property
    res.status(500);
}