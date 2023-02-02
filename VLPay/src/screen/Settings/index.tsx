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
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {MainStackNavigation, MainStackParamList} from '../../stack/Navigation';

type Props = {};

const Index = (props: Props) => {
  const {phone} =
    useRoute<RouteProp<MainStackParamList, 'ChangePassword'>>()?.params;
  console.log(phone);

  const navigation = useNavigation<MainStackNavigation>();
  const {modalVisible, setModalVisible, closeModal} = ModalProvider();
  const toggleModal = () => {
    setModalVisible(true);
  };
  return (
    <View>
      <HeaderBack title="Cài đặt" />
      <View style={{marginTop: 30}}>
        <MyButton
          icon={<UnlockIcon />}
          buttonText="Thay đổi mật khẩu"
          rightIcon={<ChevronRight />}
          rightText={undefined}
          onPress={() => {
            navigation.navigate('ChangePassword', {
              phone: phone,
            });
          }}></MyButton>

        <MyButton
          icon={<EarthIcon />}
          buttonText="Chọn ngôn ngữ"
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
