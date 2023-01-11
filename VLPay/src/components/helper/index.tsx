import {Linking, Platform} from 'react-native';
import {
  check,
  Permission,
  PERMISSIONS,
  request,
  RESULTS,
} from 'react-native-permissions';

const removeFirstCharacter = (str: string, c: string) => {
  while (str.charAt(0) === c) {
    return str.substring(1);
  }
  return str.replace('+84', '');
};

const removeCodeNumber = (str: string) => {
  const text = str.replace('+' + '84', '0');
  return text;
};

/**
 * Format number
 */
const formatNumber = (value: number | string, separate?: ',' | '.'): string => {
  const valueMain = (Number(value) / 1).toFixed(0);
  return String(valueMain).replace(
    /(\d)(?=(\d{3})+(?!\d))/g,
    `$1${separate || ','}`,
  );
};

/**
 * Convert cash from string to integer
 */
const convertStringNumber = (value: string) => {
  if (value) {
    // eslint-disable-next-line radix
    return parseInt(formatCurrency(escapeCurrency(value)).replace(/\./g, ''));
  }
  return 0;
};

/**
 * Format number k
 */
const formatNumberThousand = (value: number | string): string => {
  if (Number(value)) {
    return formatNumber((Number(value) / 1000).toFixed(0));
  }
  return '0';
};

/**
 *
 * Remove all special characters
 */
const removeAllSpecialCharacters = (value: string) => {
  return value.replace(/[`~!@#$%^&*()_|+\-=?;:'" N,.<>\{\}\[\]\\\/]/gi, '');
};

const formatCurrency = (value: string): string => {
  return value.split('.')[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const escapeCurrency = (value: string): string => {
  return value
    .replace(/-/g, '')
    .replace(/,/g, '')
    .replace(/ /g, '')
    .replace(/\./g, '')
    .replace(/\b0+/g, '');
};

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

/**
 * makePhoneCall
 * @param telephone string
 */
const makePhoneCall = (telephone: string) => () => {
  const phoneMain = '0' + removeFirstCharacter(telephone, '0');
  const url = Platform.select({
    ios: `telprompt:${phoneMain}`,
    android: `tel:${phoneMain}`,
  });
  url &&
    Linking.openURL(url).catch(() =>
      console.log('Not support for making a phone call'),
    );
};

/**
 * makeMessage
 * @param telephone string
 */
const makeMessage = (telephone: string) => () => {
  Linking.openURL(`sms:${telephone}`).catch(() =>
    console.log('Not support for send message'),
  );
};

/**
 * openMapDirection
 * @param destination Object
 */
const openMapDirection =
  (destination: {latitude: number; longitude: number; label: string}) => () => {
    if (destination?.latitude && destination?.longitude) {
      const latitudeMain = destination.latitude;
      const longitudeMain = destination.longitude;
      const scheme = Platform.select({
        ios: 'maps:0,0?q=',
        android: 'geo:0,0?q=',
      });
      const latLng = `${latitudeMain},${longitudeMain}`;
      const label = destination?.label;
      const url = Platform.select({
        ios: `${scheme}${label}@${latLng}`,
        android: `${scheme}${latLng}(${label})`,
      });
      if (url) {
        Linking.openURL(url);
      }
    }
  };

export {
  removeFirstCharacter,
  removeCodeNumber,
  formatNumber,
  formatNumberThousand,
  convertStringNumber,
  removeAllSpecialCharacters,
  formatCurrency,
  escapeCurrency,
  getRandomColor,
  makePhoneCall,
  makeMessage,
  openMapDirection,
};
