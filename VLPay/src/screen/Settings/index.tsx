import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import HeaderBack from '../../components/HeaderBack';
import MyButton from './MyButton';
import UnlockIcon from '../../assets/svg/unlock.svg';
import ChevronRight from '../../assets/svg/chevron-right.svg';
import ChevronDown from '../../assets/svg/chevron-down.svg';
import EarthIcon from '../../assets/svg/earth.svg';
import ModalProvider from '../../context/ModalProvider';
import Modal from 'react-native-modal';
import HeaderModal from '../../components/CustomLogout/HeaderModal';
import BodyModal from './ChangeLngComp/BodyModal';

type Props = {};

const Index = (props: Props) => {
  const {modalVisible, setModalVisible, closeModal} = ModalProvider();
  const toggleModal = () => {
    setModalVisible(true);
  };
  return (
    <View>
      <HeaderBack title="Setting" />
      <View style={{marginTop: 30}}>
        <MyButton
          icon={<UnlockIcon />}
          buttonText="Change password"
          rightIcon={<ChevronRight />}
          rightText={undefined}
          onPress={() => console.log('change pass')}></MyButton>

        <MyButton
          icon={<EarthIcon />}
          buttonText="Select language"
          rightIcon={<ChevronDown />}
          rightText={'English'}
          onPress={toggleModal}></MyButton>

        <Modal
          isVisible={modalVisible}
          animationIn="slideInUp"
          animationOut="fadeOutDown"
          style={{
            margin: 0,
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}>
          <View
            style={{
              height: 230,
              backgroundColor: '#FFFFFF',
              borderTopLeftRadius: 15,
              borderTopRightRadius: 15,
              width: '100%',
            }}>
            <HeaderModal title="Select language" onPress={closeModal} />
            <BodyModal />
          </View>
        </Modal>
      </View>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({});
