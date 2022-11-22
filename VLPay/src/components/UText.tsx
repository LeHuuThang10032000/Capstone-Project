import React from 'react';
import {Text, TextProps} from 'react-native';

export const UText = ({children, style, ...props}: TextProps) => {
  return (
    <Text
      style={[
        {fontFamily: 'Poppins-Regular', fontSize: 16, color: '#000000'},
        style,
      ]}
      {...props}>
      {children}
    </Text>
  );
};

export const Utitle = ({children, style, ...props}: TextProps) => {
  return (
    <Text
      style={[
        {
          fontFamily: 'Poppins-Regular',
          fontSize: 16,
          color: '#312E49',
          fontWeight: '600',
        },
        style,
      ]}
      {...props}>
      {children}
    </Text>
  );
};
