import * as React from 'react';
import {StyleSheet, Text, TextProps} from 'react-native';

/**
 * TText
 * @returns JSX.Element
 */
const TText = (props: TextProps): JSX.Element => {
  return (
    <Text
      {...props}
      allowFontScaling={false}
      style={StyleSheet.flatten([styles.text, props.style])}
      adjustsFontSizeToFit={false}>
      {props.children}
    </Text>
  );
};

export default React.memo(TText);

const styles = StyleSheet.create({
  text: {
    fontFamily: 'MyriadPro',
    color: '#000000',
  },
});
