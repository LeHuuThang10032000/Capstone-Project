import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {UText} from '../UText';

type Props = {
  cancel: string;
  confirm: string;
  onPressCancel: () => void;
  onPressConfirm: () => void;
};

const BodyModal: React.FC<Props> = ({
  cancel,
  confirm,
  onPressCancel,
  onPressConfirm,
}) => {
  return (
    <View style={{paddingHorizontal: 20}}>
      <View style={{marginVertical: 20}}>
        <UText>Are you sure want to log out?</UText>
      </View>
      <View style={styles.containerBtn}>
        {cancel && (
          <TouchableOpacity onPress={onPressCancel} style={styles.buttonCancel}>
            <UText>Cancel</UText>
          </TouchableOpacity>
        )}
        <View style={{paddingHorizontal: 5}}></View>
        {confirm && (
          <TouchableOpacity
            onPress={onPressConfirm}
            style={styles.buttonConfirm}>
            <UText>Confirm</UText>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    marginTop: 20,
  },
  buttonCancel: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FEB7B1',
    height: 40,
    width: '48%',
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  buttonConfirm: {
    backgroundColor: '#FEB7B1',
    height: 40,
    width: '48%',
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
});

export default BodyModal;
