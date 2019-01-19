var mongoose = require('mongoose');
var transaction = require('./transaction')
var Schema = mongoose.Schema;

var CashierSchema = new Schema({
    cashierId: {
        type: String,
        required: 'cashierId is required',
        unique: true
    },

    walletTransactions: [transaction.WalletTransactionSchema],

    createdDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Cashier', CashierSchema);