/**
 * Custom middleware used by the application
 */
module.exports = {

  /**
   *  Protect routes on your api from unauthenticated access
   */
  auth: function auth(req, res, next) {
    if (req.isAuthenticated() || (req.baseUrl === '/api/users' && req.method === 'POST')) return next();
    res.sendStatus(401);
  },

  /**
   * Set a cookie for the client so it knows we have an http session
   */
  setUserCookie: function setUserCookie(req, res, next) {
    if(req.user) {
      res.cookie('user', JSON.stringify(req.user.userInfo));
    }
    next();
  }
};