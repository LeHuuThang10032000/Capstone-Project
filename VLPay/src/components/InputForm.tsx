import {HStack, Input} from 'native-base';
import React from 'react';
import {StyleSheet, View} from 'react-native';

type props = {
  LeftIcon?: any;
  RightIcon?: any;
  placeholder?: string;
  secureTextEntry?: boolean;
  style?: any;
};
const Index = (props: props) => {
  const inputLength = () => {};
  return (
    <HStack style={styles.inputWrapper} alignItems={'center'}>
      {props.LeftIcon && props.LeftIcon}
      <Input
        {...props.style}
        placeholder={props.placeholder}
        variant={'unstyled'}
        w="90%"
        secureTextEntry={props.secureTextEntry}
      />
      {props.RightIcon && props.RightIcon}
    </HStack>
  );
};

const styles = StyleSheet.create({
  leftIcon: {
    position: 'absolute',
    left: '3%',
    zIndex: 1,
    top: '35%',
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: '#A2A2A6',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 10,
    marginBottom: 12,
    backgroundColor: '#ffffff',
  },
});

export default Index;
