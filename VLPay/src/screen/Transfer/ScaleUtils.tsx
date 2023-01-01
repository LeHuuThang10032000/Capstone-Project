import {Dimensions} from 'react-native';
const {width, height} = Dimensions.get('window');

//https://medium.com/soluto-engineering/size-matters-5aeeb462900a
//Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;
export const windowWidth = Dimensions.get('window').width;
export const windowHeight = Dimensions.get('window').height;

export const ASPECT_RATIO = windowWidth / windowHeight;
const scale = (size: number) => (width / guidelineBaseWidth) * size;
const verticalScale = (size: number) => (height / guidelineBaseHeight) * size;
const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;

function wp(percentage: number) {
  const value = (percentage * windowWidth) / 100;
  return Math.round(value);
}
const slideWidth = wp(85);
export const itemHorizontalMargin = wp(1);
export const itemWidth = slideWidth + itemHorizontalMargin * 2;

export {scale, verticalScale, moderateScale};
