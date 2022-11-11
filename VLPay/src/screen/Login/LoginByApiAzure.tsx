import React from 'react';
import {StyleSheet, TouchableHighlight, Platform, View} from 'react-native';
import * as constants from '../../utils/constants';
import {authorize} from 'react-native-app-auth';
import {Image} from 'native-base';

const AuthConfig = {
  appId: constants.YOUR_CLIENT_ID_AZURE_PORTAL,
  tenantId: 'common',
  appScopes: ['openid', 'offline_access', 'profile', 'User.Read'],
};

const index = () => {
  const loginWithOffice365 = async () => {
    await authorize({
      clientId: AuthConfig.appId,
      redirectUrl:
        Platform.OS === 'ios'
          ? 'urn:ietf:wg:oauth:2.0:oob'
          : 'msauth://com.vlpay/VzSiQcXRmi2kyjzcA%2BmYLEtbGVs%3D',
      scopes: AuthConfig.appScopes,
      additionalParameters: {prompt: 'select_account'},
      serviceConfiguration: {
        authorizationEndpoint:
          'https://login.microsoftonline.com/' +
          AuthConfig.tenantId +
          '/oauth2/v2.0/authorize',
        tokenEndpoint:
          'https://login.microsoftonline.com/' +
          AuthConfig.tenantId +
          '/oauth2/v2.0/token',
      },
    });
  };
  return (
    <View>
      <TouchableHighlight
        style={[styles.buttonContainer, styles.loginButton]}
        onPress={() => loginWithOffice365()}>
        <Image
          source={require('../../assets/img/login_microsoft.jpg')}
          resizeMode={'stretch'}
          width={'100%'}
          height={50}
        />
      </TouchableHighlight>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DCDCDC',
  },
  buttonContainer: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
  },
  loginButton: {
    backgroundColor: '#3659b8',
  },
  loginText: {
    color: 'white',
  },
});

export default index;
