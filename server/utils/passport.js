const passport = require("passport");
const BearerStrategy = require("passport-http-bearer").Strategy;
const {
  validateToken,
} = require("../modules/customers/tokens/tokens.services");
const {
  validateToken: validateAdminToken,
} = require("../modules/admin/tokens/tokens.services");

/**
 * Configure the Bearer strategy for Users taking Surveys.
 */
passport.use(
  "customer",
  new BearerStrategy(async function (token, done) {
    try {
      // Validate Token
      const user = await validateToken(token);
      return done(null, user);
    } catch (error) {
      done(null, false);
    }
  })
);

/**
 * Configure the Bearer strategy for Admin Users.
 */
passport.use(
  "admin",
  new BearerStrategy(async function (token, done) {
    try {
      // Validate Token
      const user = await validateAdminToken(token);
      return done(null, user);
    } catch (error) {
      done(null, false);
    }
  })
);

/**
 * Configure Passport authenticated session persistence.
 *
 * In order to restore authentication state across HTTP requests, Passport needs
 * to serialize users into and deserialize users out of the session.  In a
 * production-quality application, this would typically be as simple as
 * supplying the user ID when serializing, and querying the user record by ID
 * from the database when deserializing.  However, due to the fact that this
 * example does not have a database, the complete Google profile is serialized
 * and deserialized.
 */
passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

module.exports = passport;
