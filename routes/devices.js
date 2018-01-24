const guid = require('../helpers').generateGuid;
let Devices;

exports.init = (models) => {
  Devices = models.Devices;
};

exports.get = (req, res) => {
  return Devices.findAll().then(d => res.json(d));
};

exports.create = (req, res) => {
  const deviceName = req.body.name;
  const deviceType = req.body.type || 'Mobile';
  if (!deviceName) {
    return res.status(400).send('No name supplied');
  }

  let device = Devices.build({
    name: deviceName,
    type: deviceType,
    id: guid()
  });
  return device.save().then(d => {
    return res.json(d);
  }).catch(err => {
    return res.status(500).send(err);
  });
};