import {View, Text, Image, StyleSheet, ScrollView} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {MainStackNavigation} from '../../stack/Navigation';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import HeaderComp from '../../components/HeaderComp';
import {TouchableOpacity} from 'react-native-gesture-handler';
import ExtendIcon from '../../assets/svg/extend.svg';
import QRcodeIcon from '../../assets/svg/qrcode.svg';
import LogoIcon from '../../assets/svg/logoIcon.svg';
import WalletIcon from '../../assets/svg/wallet.svg';
import PersonIcon from '../../assets/svg/person_icon.svg';
import SettingIcon from '../../assets/svg/settings.svg';
import PrivacyIcon from '../../assets/svg/privacy.svg';
import SupportIcon from '../../assets/svg/support.svg';
import ShopIcon from '../../assets/svg/shop.svg';
import LogoutIcon from '../../assets/svg/logout.svg';
import ModalProvider from '../../context/ModalProvider';
import Modal from 'react-native-modal';
import HeaderModal from '../../components/CustomLogout/HeaderModal';
import BodyModal from '../../components/CustomLogout/BodyModal';
import {useDispatch} from 'react-redux';
import {Logout} from '../../redux/actions/authAction';
import RNRestart from 'react-native-restart';
import {axiosClient} from '../../components/apis/axiosClient';
const Index = () => {
  const navigation = useNavigation<MainStackNavigation>();
  const {modalVisible, toggleModal, closeModal} = ModalProvider();
  const dispatch = useDispatch();

  const [profile, setProfile] = useState({});

  const fetchData = useCallback(async () => {
    const result = await axiosClient.get(
      'https://zennoshop.cf/api/user/get-profile',
    );
    setProfile(result);
  }, []);
  const isFocused = useIsFocused();

  useEffect(() => {
    // Call only when screen open or when back on screen
    if (isFocused) {
      fetchData();
    }
  }, [fetchData, isFocused]);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <HeaderComp title="Ví của tôi" />
      <View style={{marginHorizontal: 20, marginVertical: 20}}>
        <View style={styles.wrapperButton}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('ProfileUser')}>
            <View style={styles.info}>
              {profile?.data?.data?.media[0]?.original_url ? (
                <Image
                  source={{uri: profile.data.data.media[0].original_url}}
                  style={styles.image}
                />
              ) : (
                <Image
                  source={require('../../assets/img/user_default.png')}
                  style={styles.image}
                />
              )}
              <View style={{paddingLeft: 10}}>
                <Text style={styles.text}>{profile?.data?.data?.f_name}</Text>
                <Text style={styles.text}>{profile.data?.data?.phone}</Text>
              </View>
            </View>
            <View>
              <ExtendIcon />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{marginHorizontal: 20, marginVertical: 10}}>
        <Text style={{marginVertical: 3, fontFamily: 'Poppins-Regular'}}>
          Ví của tôi
        </Text>
        <View style={styles.wrapperButton}>
          <TouchableOpacity style={styles.button}>
            <View style={styles.info}>
              <WalletIcon style={{paddingLeft: 30}} />
              <View style={{paddingLeft: 10, justifyContent: 'center'}}>
                <Text style={styles.text}>Ví</Text>
              </View>
            </View>
            <View>
              <ExtendIcon />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{marginHorizontal: 20, marginVertical: 10}}>
        <Text style={{marginVertical: 3, fontFamily: 'Poppins-Regular'}}>
          Xã hội của tôi
        </Text>
        <View style={styles.wrapperButton}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Friends')}>
            <View style={styles.info}>
              <PersonIcon height={15} width={15} style={{paddingLeft: 30}} />
              <View style={{paddingLeft: 10, justifyContent: 'center'}}>
                <Text style={styles.text}>Bạn bè</Text>
              </View>
            </View>
            <View>
              <ExtendIcon />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{marginHorizontal: 20, marginVertical: 20}}>
        <View style={styles.wrapperButton}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Settings')}>
            <View style={styles.info}>
              <SettingIcon style={{paddingLeft: 30}} />
              <View style={{paddingLeft: 10, justifyContent: 'center'}}>
                <Text style={styles.text}>Cài đặt</Text>
              </View>
            </View>
            <View>
              <ExtendIcon />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <View style={styles.info}>
              <PrivacyIcon style={{paddingLeft: 30}} />
              <View style={{paddingLeft: 10, justifyContent: 'center'}}>
                <Text style={styles.text}>Riêng tư</Text>
              </View>
            </View>
            <View>
              <ExtendIcon />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Support')}>
            <View style={styles.info}>
              <SupportIcon style={{paddingLeft: 30}} />
              <View style={{paddingLeft: 10, justifyContent: 'center'}}>
                <Text style={styles.text}>Hỗ trợ sinh viên</Text>
              </View>
            </View>
            <View>
              <ExtendIcon />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('ApproveMerc')}
            style={styles.button}>
            <View style={styles.info}>
              <ShopIcon style={{paddingLeft: 30}} />
              <View style={{paddingLeft: 10, justifyContent: 'center'}}>
                <Text style={styles.text}>Cửa hàng</Text>
              </View>
            </View>
            <View>
              <ExtendIcon />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{marginHorizontal: 20, marginVertical: 10}}>
        <View style={styles.wrapperButton}>
          <TouchableOpacity style={styles.button} onPress={toggleModal}>
            <View style={styles.info}>
              <LogoutIcon height={15} width={15} style={{paddingLeft: 30}} />
              <View style={{paddingLeft: 10, justifyContent: 'center'}}>
                <Text style={styles.text}>Đăng xuất</Text>
              </View>
            </View>
            <View>
              <ExtendIcon />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        isVisible={modalVisible}
        animationIn="slideInUp"
        animationOut="fadeOutDown"
        style={{margin: 0, justifyContent: 'center', alignItems: 'center'}}>
        <View
          style={{
            height: 230,
            backgroundColor: '#FFFFFF',
            borderRadius: 15,
          }}>
          <HeaderModal title="Đăng xuất" onPress={closeModal} />
          <BodyModal
            cancel="cancel"
            confirm="confirm"
            onPressCancel={closeModal}
            onPressConfirm={async () => {
              RNRestart.Restart();
              dispatch(await Logout());
            }}
          />
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 35,
    height: 35,
    borderRadius: 50,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    paddingHorizontal: 25,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
  },
  wrapperButton: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  text: {
    fontFamily: 'Poppins-Regular',
    color: '#000000',
  },
});

export default Index;
