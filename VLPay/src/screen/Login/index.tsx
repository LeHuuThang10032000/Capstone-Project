import React, {useCallback, useState} from 'react';
import {Button, TouchableOpacity, View} from 'react-native';
import {UText, Utitle} from '../../components/UText';
import LockIcon from '../../assets/svg/lock.svg';
import MailIcon from '../../assets/svg/mail.svg';
import styles from './styles';
import LinearGradient from 'react-native-linear-gradient';
import CheckBox from '@react-native-community/checkbox';
import BlindIcon from '../../assets/svg/blind_icon.svg';
import EyeIcon from '../../assets/svg/eye_icon.svg';
import {Flex, HStack, Image, VStack} from 'native-base';
import strings from '../../components/helpers/Strings';
import Input from '../../components/InputForm';
import LoginByAzure from './LoginByApiAzure';

const Index = function () {
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [hide, setHide] = useState(true);

  return (
    <LinearGradient
      colors={['#FEB7B1', '#FFFFFF']}
      style={styles.linearGradient}>
      <VStack>
        <View style={styles.header}>
          <Utitle style={styles.headerItem}>{strings.login}</Utitle>
        </View>
        <View>
          <Utitle style={{fontSize: 18}}>{strings.email}</Utitle>
          <Input
            LeftIcon={<MailIcon width={20} height={20} />}
            placeholder={strings.email_placeholder}
            style={styles.textInput}
          />
        </View>
        <View>
          <Utitle style={{fontSize: 18}}>Password</Utitle>
          <Input
            LeftIcon={<LockIcon width={20} height={20} />}
            placeholder={strings.password_placeholder}
            style={styles.textInput}
            secureTextEntry={hide}
            RightIcon={
              <TouchableOpacity
                style={styles.passwordIcon}
                onPress={() => {
                  setHide(!hide);
                }}>
                {hide ? <BlindIcon /> : <EyeIcon />}
              </TouchableOpacity>
            }
          />
        </View>
        <HStack alignItems={'center'} justifyContent={'space-between'}>
          <HStack alignItems={'center'}>
            <CheckBox
              disabled={false}
              value={toggleCheckBox}
              onValueChange={newValue => setToggleCheckBox(newValue)}
            />
            <UText>{strings.rememberMe}</UText>
          </HStack>
          <TouchableOpacity>
            <UText style={styles.textButtonOpacity}>
              {strings.forgotPassword}
            </UText>
          </TouchableOpacity>
        </HStack>
        <Flex style={styles.buttonInput}>
          <UText style={styles.textButtonInput}>{strings.login}</UText>
        </Flex>
        <Flex>
          <UText style={styles.textButtonInput}>
            {strings.loginByMicrosoft}
          </UText>

          <LoginByAzure />
        </Flex>
      </VStack>
    </LinearGradient>
  );
};

export default Index;
