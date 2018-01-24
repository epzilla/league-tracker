const Toggle = ({ onOff, toggled, property, id, altColor }) => {

  return (
    <div class={`toggle ${altColor ? 'alt-color' : ''}`}>
      <input id={id} type="checkbox" checked={onOff} onChange={(e) => toggled(property)} />
      <label for={id}>Toggle</label>
    </div>
  );
};

export default Toggle;