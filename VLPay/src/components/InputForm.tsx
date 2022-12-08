import {Flex, HStack} from 'native-base';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Input, InputProps} from '@rneui/themed';
export interface FormInputProps extends InputProps {
  placeholder?: string;
  secureTextEntry?: boolean;
  style?: any;
  onChangeText?: any;
  value?: any;
}

const Index = ({
  placeholder,
  secureTextEntry,
  style,
  onChangeText,
  value,
  ...rest
}: FormInputProps) => {
  return (
    <Input
      {...style}
      placeholder={placeholder}
      onChangeText={onChangeText}
      inputContainerStyle={{
        borderBottomWidth: 0,
        borderWidth: 1,
        borderColor: '#A2A2A6',
        backgroundColor: '#ffffff',
        borderRadius: 4,
        paddingHorizontal: 12,
      }}
      value={value}
      secureTextEntry={secureTextEntry}
      {...rest}
    />
  );
};

const styles = StyleSheet.create({
  leftIcon: {
    position: 'absolute',
    left: '3%',
    zIndex: 1,
    top: '35%',
  },
});

export default Index;
