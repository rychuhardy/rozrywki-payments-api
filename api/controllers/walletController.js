'use strict';

var mongoose = require('mongoose'),
    Player = mongoose.model('Players'),
    Transaction = mongoose.model('Transactions');

exports.get = function (req, res, next) {
    const playerId = req.params.playerId;
    Player.findOne({ playerId: playerId }, (err, player) => {
        if (err) {
            next(err)
        }
        res.json(player.wallet.balance);
    });
};

exports.transfer = function (req, res, next) {
    // this should not be allowed to call by users
    // this is either for top up account after winning bet or when user tops up account with money transfer, or withdraw money
    const body = req.body;
    const playerId = req.params.playerId;
    if (!body) {
        res.status(400).end();
    }
    try {
        if (body.type === 'withdraw') {
            if (body.amount <= 0) {
                return res.status(400).json('Invalid amount')
            }
            try {
                withdraw(playerId, body.amount, res);
            }
            catch (err) {
                next(err)
            }
        }
        else if (body.type === 'topup') {
            try {
                topUpAccount(playerId, body.amount, body.betId, res);
            }
            catch (err) {
                next(err)
            }
        }
        else {
            return res.status(400).end();
        }
    } catch (ex) {
        return res.status(400).json(ex);
    }

}

function topUpAccount(playerId, amount, betId, res) {
    if (body.amount <= 0) {
        return res.status(400).json('Invalid amount')
    }
    // TODO CHECK WHEN INTEGRATING WITH BETS (TRANSACTIONS)
    if (betId) {
        Transaction.findOne({ betId: betId }).exec((err, tx) => {
            if (err) {
                throw err;
            }
            if (tx.paymentStatus === 'completed' && tx.hasWon && !tx.isPaidOut) {
                tx.isPaidOut = true;
                tx.paymentStatus = 'completed'
                transaction.save((saveErr, savedTransaction) => {
                    if (saveErr) {
                        throw saveErr;
                    }
                });
            }
            else {
                throw 'invalid transaction';
            }
        });
    }

    Player.findOne({ playerId: playerId }, (err, player) => {
        if (err) {
            throw err;
        }
        player.wallet.balance += amount;
        player.wallet.walletTransactions.push({
            type: 'topup',
            amount: amount,
            betId: betId
        });
        player.save((saveErr, savedPlayer) => {
            if (saveErr) {
                throw saveErr;
            }
            return res.json(savedPlayer.wallet);
        });
        return res.status(404).end()
    });
}

function withdraw(playerId, amount, res) {
    if (body.amount <= 0) {
        return res.status(400).json('Invalid amount')
    }
    Player.findOne({ playerId: playerId }, (err, player) => {
        if (err) {
            throw err;
        }

        if (player.wallet.balance < amount) {
            return res.status(400).json('Insufficient funds, available: ' + player.wallet.balance)
        }


        player.wallet.balance -= amount;
        player.wallet.walletTransactions.push({
            type: 'withdraw',
            amount: amount
        });
        player.save((saveErr, savedPlayer) => {
            if (saveErr) {
                throw saveErr;
            }
            res.json(savedPlayer.wallet);
        });
    });
}