import { DEVICE_TYPES } from '../lib/constants';
import DeviceIcon from './DeviceIcon';

const DeviceTypePicker = ({ callback, selectedType }) => {
  const keyup = (code, type) => {
    if (code === 'Enter' || code === 'Space') {
      callback(DEVICE_TYPES[type]);
    }
  };

  return (
    <div class="device-type-picker">
      {
        Object.keys(DEVICE_TYPES).map((type, i) => {
          return (
            <div onKeyup={e => keyup(e.code, type)} tabindex={i + 3} class={`device-type-option ${DEVICE_TYPES[type] === selectedType ? 'selected' : ''}`} onClick={() => callback(DEVICE_TYPES[type])}>
              <DeviceIcon type={DEVICE_TYPES[type]} />
              <label>{ DEVICE_TYPES[type] }</label>
            </div>
          )
        })
      }
    </div>
  );
};

export default DeviceTypePicker;