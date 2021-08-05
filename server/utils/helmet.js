const helmet = require("helmet");

/**
 * Helmet Configuration
 * @param {Express} app
 */
module.exports = (app) => {
  try {
    // Security Headers
    app.use(
      helmet.contentSecurityPolicy({
        directives: {
          "default-src": ["'self'"],
          "script-src": ["'self'"],
        },
      })
    );
    app.use(
      helmet.expectCt({
        maxAge: 86400,
      })
    );
    app.use(
      helmet.frameguard({
        action: "sameorigin",
      })
    );
    app.use(
      helmet.referrerPolicy({
        policy: "same-origin",
      })
    );
    app.use(helmet.hidePoweredBy());
    app.use(helmet.hsts());
    app.use(helmet.ieNoOpen());
    app.use(helmet.noSniff());
    app.use(helmet.xssFilter());
    app.use(helmet.hidePoweredBy());
  } catch (error) {
    console.error(error);
  }
};
