import {View, Text} from 'react-native';
import React, {useContext, useState, useCallback} from 'react';
import CustomSwitch from './CustomSwitch';
// import {saveLng} from '../../../utils/storeUtils';
// import {t} from 'i18next';
// import RNRestart from 'react-native-restart';
// import {AuthUserContext} from '../../../context/AuthUserProvider';
import {locale, localeNumber} from '../../../utils/constants';

type Props = {};

const BodyModal = (props: Props) => {
  // const authContext = useContext(AuthUserContext);
  const onSelectSwitch = async (val: any) => {
    let valueLg = locale.en;
    // if (localeNumber[authContext?.lng] === val) {
    //   return;
    // }

    if (val === 1) {
      valueLg = locale.vi;
    }
    // await saveLng(valueLg);
  };
  const handleConfirm = useCallback((value: any) => {
    // RNRestart.Restart();
    console.log('confirm language');
  }, []);
  return (
    <View>
      <CustomSwitch
        selectionMode={localeNumber}
        option1={'Vietnamese'}
        option2={'English'}
        onSelectSwitch={onSelectSwitch}
        onPress={handleConfirm}
      />
    </View>
  );
};

export default BodyModal;
