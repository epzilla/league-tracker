export default {
  'prefix': 'pong-db',

  get: function (key) {
    let prefixedKey, self;
    self = this;
    prefixedKey = self.prefix.concat('-', key);
    if (window.localStorage && window.localStorage.getItem) {
      try {
        return JSON.parse(window.localStorage.getItem(prefixedKey));
      } catch (e) {
        return;
      }
    }
  },

  set: function (key, val) {
    let prefixedKey, self, value;
    self = this;
    prefixedKey = self.prefix.concat('-', key);
    value = JSON.stringify(val);
    if (window.localStorage && window.localStorage.setItem) {
      try {
        window.localStorage.setItem(prefixedKey, value);
        return value;
      } catch (e) {
        return value;
      }
    }
  },

  delete: function (key) {
    let prefixedKey, self;
    self = this;
    prefixedKey = self.prefix.concat('-', key);
    if (window.localStorage && window.localStorage.removeItem) {
      try {
        window.localStorage.removeItem(prefixedKey);
      } catch (e) {
        return;
      }
    }
  },

  deleteAll: function () {
    self = this;
    if (window.localStorage && window.localStorage.removeItem) {
      try {
        const keys = Object.keys(localStorage).filter(k => k.indexOf(self.prefix) !== -1);
        keys.forEach(k => {
          window.localStorage.removeItem(k);
        });
      } catch (e) {
        return;
      }
    }
  }
};