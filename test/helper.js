let chai = require('chai');
let chaiHttp = require('chai-http');

chai.use(chaiHttp);

module.exports = {
  expect: chai.expect,
  request: chai.request
}