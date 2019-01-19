'use strict';


var mongoose = require('mongoose'),
    Transaction = mongoose.model('Transactions'),
    Player = mongoose.model('Players')

const txToJson = (tx) => {
    return {
        betId: tx.betId,
        amount: tx.amount,
        paymentStatus: tx.paymentStatus,
        createdDate: tx.createdDate,
    }
}

exports.getTransactions = function (req, res) {
    // Query transactions
    var query = {}
    if(req.query.sourceId)
        query.sourceId = req.query.sourceId

    if(req.query.paymentStatus)
        query.paymentStatus = req.query.paymentStatus

    if(req.query.isAnonymousBet)
        query.isAnonymousBet = req.query.isAnonymousBet

    Transaction.find(query).sort({ createdDate: 'desc' }).exec(function (err, txs) {
        if (err)
            res.send(err);
        res.json(txs.map(txToJson));
    });
};

exports.initialize = function (req, res) {
    // sourceId might be a player or a cashier
    var transaction = new Transaction(req.body);
    Transaction.remove(
        {betId:transaction.betId},
        function (err) {
            if (err)
                res.send(err);
        }
    )

    transaction.save(function (err, tran) {
        if (err)
            res.send(err);
        res.json(tran);
    });
};


exports.get = function (req, res) {
    // TODO VERIFY IMPLEMENTATION & USE betID AS QUERYPARAM NOT _id from Mongo
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
    if(req.body.paymentStatus in ['betCancelled', 'betVoided']) {
        Transaction.find({
            betId: req.params.transactionId
        }, function (err, txs) {
            if (err) res.send(err);
            
            if(txs.paymentStatus !== 'initialized' || txs.isPaidOut) res.status(400).json({error: "Transaction already finalized"});

            txs.paymentStatus = req.body.paymentStatus;
            txs.isPaidOut = true;

            Player.findOne({playerId: txs.sourceId}).exec((err, player) => {
                if (err) {
                    throw err;
                }

                player.wallet.balance += txs.amount;

                player.wallet.walletTransactions.push({
                    type: 'topup',
                    amount: txs.amount,
                    betId: txs.betId,

                });
                player.save((saveErr, savedPlayer) => {
                    if (saveErr) {
                        throw saveErr;
                    }
                    
                    txs.save((txsSaveErr, savedTxs) => {
                        if(txsSaveErr) throw txsSaveErr;
                        res.json(savedTxs);
                    })

                });

            });


        });
    }
    else {
        res.status(400).json({ error: "Invalid status" })
    }

}