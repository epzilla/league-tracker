let DivisionStandings;
let Leagues;
let Competitions;
let Teams;
let TeamStandings;
let Op;

exports.init = (models, db) => {
  Op = db.Op;
  DivisionStandings = models.DivisionStandings;
  Competitions = models.Competitions;
  Leagues = models.Leagues;
  Teams = models.Teams;
  TeamStandings = models.TeamStandings;
};

exports.get = (req, res) => {
  return DivisionStandings.findAll().then(p => res.json(p));
};

exports.getCurrentForLeague = (req, res) => {
  let leagueSlug = req.params.leagueSlug;
  return Leagues.find({ where: { slug: leagueSlug }}).then(l => {
    return Competitions.find({ where: { [Op.and]: [{ leagueId: l.id }, { current: true }]}}).then(c => {
      return DivisionStandings.find({ where: { competitionId: c.id }}).then(ds => {
        return TeamStandings.findAll({
          where: { divisionStandingsId: ds.id },
          include: [{ model: Teams, as: 'team' }],
          order: [['standing', 'ASC']]
        }).then(ts => {
          res.json(ts);
        });
      });
    });
  });
};