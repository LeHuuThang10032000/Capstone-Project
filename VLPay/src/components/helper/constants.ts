import { Dimensions } from 'react-native';

// default phone code (vi)
export const PHONE_CODE = '+84';

// google map api key
export const GG_MAP_API_KEY = 'AIzaSyDIhNolo4QzDkFML-LBCM5JOEsPyHHkUU8';

// google map address search
export const GG_MAP_PLACE_SEARCH = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?';

// google map geocode search
export const GG_MAP_GEO_SEARCH = 'https://maps.googleapis.com/maps/api/geocode/json?';

// google map search place detail
export const GG_MAP_PLACE_DETAIL = 'https://maps.googleapis.com/maps/api/place/details/json?';

// phone code
export const CodePhoneVI = '84';

// get screen width and height
export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('screen');

// get window width and height
export const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get('window');

// eslint-disable-next-line no-control-regex, prettier/prettier, max-len
export const EMAIL_REGEX = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g;

// eslint-disable-next-line max-len
export const PHONE_REGEX =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

// Vietnam phone regex
export const VN_PHONE_REGEX = /^((0)?)(2)(\d){9}|^((0)?)(3|5|7|8|9)(\d){8}|(1900)(\d){4,6}/g;

// policies web url
export const POLICIES_URL = 'https://eship77.com/policy.html';

// term web url
export const TERMS_URL = 'https://eship77.com/terms.html';

// min with draw amount
export const MIN_WITH_DRAW_AMOUNT = 100000;

// maximum price for food
export const MAX_FOOD_PRICE = 2000000;

// minimum price for food
export const MIN_FOOD_PRICE = 1000;

// DEFAULT_HISTORY_LIMIT_PER_PAGE
export const DEFAULT_HISTORY_LIMIT_PER_PAGE = 20;

// DEFAULT_ORDER_LIMIT_PER_PAGE
export const DEFAULT_ORDER_LIMIT_PER_PAGE = 50;

// DEFAULT_RATING_LIMIT_PER_PAGE
export const DEFAULT_RATING_LIMIT_PER_PAGE = 50;

// DEFAULT_WITHDRAW_HISTORY_LIMIT_PER_PAGE
export const DEFAULT_WITHDRAW_HISTORY_LIMIT_PER_PAGE = 50;

export const DEFAULT_INBOX_LIMIT_PER_PAGE = 50;
