var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  auth0Domain = process.env.AUTH0_DOMAIN || 'rozrywki2018.auth0.com',
  authentication = require('./api/middleware/authentication'),
  mongoose = require('mongoose'),
  Task = require('./api/models/transaction'),
  bodyParser = require('body-parser');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/Payments');

authentication = authentication(auth0Domain);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(authentication);

var routes = require('./api/routes/transactionRoutes');
routes(app);

app.listen(port);

console.log('Payments API server started on: ' + port);