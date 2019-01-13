'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var WalletTransactionSchema = new Schema({
    amount: {
        type: Schema.Types.Decimal128,
        required: 'amount is required'
    },

    type: {
        type: String,
        enum: ['topup', 'withdraw'],
        required: 'type is required'
    },

    createdDate: {
        type: Date,
        default: Date.now
    },

    betId: {
        type: String
    }

});


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

        walletTransactions: [WalletTransactionSchema]
    },

    createdDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Players', PlayerSchema);