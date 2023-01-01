// import {t} from 'i18next';
import {HStack, Input, Pressable, VStack} from 'native-base';
import {IVStackProps} from 'native-base/lib/typescript/components/primitives/Stack/VStack';
import React, {useCallback, useState} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import IconMoney from '../../../assets/svg/thantai_cash_icon.svg';
import Colors from './Colors';
import StyleUtils from './StyleUtil';
import TText from './TText';
// import {escapeCurrency, formatCurrency} from '../../../helper';
// import Colors, {EColors} from '../../../helper/Colors';
// import {moderateScale} from '../../../helper/ScaleUtils';
// import StyleUtils from '../../../helper/StyleUtil';
export interface IWithDrawMenu {
  total: string;
  optionTitle: string;
  placeholder: string;
  balances: string[];
  value: string;
  maxCurrentWallet?: string;
  onChangeText: (arg0: string) => void;
  error?: any;
}

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

const WithDrawMenu = (props: IWithDrawMenu & IVStackProps) => {
  const [maxWallet, setMaxWallet] = useState('');
  const isSelectedValue = useCallback(
    (v: string) => {
      return escapeCurrency(v) === escapeCurrency(props.value);
    },
    [props.value],
  );

  const handleChangeInput = useCallback(
    (str: string) => {
      if (str.length === 0) {
        props.onChangeText('');
        return;
      }
      props.onChangeText(formatCurrency(escapeCurrency(str)));
    },
    [props],
  );
  return (
    <VStack {...props} space={4}>
      <TText style={styles.impressiveText}>{props.optionTitle}</TText>
      <Input
        borderRadius={8}
        backgroundColor={'white'}
        placeholder={props.placeholder}
        keyboardType="number-pad"
        value={props.value}
        onChangeText={handleChangeInput}
      />
      {props.error && <TText style={{color: 'red'}}>{props.error}</TText>}
      <HStack space={2}>
        {props.balances.map(v => (
          <Pressable
            padding={3}
            flex={1}
            borderRadius={8}
            key={v}
            backgroundColor={'white'}
            borderWidth={1}
            onPress={() => {
              handleChangeInput(v.toString());
            }}>
            <TText style={styles.centerText}>
              {formatCurrency(v.toString())}
            </TText>
          </Pressable>
        ))}
      </HStack>
    </VStack>
  );
};

const styles = {
  ...StyleUtils,
  ...StyleSheet.create({
    total: {
      fontSize: 17,
      fontWeight: '400',
      color: Colors.white,
    },
    cash: {
      fontSize: 17,
      fontWeight: '700',
      color: Colors.white,
    },
    placeHolder: {
      fontWeight: '700',
      color: Colors.primary,
    },
  }),
};

export default WithDrawMenu;
