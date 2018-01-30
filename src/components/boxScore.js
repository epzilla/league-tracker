import PingPongBoxScore from './PingPongBoxScore';
import SoccerBoxScore from './SoccerBoxScore';

const BoxScore = (props) => {
  if (props.sport) {
    switch (props.sport.name) {
      case 'Soccer':
        return <SoccerBoxScore {...props} />;
      default:
        return <PingPongBoxScore {...props} />;
    }
  }
};

export default BoxScore;