import React, {useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import {UText, Utitle} from '../../components/UText';
import LockIcon from '../../assets/svg/lock.svg';
import MailIcon from '../../assets/svg/mail.svg';
import styles from './styles';
import LinearGradient from 'react-native-linear-gradient';
import CheckBox from '@react-native-community/checkbox';

const Index = function () {
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [hide, setHide] = useState(true);
  return (
    <LinearGradient
      colors={['#FEB7B1', '#FFFFFF']}
      style={styles.linearGradient}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Utitle style={styles.headerItem}>Login</Utitle>
        </View>
        <View>
          <Utitle style={{fontSize: 18}}>E-mail</Utitle>
          <View style={styles.itemField}>
            <MailIcon width={20} height={20} />
            <TextInput placeholder="Email" style={styles.textInput} />
          </View>
        </View>
        <View>
          <Utitle style={{fontSize: 18}}>Password</Utitle>
          <View style={styles.itemField}>
            <LockIcon />
            <TextInput
              placeholder="Password"
              secureTextEntry={hide}
              style={styles.textInput}
            />
          </View>
        </View>
        <View style={styles.itemContainer}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <CheckBox
              disabled={false}
              value={toggleCheckBox}
              onValueChange={newValue => setToggleCheckBox(newValue)}
            />
            <UText>Remember Me</UText>
          </View>
          <TouchableOpacity>
            <UText style={styles.textButtonOpacity}>Forgot Password?</UText>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonInput}>
          <UText style={styles.textButtonInput}>Login</UText>
        </View>
      </View>
      <View style={styles.footer}>
        <UText>Don't have an account?</UText>
        <UText style={{color: '#2805FF'}}> Signup</UText>
      </View>
    </LinearGradient>
  );
};

export default Index;
