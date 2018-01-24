const Expandable = (props) => {
    let classes = props.collapsed ? 'expandable collapsed' : 'expandable';

    if (props.small) {
      classes += ' small';
    }

    if (props.centered) {
      classes += ' centered';
    }

    return (
      <div class={classes}>
        <div class="expandable-header">
          <h3><label for={`expandable-${props.title}`} >{ props.title }</label></h3>
        </div>
        <input class="hidden-checkbox" checked={ !props.collapsed } type="checkbox" id={`expandable-${props.title}`} onChange={() => props.toggle(props.id)} />
        <div class="expandable-body">
          { props.children }
        </div>
        <label class="toggle-btn-label" for={`expandable-${props.title}`} ></label>
      </div>
    );

};

export default Expandable;