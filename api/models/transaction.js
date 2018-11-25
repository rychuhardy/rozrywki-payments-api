'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var TransactionSchema = new Schema({

    userId: {
        type: String,
        required: 'userId is required'
    },

    amount: {
        type: Number,
        required: 'amount is required'
    },

    status: {
        type: [{
            type: String,
            enum: ['initialized', 'cancelled', 'voided', 'completed', 'failed']
        }],
        required: 'type is required'
    },

    createdDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Transactions', TransactionSchema);