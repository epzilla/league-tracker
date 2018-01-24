const Sequelize = require('sequelize');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');
const morgan = require('morgan')
const chalk = require('chalk');

let socketCallbacks = {};

// Define your models
const database = new Sequelize(null, null, null, {
  dialect: 'sqlite',
  storage: './data/sport.db',
  logging: false
});

// Initialize server
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization, Access-Control-Allow-Origin, Access-Control-Allow-Methods, Cache-Control')
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Origin', '*');
  next();
});
app.use(morgan('dev'));
app.set('views', path.join(__dirname, 'public/views'));
app.set('view engine', 'pug');
const server = http.createServer(app);

const models = {};
fs.readdirSync(__dirname + '/models').forEach(m => {
  let name = m.slice(0, -3);
  models[name] = database.import(__dirname + `/models/${m}`);
});

const wss = new WebSocket.Server({ server });
wss.on('connection', ws => {
  ws.on('message', message => {
    const data = JSON.parse(message);
    console.log(chalk.magenta(`========================================`));
    console.log(chalk.magenta(`Received WebSocket Message from Device:`));
    console.log(chalk.magenta(data.deviceId));
    console.log(chalk.magenta(`========================================`));
    console.log(chalk.cyan(`Type: ${data.type}`));
    console.dir(data.msg);
    console.log(chalk.magenta(`========================================`));
    if (socketCallbacks[data.type]) {
      socketCallbacks[data.type].forEach(cb => cb(data));
    }
  });

  ws.on('error', () => {});
});

const sendSocketMsg = (type, data, originDeviceId) => {
  let obj = { type, originDeviceId };
  obj.data = typeof data === 'string' ? data : JSON.stringify(data);
  console.log(chalk.cyan('=========== Sending WebSocket Message ==========='));
  console.log(chalk.magenta(`Type: ${type}`));
  console.dir(data);
  console.log(chalk.cyan(`=================================================`));
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(obj));
    }
  });
};

const registerForSocketMsgs = (type, cb) => {
  if (!socketCallbacks[type]) {
    socketCallbacks[type] = [cb];
  } else {
    socketCallbacks[type].push(cb);
  }
};

require('./routes')(models, app, database, sendSocketMsg, registerForSocketMsgs);

// Create database and listen
server.listen(3000, () => {
  const addr = server.address();
  console.log(`listening at ${addr.address}:${addr.port}`);
});