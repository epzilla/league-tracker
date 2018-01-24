let Players;

exports.init = (models) => {
  Players = models.Players;
};

exports.get = (req, res) => {
  return Players.findAll().then(p => res.json(p));
};

exports.create = (req, res) => {
  const fullName = req.body.name;
  if (!fullName) {
    return res.status(400).send('No name supplied');
  }

  const nameParts = fullName.trim().split(' ').map(str => str.trim()).filter(str => str.length > 0);
  let player;
  if (nameParts.length === 1) {
    player = Players.build({ fname: fullName });
  } else if (nameParts.length === 2) {
    player = Players.build({
      fname: nameParts[0],
      lname: nameParts[1]
    });
  } else if (nameParts.length > 2) {
    player = Players.build({
      fname: nameParts[0],
      middleInitial: nameParts[1],
      lname: nameParts.slice(2).join(' ')
    });
  }

  return player.save().then(p => {
    return res.json(p);
  }).catch(err => {
    return res.sendStatus(500);
  });
};