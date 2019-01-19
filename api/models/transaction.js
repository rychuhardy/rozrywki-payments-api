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

var TransactionSchema = new Schema({

    betId: {
        type: String,
        required: 'betId is required'
    },

    sourceId: {
        type: String
    },

    amount: {
        type: Schema.Types.Decimal128,
        required: 'amount is required'
    },

    isAnonymousBet: {
        type: Boolean,
        required: ['isAnonymousBet is required']
    },

    hasWon: {
        type: Boolean,
        default: false
    },

    isPaidOut: {
        type: Boolean,
        default: false
    },

    paymentStatus: {
        type: String,
        enum: ['initialized', 'betCancelled', 'betVoided', 'completed', 'failed'],
        required: 'paymentStatus is required'
    },

    createdDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = {
    'Transactions' : mongoose.model('Transactions', TransactionSchema),
    'WalletTransactionSchema' : WalletTransactionSchema
};