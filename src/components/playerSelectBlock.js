import Avatar from './Avatar';

const PlayerSelectBlock = ({ doubles, isPartner, player, num, selectCallback, selectBtnText }) => {
  if (player) {
    return (
      <div class="player-selected-block flex">
        <div class="avatar-wrap">
          <Avatar fname={player.fname} lname={player.lname} />
        </div>
        <div class="player-name-wrap">
          <h3>{ player.fname } { player.lname }</h3>
        </div>
        <button class="btn primary" onClick={() => selectCallback(num)}>{ selectBtnText }</button>
      </div>
    );
  }

  return (
    <div class="player-selected-block flex empty" onClick={() => selectCallback(num)}>
      <div class="avatar-wrap">
        <Avatar empty={true} />
      </div>
      <div class="player-name-wrap">
        <h3>Select { isPartner ? 'Partner' : 'Player' }</h3>
      </div>
    </div>
  );
};

export default PlayerSelectBlock;