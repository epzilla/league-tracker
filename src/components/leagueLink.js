import { Link } from 'preact-router/match';

const getImg = (name) => {
  return name.replace(' ', '-').toLowerCase();
};

const LeagueLink = ({ league }) => {
  return (
    <Link href={`/leagues/${league.slug}`} class="league-link">
      <i class="sport-icon" style={`background-image: url(/assets/icons/sports/${getImg(league.sport.name)}.png)`}></i>
      <span class="league-name">{ league.name }</span>
    </Link>
  );
};

export default LeagueLink;