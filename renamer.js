const fs = require('fs');

let fnames = fs.readdirSync('src/routes');
fnames.forEach(n => {
  fs.renameSync(__dirname + '\\src\\routes\\' + n, __dirname + '\\src\\routes\\' + n[0].toUpperCase() + n.slice(1));
})