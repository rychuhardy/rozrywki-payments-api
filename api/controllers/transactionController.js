'use strict';


var mongoose = require('mongoose'),
    Transaction = mongoose.model('Transactions'),
    Player = mongoose.model('Players');

const txToJson = (tx) => {
    return {
        betId: tx.betId,
        amount: tx.amount,
        paymentStatus: tx.paymentStatus,
        createdDate: tx.createdDate,
    }
};

exports.txToJson = txToJson;

exports.getTransactions = function (req, res, next) {
    // Query transactions
    const query = queryTransactions(req.query.sourceId, req.query.paymentStatus, req.query.isAnonymousBet)

    Transaction.find(query).sort({ createdDate: 'desc' }).exec(function (err, txs) {
        if (err) next(err);
        res.json(txs.map(txToJson));
    });
};

exports.queryTransactions = queryTransactions;

function queryTransactions(sourceId, paymentStatus, isAnonymousBet){
    // Query transactions
    var query = {};
    if(sourceId)
        query.sourceId = sourceId;

    if(paymentStatus)
        query.paymentStatus = paymentStatus;

    if(isAnonymousBet)
        query.isAnonymousBet = isAnonymousBet;

    return query;
}

exports.initialize = function (req, res, err) {
    // sourceId might be a player or a cashier
    var transaction = new Transaction(req.body);
    Transaction.remove(
        {betId:transaction.betId},
        function (err) {
            if (err) next(err)
        }
    )

    transaction.save(function (err, tran) {
        if (err) next(err)
        res.json(tran);
    });
};


exports.get = function (req, res, next) {
    Transaction.find({
        betId: req.params.betId,
        sourceId: req.params.playerId
    }, function (err, txs) {
        if (err) next(err);
        if (txs.length !== 1) {
            res.status(404).json({ error: "Not found" })
        }
        else {
            res.json(txToJson(txs[0]));
        }
    });
};

exports.process = function(req, res, next) {
    // todo this should not be allowed for player

    // change status of bet
    // from initalized to: betCancelled, betVoided => update isPaidOut and wallet
    if(req.body.paymentStatus in ['betCancelled', 'betVoided']) {
        Transaction.find({
            betId: req.params.betId
        }, function (err, txs) {
            if (err) res.send(err);

            if(txs.paymentStatus !== 'initialized' || txs.isPaidOut) res.status(400).json({error: "Transaction already finalized"});

            txs.paymentStatus = req.body.paymentStatus;
            txs.isPaidOut = true;

            Player.findOne({playerId: txs.sourceId}).exec((err, player) => {
                if (err) {
                    next(err)
                }

                player.wallet.balance += txs.amount;

                player.wallet.walletTransactions.push({
                    type: 'topup',
                    amount: txs.amount,
                    betId: txs.betId,

                });
                player.save((saveErr, savedPlayer) => {
                    if (saveErr) {
                        next(saveErr)
                    }

                    txs.save((txsSaveErr, savedTxs) => {
                        if(txsSaveErr) next(txsSaveErr);
                        res.json(savedTxs);
                    })

                });

            });


        });
    }
    else {
        res.status(400).json({ error: "Invalid status" })
    }
};