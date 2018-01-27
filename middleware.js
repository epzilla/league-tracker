/**
 * Custom middleware used by the application
 */
module.exports = {

  /**
   *  Protect routes on your api from unauthenticated access
   */
  auth: function auth(req, res, next) {
    if (req.method === 'OPTIONS' || req.isAuthenticated() ||
        (req.method === 'POST' && req.baseUrl === '/api/users') ||
        (req.baseUrl === '/api/session')) {
      return next();
    }
    res.sendStatus(401);
  },

  /**
   * Set a cookie for the client so it knows we have an http session
   */
  setUserCookie: function setUserCookie(req, res, next) {
    if (req.user) {
      res.cookie('user', JSON.stringify(req.user.userInfo));
    }
    next();
  }
};