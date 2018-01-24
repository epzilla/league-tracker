import SelectList from './selectList';
import CSSTransitionGroup from 'preact-css-transition-group';

const GenericModal = ({ header, content, show, confirm, confirmText, cancelText, dismiss }) => {
  let modal;
  if (!!show) {
    modal = (
      <div class="modal-wrapper generic-modal-wrapper" key={1}>
        <div class="modal-backdrop generic-modal-backdrop"></div>
        <div class="modal generic-modal-main">
          <div class="modal-header">
            <h2>{ header }</h2>
            <button class="dismiss-btn" onClick={() => dismiss()}>&times;</button>
          </div>
          <div class="modal-body flex">{ content }</div>
          <div class="modal-btn-container flex">
            { confirm ? <button class="btn secondary" onClick={() => confirm()}>{ confirmText || 'OK' }</button> : null }
            { confirm ? <button class="btn" onClick={() => dismiss()}>{ cancelText || 'Cancel' }</button> : null }
          </div>
        </div>
      </div>
    );
  }

  return (
    <CSSTransitionGroup
      transitionName="modal-pop-in"
      transitionAppear={false}
      transitionLeave={true}
      transitionEnter={true}
      transitionEnterTimeout={200}
      transitionLeaveTimeout={200}
    >
      { modal || null }
    </CSSTransitionGroup>
  )
};

export default GenericModal;