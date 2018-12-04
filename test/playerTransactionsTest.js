let testHelper = require('./helper');
let expect = testHelper.expect;
let request = testHelper.request;

let mongoose = require('mongoose');

let server = require('../server');
let Transaction = require('../api/models/transaction');

// TODO: use JWTs and test authorization
// Here player IS the user making the request.
const noTxsPlayerId = 'fdee213acbde';
const userId = 'abd125dfeac2231'
const playerId = userId;
const user2Id = 'af123313adcb'
const player2Id = user2Id;

let tx1, tx2, tx3;

beforeEach(async () => {
  await Transaction.deleteMany({});
  tx1 = await Transaction.create({
    playerId,
    userId,
    amount: '11.48',
    status: 'completed'
  });
  tx2 = await Transaction.create({
    playerId,
    userId,
    amount: '7.21',
    status: 'voided'
  });
  tx3 = await Transaction.create({
    playerId: player2Id,
    userId: user2Id,
    amount: '2.19',
    status: 'initialized'
  });
})

describe('GET /api/:playerId/transations', () => {
  it('returns empty array for player with no transactions', (done) => {
    request(server).get(`/api/${noTxsPlayerId}/transactions`).send().end((err, res) => {
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body).to.be.an('array').that.is.empty;
      done();
    })
  })

  it('returns player\'s transactions', (done) => {
    request(server).get(`/api/${playerId}/transactions`).send().end((err, res) => {
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      const txs = res.body;
      expect(txs).have.lengthOf(2);
      // Transactions are ordered by created date descending.
      expect(new Date(txs[0].createdDate)).to.be.above(new Date(txs[1].createdDate));

      expect(txs[0].id).to.eql(tx2._id.toString());
      expect(txs[0].status).to.eql(tx2.status);
      expect(txs[0].amount).to.eql(tx2.amount);
      expect(new Date(txs[0].createdDate)).to.eql(tx2.createdDate);

      expect(txs[1].id).to.eql(tx1._id.toString());
      expect(txs[1].status).to.eql(tx1.status);
      expect(txs[1].amount).to.eql(tx1.amount);
      expect(new Date(txs[1].createdDate)).to.eql(tx1.createdDate);

      done();
    })
  })
  // it('returns 401 for unauthenticated user', (done) => {})
  // it('returns 403 for user with insufficient scopes', (done) => {})
})

describe('GET /api/:playerId/transactions/:transactionId', () => {
  const txId = mongoose.Types.ObjectId().toString();
  it('returns 404 if transaction doesn\'t exist', (done) => {
    request(server).get(`/api/${playerId}/transactions/${txId}`).send().end((err, res) => {
      expect(err).to.be.null;
      expect(res).to.have.status(404);
      done();
    })
  })

  it('returns 404 if transaction for given player doesn\'t exist', (done) => {
    request(server).get(`/api/${player2Id}/transactions/${tx1._id.toString()}`).send().end((err, res) => {
      expect(err).to.be.null;
      expect(res).to.have.status(404);
      done();
    })
  })

  it('returns single player\'s transaction', (done) => {
    request(server).get(`/api/${playerId}/transactions/${tx1._id.toString()}`).send().end((err, res) => {
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      expect(res).to.be.json;

      const tx = res.body;
      expect(tx.id).to.eql(tx1._id.toString());
      expect(tx.status).to.eql(tx1.status);
      expect(tx.amount).to.eql(tx1.amount);
      expect(new Date(tx.createdDate)).to.eql(tx1.createdDate);

      done();
    })

  })

  // it('returns 401 for unauthenticated user', (done) => {})
  // it('returns 403 for user with insufficient scopes', (done) => {})
})