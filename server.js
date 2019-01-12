var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    auth0Domain = process.env.AUTH0_DOMAIN || 'rozrywki2018.auth0.com',
    authentication = require('./api/middleware/authentication'),
    mongoUri = process.env.MONGO_URI || 'mongodb://localhost/Payments',
    mongoUsername = process.env.MONGO_USERNAME || '',
    mongoPassword = process.env.MONGO_PASSWORD || '',
    mongoose = require('mongoose'),
    Task = require('./api/models/transaction'),
    Task2 = require('./api/models/player'),
    Task2 = require('./api/models/cashier'),
    bodyParser = require('body-parser'),
    morgan = require('morgan');

mongoose.Promise = global.Promise;
connOpts = {}
if (mongoUsername !== undefined) connOpts.user = mongoUsername;
if (mongoPassword !== undefined) connOpts.user = mongoPassword;
mongoose.connect(mongoUri, connOpts);

morgan.token('user_id', function (req, res) {
    if (req.user !== undefined) return req.user['sub']
})
authentication = authentication(auth0Domain);

app.use(morgan(':date[iso] :method :url user-id=:user_id status=:status content-length=:res[content-length] - :response-time ms'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(authentication);

var transactionRoutes = require('./api/routes/transactionRoutes');
transactionRoutes(app);

var playerRoutes = require('./api/routes/playerRoutes');
playerRoutes(app);

var cashierRoutes = require('./api/routes/cashierRoutes');
cashierRoutes(app);


app.listen(port);

console.log('Payments API server started on: ' + port);

module.exports = app;
