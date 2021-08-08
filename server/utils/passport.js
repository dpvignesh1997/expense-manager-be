const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const BearerStrategy = require("passport-http-bearer").Strategy;
const { validateToken } = require("../modules/customer/tokens/services");
// const {
//   validateToken: validateAdminToken,
// } = require("../modules/admin/tokens/services");

/**
 * Configure the Google strategy for use by Passport.
 *
 * OAuth 2.0-based strategies require a `verify` function which receives the
 * credential (`accessToken`) for accessing the Google API on the user's
 * behalf, along with the user's profile.  The function must invoke `cb`
 * with a user object, which will be set at `req.user` in route handlers after
 * authentication.
 */
// passport.use(
//   "google",
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: CALLBACKS.GOOGLE,
//     },
//     async function (accessToken, refreshToken, profile, cb) {
//       // In this example, the user's Google profile is supplied as the user
//       // record.  In a production-quality application, the Google profile should
//       // be associated with a user record in the application's database, which
//       // allows for account linking and authentication with other identity
//       // providers.
//       // console.log(accessToken, refreshToken, profile);
//       const customer = await serializeUser(profile._json);
//       return cb(null, customer);
//     }
//   )
// );

/**
 * Configure the Bearer strategy for Users taking Surveys.
 */
passport.use(
  "customer",
  new BearerStrategy(async function (token, done) {
    try {
      // Validate Token
      const customer = await validateToken(token);
      return done(null, customer);
    } catch (error) {
      done(null, false);
    }
  })
);

/**
 * Configure the Bearer strategy for Admin Users.
 */
// passport.use(
//   "admin",
//   new BearerStrategy(async function (token, done) {
//     try {
//       // Validate Token
//       const user = await validateAdminToken(token);
//       return done(null, user);
//     } catch (error) {
//       done(null, false);
//     }
//   })
// );

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
