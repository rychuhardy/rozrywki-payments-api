var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  auth0Domain = process.env.AUTH0_DOMAIN || 'rozrywki2018.auth0.com',
  authentication = require('./api/middleware/authentication'),
  mongoose = require('mongoose'),
  Task = require('./api/models/transaction'),
  bodyParser = require('body-parser'),
  morgan = require('morgan');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/Payments');

morgan.token('user_id', function (req, res) {
  if (req.user !== undefined) return req.user['sub']
})
authentication = authentication(auth0Domain);

app.use(morgan(':date[iso] :method :url user-id=:user_id status=:status content-length=:res[content-length] - :response-time ms'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(authentication);

var routes = require('./api/routes/transactionRoutes');
routes(app);

app.listen(port);

console.log('Payments API server started on: ' + port);