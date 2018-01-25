import PingPongBoxScore from './PingPongBoxScore';

const BoxScore = (props) => {
  switch (props.sport) {
    default:
      return <PingPongBoxScore {...props} />;
  }
};

export default BoxScore;