import Config from '../config';

let callbacks = {};
let ws = null;
let initialized = false;
let devMode = false;

const fireCallbacks = ({ type, data }) => {
  if (type && data && callbacks[type] && callbacks[type].length > 0) {
    try {
      let json = JSON.parse(data);
      if (json) {
        if (devMode) {
          console.info(json);
        }
        callbacks[type].forEach(cb => cb(json));
      }
    } catch (e) {
      console.error(e);
    }
  }
};

const WebSocketService = {
  init: (useDevMode) => {
    return new Promise((resolve, reject) => {
      if (initialized) {
        resolve();
      } else {
        devMode = !!useDevMode;
        try {
          ws = new WebSocket(`ws://${window.location.hostname}:3000`);
          ws.onerror = (e) => console.error(e);
          ws.onopen = () => console.log(`WebSocket connection established.`);
          ws.onclose = () => console.log('WebSocket connection closed');
          ws.onmessage = (m) => {
            if (m && m.data) {
              let json = JSON.parse(m.data);
              if (json && json.data) {
                fireCallbacks(json);
              }
            }
          };
          initialized = true;
          resolve();
        } catch (e) {
          reject(e);
        }
      }
    });
  },

  subscribe: (type, cb) => {
    if (callbacks[type]) {
      callbacks[type].push(cb);
    } else {
      callbacks[type] = [cb];
    }

    if (Config.devMode) {
      console.log(callbacks);
    }
  },

  unsubscribe: (type, cb) => {
    if (callbacks[type]) {
      let i = callbacks[type].findIndex(fn => fn === cb);
      if (i !== -1) {
        callbacks[type].splice(i, 1);
      }
    }

    if (Config.devMode) {
      console.log(callbacks);
    }
  },

  send: (type, msg) => {
    ws.send(JSON.stringify({ type, msg }));
  }
}

export default WebSocketService;