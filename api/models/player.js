'use strict';
var mongoose = require('mongoose');
var transaction = require('./transaction')
var Schema = mongoose.Schema;


var PlayerSchema = new Schema({

    playerId: {
        type: String,
        required: 'playerId is required',
        unique: true
    },

    wallet: {
        balance: {
            type: Number,
            default: 0
        },

        walletTransactions: [transaction.WalletTransactionSchema]
    },

    createdDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Players', PlayerSchema);