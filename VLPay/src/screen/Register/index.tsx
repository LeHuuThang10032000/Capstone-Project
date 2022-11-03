import React, {useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import {UText, Utitle} from '../../components/UText';
import LockIcon from '../../assets/svg/lock.svg';
import MailIcon from '../../assets/svg/mail.svg';
import BlindIcon from '../../assets/svg/blind_icon.svg';
import EyeIcon from '../../assets/svg/eye_icon.svg';
import styles from './styles';
import LinearGradient from 'react-native-linear-gradient';
import GenderIcon from '../../assets/svg/gender_icon.svg';
import PersonIcon from '../../assets/svg/person_icon.svg';

const Index = function () {
  const [hide, setHide] = useState(true);
  return (
    <LinearGradient
      colors={['#FEB7B1', '#FFFFFF']}
      style={styles.linearGradient}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Utitle style={styles.headerItem}>Register</Utitle>
        </View>
        <View>
          <Utitle style={{fontSize: 18}}>Full name</Utitle>
          <View style={styles.itemField}>
            <PersonIcon width={20} height={20} />
            <TextInput placeholder="Full name" style={styles.textInput} />
          </View>
        </View>
        <View>
          <Utitle style={{fontSize: 18}}>E-mail</Utitle>
          <View style={styles.itemField}>
            <MailIcon width={20} height={20} />
            <TextInput placeholder="Email" style={styles.textInput} />
          </View>
        </View>
        <View>
          <Utitle style={{fontSize: 18}}>Gender</Utitle>
          <View style={styles.itemField}>
            <GenderIcon width={20} height={20} />
            <TextInput placeholder="Female" style={styles.textInput} />
          </View>
        </View>
        <View>
          <Utitle style={{fontSize: 18}}>Password</Utitle>
          <View style={styles.itemField}>
            <LockIcon />
            <TextInput
              placeholder="Password"
              style={styles.textInput}
              secureTextEntry={hide}
            />
            <TouchableOpacity
              style={styles.passwordIcon}
              onPress={() => {
                setHide(!hide);
              }}>
              {hide ? <BlindIcon /> : <EyeIcon />}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.buttonInput}>
          <UText style={styles.textButtonInput}>Register</UText>
        </View>
      </View>
      <View style={styles.footer}>
        <UText>Don't have an account?</UText>
        <UText style={{color: '#2805FF'}}> Login</UText>
      </View>
    </LinearGradient>
  );
};

export default Index;
