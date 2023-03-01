import { t } from 'i18next';
import moment from 'moment';
import { Linking, Platform } from 'react-native';
import { Image } from 'react-native-compressor';

/**
 * apiErrorCodeMapping
 * @param code string
 * @returns string | undefined
 */
const apiErrorCodeMapping = (code?: string): string | undefined => {
    const translation = t<string>(`common:${code}`);
    if (translation === code) {
        return undefined;
    }
    return translation;
};

/**
 * makeMessage
 * @param telephone string
 */
const makeMessage = (telephone: string) => (): void => {
    console.log('Make a sms to ', telephone);
    Linking.openURL(`sms:${telephone}`).catch(() => console.log('Not support for send message'));
};

/**
 * Format number
 * @param value number or string
 * @param separate string optional. Default ','
 * @returns string formatted number
 */
const formatNumber = (value: number | string, separate?: ',' | '.'): string => {
    const numberValue = removeNotDigit(String(value));
    const fixedValue = Number(numberValue).toFixed(0);
    return String(fixedValue).replace(/(\d)(?=(\d{3})+(?!\d))/g, `$1${separate || ','}`);
};

/**
 * formatTimeInput
 * @param value string
 * @returns string
 */
const formatTimeInput = (value: string): string => {
    return String(value)
        .slice(0, 4)
        .replace(/(\d)(?=(\d{2})+(?!\d))/g, `$1${':'}`);
};

/**
 * Remove character is not a number in value
 * @param value string
 * @returns string
 */
const removeNotDigit = (value: string): string => {
    return (value.match(/([0-9]*)/g) || []).join('');
};

/**
 * compressImage
 * @param url string
 * @returns Promise<string>
 */
const compressImage = async (url: string): Promise<string> => {
    try {
        // compress success will return compressed image link
        const result = await Image.compress(url, {
            compressionMethod: 'auto',
        });
        return result;
    } catch {
        // if error return original url
        return url;
    }
};

/**
 * genUUID
 * @returns number
 */
const genUUID = (): number => {
    return Date.now() * Math.random();
};

/**
 * calculatorDate
 * @returns string
 */
const calculatorDate = (startDate: string, endDate: string, format = 'YYYY-MM-DD HH:mm'): string => {
    const month = moment(endDate, format).diff(moment(startDate, format), 'months');
    const days = moment(endDate, format).diff(moment(startDate, format), 'days');
    const hours = moment(endDate, format).diff(moment(startDate, format), 'hours');
    const minutes = moment(endDate, format).diff(moment(startDate, format), 'minutes');
    const seconds = moment(endDate, format).diff(moment(startDate, format), 'seconds');
    if (month > 0) {
        return `${month} tháng`;
    } else if (days > 0) {
        return `${days} ngày`;
    } else if (hours > 0) {
        return `${hours} giờ`;
    } else if (minutes > 0) {
        return `${minutes} phút`;
    } else if (seconds > 0) {
        return `${minutes} giây`;
    }
    return '';
};

/**
 * random get string
 * @param length number
 * @returns string
 */
const generateRandomString = (length: number): string => {
    const char = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890';
    const random = Array.from({ length: length }, () => char[Math.floor(Math.random() * char.length)]);
    const randomString = random.join('');
    return randomString;
};

/* removeSpaces
 * @param value string
 * @returns string
 */
const removeSpaces = (value: string): string => {
    return value.replace(/\s+/g, ' ');
};

/**
 * getRandomColor
 * @returns string
 */
const getRandomColor = (): string => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

/**
 * openMap
 * @param coords.lat number
 * @param coords.lng number
 * @param label string
 */
const openMap = (coords: { lat: number; lng: number }, label: string): void => {
    if (coords?.lat && coords?.lng) {
        const latLng = `${coords.lat},${coords.lng}`;
        const url = Platform.select({
            ios: `maps:0,0?q=${label}@${latLng}`,
            android: `geo:0,0?q=${latLng}(${label})`,
        });
        url && Linking.openURL(url);
    }
};
/**
 * diff time
 * @param value string
 * @returns string
 */
const diffTime = (value: string): string => {
    const now = moment();
    const time = moment(value, 'YYYY-MM-DD HH:mm:ss');

    const seconds = now.diff(time, 'second');
    const minutes = now.diff(time, 'minute');
    const hours = now.diff(time, 'hour');
    const days = now.diff(time, 'day');
    const months = now.diff(time, 'month');
    const years = now.diff(time, 'year');

    if (years > 0) {
        return `${years} năm trước`;
    } else if (months > 0) {
        return `${months} tháng trước`;
    } else if (days > 0) {
        return `${days} ngày trước`;
    } else if (hours > 0) {
        return `${hours} giờ trước`;
    } else if (minutes > 0) {
        return `${minutes} phút trước`;
    } else if (seconds > 0) {
        return `${seconds} giây trước`;
    }
    return 'Vừa mới';
};

/**
 * diffTimeV2
 * @param input string
 * @param format string
 */
const diffTimeV2 = (input?: string, format?: string) => {
    const now = moment();
    const inputFormat = format || 'YYYY-MM-DD HH:mm:ss';
    const inputTime = moment(input, inputFormat);

    const diffInMinutes = inputTime.diff(now, 'minutes');

    if (diffInMinutes > 0) {
        const hours = diffInMinutes / 60;
        const minutes = diffInMinutes % 60;

        return {
            hours,
            minutes,
        };
    } else {
        return {
            hours: 0,
            minutes: 0,
        };
    }
};

const checkEmptyValue = (values: string) => {
    if (values?.trim() === '' && values?.length > 0) {
        return t<string>('common:error_input');
    }
    return undefined;
};

const Helper = {
    makeMessage,
    formatNumber,
    removeNotDigit,
    apiErrorCodeMapping,
    compressImage,
    formatTimeInput,
    genUUID,
    calculatorDate,
    generateRandomString,
    removeSpaces,
    getRandomColor,
    openMap,
    diffTime,
    diffTimeV2,
    checkEmptyValue,
};

export default Helper;
