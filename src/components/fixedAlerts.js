import * as Constants from '../lib/constants';
import { getBestGuessDevice } from '../lib/helpers';
import { route } from 'preact-router';
import CSSTransitionGroup from 'preact-css-transition-group';

const goToHomeScreen = (dismiss) => {
  route('/');
  dismiss();
};

const RenderAlertBody = (alert, device, dismiss) => {
  switch (alert.type) {
    case Constants.MATCH_STARTED:
      return NewMatchAlert(alert.msg, device, dismiss);
    default:
      return alert.msg;
  }
};

const NewMatchAlert = (match, device, dismiss) => {
  let clickOrTap = 'Click';
  let type = device && device.type ? device.type : getBestGuessDevice();
  if (type === Constants.DEVICE_TYPES.MOBILE_DEVICE || type === Constants.DEVICE_TYPES.TABLET_DEVICE) {
    clickOrTap = 'Tap';
  }
  return (
    <span onClick={() => goToHomeScreen(dismiss)}>{ match.player1Fname } and { match.player2Fname } just started a match. { clickOrTap } here to view.</span>
  );
};

const FixedAlerts = ({ alerts, device, dismiss }) => {
  return (
    <div class="fixed-alerts">
      <CSSTransitionGroup
        transitionName="alert-slide-in"
        transitionAppear={false}
        transitionLeave={true}
        transitionEnter={true}
        transitionEnterTimeout={310}
        transitionLeaveTimeout={310}
      >
        {
          alerts.map((al, i) => {
            return (
              <div key={al.id} class={`alert alert-${al.type}`}>
                { RenderAlertBody(al, device, dismiss) }
                <button class="close-button" onClick={() => dismiss(i)}>&times;</button>
              </div>
            );
          })
        }
      </CSSTransitionGroup>
    </div>
  );
};

export default FixedAlerts;