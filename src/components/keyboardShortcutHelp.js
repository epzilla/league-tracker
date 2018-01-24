import CSSTransitionGroup from 'preact-css-transition-group';

const KeyboardShortcutHelp = ({ show, dismiss }) => {
  let modal;
  if (show) {
    modal = (
      <div key={1}>
        <div class="modal-backdrop"></div>
        <div class="modal scale-in keyboard-shortcuts">
          <div class="modal-header">
            <h2>Keyboard Shortcuts</h2>
            <button class="dismiss-btn" onClick={dismiss}>&times;</button>
          </div>
          <div class="modal-body flex">
            <div class="flex-col">
              <table>
                <thead>
                  <tr>
                    <td colspan="2"><strong>Global</strong></td>
                  </tr>
                  <tr>
                    <th class="one-third">Key</th>
                    <th class="two-thirds">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="one-third"><span class="key light">G</span> then<span class="key light">H</span></td>
                    <td class="two-thirds">Go to Home page</td>
                  </tr>
                  <tr>
                    <td class="one-third"><span class="key light">G</span> then<span class="key light">S</span></td>
                    <td class="two-thirds">Go to Stats Page</td>
                  </tr>
                  <tr>
                    <td class="one-third"><span class="key light">G</span> then<span class="key light">Y</span></td>
                    <td class="two-thirds">Go to Yearly Results Page</td>
                  </tr>
                  <tr>
                    <td class="one-third"><span class="key light">G</span> then<span class="key light">D</span></td>
                    <td class="two-thirds">Go to Depth Chart</td>
                  </tr>
                  <tr>
                    <td class="one-third"><span class="key light">G</span> then<span class="key light">R</span></td>
                    <td class="two-thirds">Go to Recruiting Page</td>
                  </tr>
                  <tr>
                    <td class="one-third"><span class="key light">G</span> then<span class="key light">P</span></td>
                    <td class="two-thirds">Go to Profile Page</td>
                  </tr>
                  <tr>
                    <td class="one-third"><span class="key light">C</span></td>
                    <td class="two-thirds">Check in to today's game (only works if logged in)</td>
                  </tr>
                  <tr>
                    <td class="one-third"><span class="key light">K</span></td>
                    <td class="two-thirds">Show/hide keyboard shortcuts</td>
                  </tr>
                </tbody>
              </table>
              <table class="table table-condensed table-responsive">
                <thead>
                  <tr>
                    <td colspan="2"><strong>Stats Page</strong></td>
                  </tr>
                  <tr>
                    <th class="one-third">Key</th>
                    <th class="two-thirds">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="one-third"><span class="key light">/</span></td>
                    <td class="two-thirds">Place cursor in team select box</td>
                  </tr>
                  <tr>
                    <td class="one-third"><span class="key light">Shift</span> + <span class="key light">Enter</span></td>
                    <td class="two-thirds">Submit (works even if cursor is in team select field)</td>
                  </tr>
                  <tr>
                    <td class="one-third"><span class="key light">R</span></td>
                    <td class="two-thirds">Reset form</td>
                  </tr>
                  <tr>
                    <td class="one-third"><span class="key light">Tab</span> then <span class="key light">Space</span></td>
                    <td class="two-thirds">Tab through the games, and press [Space] to update attendance for the highlighted game</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="flex-col">
              <table class="table table-condensed table-responsive">
                <thead>
                  <tr>
                    <td colspan="2"><strong>Yearly Results Page</strong></td>
                  </tr>
                  <tr>
                    <th class="one-third">Key</th>
                    <th class="two-thirds">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="one-third"><span class="key light">&#x2B05;</span></td>
                    <td class="two-thirds">View previous year</td>
                  </tr>
                  <tr>
                    <td class="one-third"><span class="key light"><span class="flip">&#x2B05;</span></span></td>
                    <td class="two-thirds">View next year</td>
                  </tr>
                  <tr>
                    <td class="one-third"><span class="key light">Tab</span> then <span class="key light">Space</span></td>
                    <td class="two-thirds">Tab through the games, and press [Space] to update attendance for the highlighted game</td>
                  </tr>
                </tbody>
              </table>
              <table class="table table-condensed table-responsive">
                <thead>
                  <tr>
                    <td colspan="2"><strong>Recruiting Page</strong></td>
                  </tr>
                  <tr>
                    <th class="one-third">Key</th>
                    <th class="two-thirds">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="one-third"><span class="key light">&#x2B05;</span></td>
                    <td class="two-thirds">View previous recruiting class</td>
                  </tr>
                  <tr>
                    <td class="one-third"><span class="key light"><span class="flip">&#x2B05;</span></span></td>
                    <td class="two-thirds">View next recruiting class</td>
                  </tr>
                  <tr>
                    <td class="one-third"><span class="key light">N</span></td>
                    <td class="two-thirds">Sort by Name</td>
                  </tr>
                  <tr>
                    <td class="one-third"><span class="key light">P</span></td>
                    <td class="two-thirds">Sort by Position</td>
                  </tr>
                  <tr>
                    <td class="one-third"><span class="key light">H</span></td>
                    <td class="two-thirds">Sort by Hometown</td>
                  </tr>
                  <tr>
                    <td class="one-third"><span class="key light">Shift</span> + <span class="key light">H</span></td>
                    <td class="two-thirds">Sort by High School</td>
                  </tr>
                  <tr>
                    <td class="one-third"><span class="key light">R</span></td>
                    <td class="two-thirds">Sort by Rivals <span class="glyphicon glyphicon-star"></span></td>
                  </tr>
                  <tr>
                    <td class="one-third"><span class="key light">S</span></td>
                    <td class="two-thirds">Sort by Scout <span class="glyphicon glyphicon-star"></span></td>
                  </tr>
                  <tr>
                    <td class="one-third"><span class="key light">Shift</span> + <span class="key light">R</span></td>
                    <td class="two-thirds">Sort by Rivals Rank</td>
                  </tr>
                  <tr>
                    <td class="one-third"><span class="key light">Shift</span> + <span class="key light">S</span></td>
                    <td class="two-thirds">Sort by Scout Rank</td>
                  </tr>
                </tbody>
              </table>
            </div>
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
  );
};

export default KeyboardShortcutHelp;