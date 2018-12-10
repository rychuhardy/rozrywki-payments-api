'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TransactionSchema = new Schema({

    betId: {
        type: String,
        required: 'betId is required'
    },


    playerId: {
        type: String,
        required: 'playerId is required'
    },

    amount: {
        type: Schema.Types.Decimal128,
        required: 'amount is required'
    },

    hasWon: {
        type: Boolean,
        default: false
    },

    paymentStatus: {
        type: String,
        enum: ['initialized', 'betCancelled', 'betVoided', 'completed', 'failed', 'paidOut'],
        required: 'paymentStatus is required'
    },

    createdDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Transactions', TransactionSchema);