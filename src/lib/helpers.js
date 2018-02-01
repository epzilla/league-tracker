import parse from 'date-fns/parse';
import isThisYear from 'date-fns/is_this_year';
import differenceInDays from 'date-fns/difference_in_days'
import distanceInWords from 'date-fns/distance_in_words'
import format from 'date-fns/format';
import { DEVICE_TYPES } from './constants';

export const lightenOrDarken = (col, amt) => {
    let usePound = false;
    if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
    }

    let num = parseInt(col, 16);
    let red = (num >> 16) + amt;
    if (red > 255) {
      red = 255;
    } else if (red < 0) {
      red = 0;
    }

    let blue = ((num >> 8) & 0x00FF) + amt;
    if (blue > 255) {
      blue = 255;
    } else if (blue < 0) {
      blue = 0;
    }

    let green = (num & 0x0000FF) + amt;
    if (green > 255) {
      green = 255;
    } else if (green < 0) {
      green = 0;
    }

    return (usePound?"#":"") + String("000000" + (green | (blue << 8) | (red << 16)).toString(16)).slice(-6);
};

export const getFormattedMatchDate = (match) => {
  let date = match.finished ? parse(match.finishTime) : parse(match.startTime);
  let now = new Date();

  if (Math.abs(differenceInDays(now, date)) < 7) {
    return `${format(date, 'dddd')} at ${format(date, 'h:mm')}`;
  }

  if (isThisYear(date)) {
    return format(date, 'M/D');
  }

  return format(date, 'M/D/YY');
};

export const getMatchTimeAgo = (match) => {
  return distanceInWords(new Date(), parse(match.startTime), { includeSeconds: true, addSuffix: true });
};

export const getBestGuessDevice = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const greaterDimension = height >= width ? height : width;
  const lesserDimension = greaterDimension === height ? width: height;
  const hiDpi = window.matchMedia('(min-resolution: 120dpi)').matches || window.matchMedia('(-webkit-min-device-pixel-ratio: 1.3)').matches;

  if (greaterDimension < 800) {
    return DEVICE_TYPES.MOBILE_DEVICE;
  } else if (greaterDimension < 1200 && lesserDimension < 800) {
    return DEVICE_TYPES.TABLET_DEVICE;
  } else if (greaterDimension < 1800 && lesserDimension >= 800 || greaterDimension < 2400 && hiDpi) {
    return DEVICE_TYPES.LAPTOP_DEVICE
  } else if (greaterDimension > 1800) {
    return DEVICE_TYPES.DESKTOP_DEVICE
  }

  return DEVICE_TYPES.OTHER_DEVICE;
};

export const generateGuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
  });
};

export const orderBy = (items, predicate) => {
  if (typeof predicate === 'string') {
    items.sort((a,b) => a[predicate] - b[predicate]);
  } else {
    items.sort((a,b) => predicate(a) - predicate(b));
  }
  return items;
};

export const groupBy = (items, predicate) => {
  return items.reduce((obj, item) => {
    if (typeof predicate === 'string') {
      (obj[item[predicate]] = obj[item[predicate]] || []).push(item);
    } else {
      (obj[predicate(item)] = obj[predicate(item)] || []).push(item);
    }
    return obj;
  }, {});
};