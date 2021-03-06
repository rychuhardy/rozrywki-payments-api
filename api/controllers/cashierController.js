'use strict';

var transactionController = require('./transactionController');

var mongoose = require('mongoose'),
    Transaction = mongoose.model('Transactions'),
    Cashier = mongoose.model('Cashier');

exports.getCashier = function (req, res, next) {
    const cashierId = req.params.cashierId;
    Cashier.find({ cashierId: cashierId }).exec((err, cashier) => {
        if (err) {
            next(err)
        }
        res.json(cashier)
    });
}

exports.createCashier = function (req, res, next) {
    const cashierId = req.body.cashierId;
    const cashier = new Cashier();
    cashier.cashierId = cashierId;
    // remove old entity
    Cashier.remove(
        { cashierId: cashierId },
        function (err) {
            if (err) {
                next(err)
            }
        }
    );
    // create new entity
    cashier.save((saveErr, savedCashier) => {
        if (saveErr) {
            next(err)
        }
        res.json(savedCashier);
    });
};

exports.confirmTransaction = function (req, res, next) {
    // sourceId might be a player or a cashier
    var transaction = new Transaction(req.body);
    transaction.sourceId = req.params.cashierId;
    transaction.isAnonymousBet = true;
    transaction.paymentStatus = 'completed';

    Transaction.remove(
        { betId: transaction.betId },
        function (err) {
            if (err) next(err)
        }
    );

    transaction.save(function (err, tran) {
        if (err) next(err)
    });

    // record payment
    Cashier.findOne({ cashierId: req.params.cashierId }).exec(function (err, cashier) {
        next(err);
        cashier.walletTransactions.push({
            type: 'topup',
            amount: req.body.amount,
            betId: req.body.betId
        });
        cashier.save((saveErr, savedCashier) => {
            if (saveErr) {
                next(saveErr)
            }
            return res.json(
                {
                    tx: transaction,
                    cashierWalletTransactions: savedCashier
                }).send()
        });
    });
};

exports.getCashTransactions = function (req, res, next) {
    const query = transactionController.queryTransactions(req.params.cashierId, req.query.paymentStatus)

    Transaction.find(query).sort({ createdDate: 'desc' }).exec(function (err, txs) {
        if (err) next(err);
        res.json(txs.map(transactionController.txToJson));
    });
};

exports.payoutTransaction = function (req, res, next) {
    Transaction.findOne({ betId: req.body.betId }).exec(function (err, transaction) {
        if (transaction.isPaidOut || transaction.paymentStatus !== "completed" || !transaction.hasWon) {
            return res.send('Bet: ' + req.body.betId + " is either paid out or wasn't paid or hasn't won")
        }
        transaction.isPaidOut = true;
        // update transaction
        transaction.save((saveErr, savedCashier) => {
            if (saveErr) {
                next(saveErr)
            }
        });

        Cashier.findOne({ cashierId: req.params.cashierId }).exec(function (err, cashier) {
            if (err)
                res.send(err);
            cashier.walletTransactions.push({
                type: 'withdraw',
                amount: req.body.amount,
                betId: req.body.betId
            });
            cashier.save((saveErr, savedCashier) => {
                if (saveErr) {
                    next(saveErr)
                }
                return res.json(
                    {
                        tx: transaction,
                        cashierWalletTransactions: savedCashier
                    }).send()
            });
        });
    })
};

