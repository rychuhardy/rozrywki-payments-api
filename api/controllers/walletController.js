'use strict';

var mongoose = require('mongoose'),
    Player = mongoose.model('Players'),
    Transaction = mongoose.model('Transactions');

exports.get = function(req, res) {
    // todo check if has access
    const playerId = req.params.playerId;
    Player.find({playerId: playerId}).excec((err, player) => {
        if(err) {
            res.send(err);
        }
        res.json(player.wallet);
    });
};

exports.transfer = function(req, res) {
    // this should not be allowed to call by users
    // this is either for top up account after winning bet, or top up made by cashier, or withdraw money
    const body = req.body;
    const playerId = req.params.playerId;
    if (!body) {
        res.status(400);
    }
    try {
        if (body.type === 'withdraw') {
            withdraw(playerId, body.amount, res);
        }
        else if (body.type === 'topup') {
            topUpAccount(playerId, body.amount, body.betId, res);
        }
        else {
            res.status(400);
        }
    } catch (ex) {
        res.status(400).json(ex);
    }

}

// betId is optional
function topUpAccount(playerId, amount, betId, res) {
    if (amount <= 0) {
        throw 'invalid amount';
    }

    if(betId) {
        Transaction.find({betId: betId}).exec((err, tx) => {
            if (err) {
                throw err;
            }
            if (tx.paymentStatus === 'completed' && tx.hasWon) {
                tx.paymentStatus = 'paidOut';
                transaction.save((saveErr, savedTransaction) => {
                    if(saveErr) {
                        throw saveErr;
                    }
                });
            }
            else {
                throw 'invalid transaction';
            }
        });
    }

    Player.find({playerId: playerId}).excec((err, player) => {
        if (err) {
            throw err;
        }
        player.wallet.balance += amount;
        player.wallet.history.push({
            type: 'topup',
            amount: amount,
            betId: betId
        });
        player.save((saveErr, savedPlayer) => {
            if (saveErr) {
                throw saveErr;
            }
            res.json(savedPlayer.wallet);
        });
    });
}

function withdraw(playerId, amount, res) {

    if (amount <= 0) {
        throw 'invalid amount';
    }

    Player.find({playerId: playerId}).excec((err, player) => {
        if (err) {
            throw err;
        }

        if (player.wallet.balance < amount) {
            throw 'insufficient balance';
        }

        player.wallet.balance -= amount;
        player.wallet.history.push({
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
