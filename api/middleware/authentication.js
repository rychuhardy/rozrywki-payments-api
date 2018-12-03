const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const checkJwt = (auth0Domain) => jwt({
  // Dynamically provide a signing key
  // based on the kid in the header and
  // the signing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${auth0Domain}/.well-known/jwks.json`
  }),

  audience: 'rozrywki2018',
  issuer: `https://${auth0Domain}/`,
  algorithms: ['RS256']
});

module.exports = checkJwt;