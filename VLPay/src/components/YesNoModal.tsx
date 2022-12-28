import React from 'react';
import {View, Modal, StyleSheet} from 'react-native';
import {moderateScale} from '../../android/app/src/helper/ScaleUtils';
import strings from './helpers/Strings';
import NormalButton from './NormalButton';
import {UText} from './UText';

type Props = {
  visible: boolean;
  style?: any;
  title?: string;
  titleStyle?: any;
  message: string;
  btnTextLeft?: string;
  btnTextRight?: string;
  btnRightStyle?: any;
  btnLeftStyle?: any;
  btnLeftTextStyle?: any;
  icon?: any;
  onActionLeft: () => void;
  onActionRight: () => void;
  hideLeft?: boolean;
  hideRight?: boolean;
};

/**
 * YesNoModal
 */
const YesNoModal: React.FC<Props> = ({
  visible,
  style,
  title,
  message,
  btnTextLeft = strings.cancel,
  btnTextRight = strings.confirm,
  icon,
  titleStyle,
  btnRightStyle,
  btnLeftStyle,
  onActionLeft,
  onActionRight,
  btnLeftTextStyle,
  hideLeft = false,
  hideRight = false,
}) => {
  return (
    <Modal animationType="fade" transparent visible={visible}>
      <View style={styles.viewModal}>
        <View style={styles.overlay} />
        <View style={[styles.contentModal, style]}>
          {icon}
          {title && (
            <UText style={[styles.txtTitle, titleStyle]}>{title}</UText>
          )}
          <UText style={styles.messageTxt}>{message}</UText>
          <View style={[styles.containerBtn, style]}>
            {!hideLeft && (
              <NormalButton
                title={btnTextLeft}
                buttonStyle={[
                  styles.buttonContainer,
                  styles.colorCancel,
                  btnLeftStyle,
                ]}
                titleStyle={[styles.titleStyle, btnLeftTextStyle]}
                onPress={onActionLeft}
              />
            )}
            {!hideRight && (
              <NormalButton
                title={btnTextRight}
                buttonStyle={[styles.buttonContainer, btnRightStyle]}
                titleStyle={styles.titleStyle}
                onPress={onActionRight}
              />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  viewModal: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#C4C4C4',
    opacity: 0.8,
    zIndex: 0,
  },
  contentModal: {
    backgroundColor: 'white',
    borderRadius: 15,
    paddingVertical: 20,
    alignItems: 'center',
    shadowColor: 'gray',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#E9E9E9',
    width: '90%',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  txtTitle: {
    fontSize: moderateScale(18),
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 20,
    paddingHorizontal: 16,
    fontFamily: 'Lora',
  },
  txtAction: {
    color: 'blue',
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    lineHeight: 20,
    textAlign: 'center',
    fontFamily: 'Lora',
  },
  viewTitle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageTxt: {
    textAlign: 'center',
    paddingHorizontal: 16,
    fontSize: moderateScale(16),
    fontFamily: 'Lora',
    fontWeight: '700',
    marginTop: 30,
    marginBottom: 10,
  },
  iconClose: {
    position: 'absolute',
    top: 18,
    right: 18,
    padding: 6,
  },
  buttonStyle: {
    padding: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: '#3EDE4E',
    alignItems: 'center',
    alignSelf: 'center',
    height: 42,
    flex: 1,
  },
  containerBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginTop: 16,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 15,
    width: 130,
  },
  colorCancel: {
    backgroundColor: '#979797',
  },
  titleStyle: {
    color: 'white',
    textTransform: 'capitalize',
    fontFamily: 'Lora',
    fontSize: moderateScale(14),
  },
});

export default YesNoModal;
