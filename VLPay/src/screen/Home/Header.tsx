import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {MainStackNavigation} from '../../stack/Navigation';
// import SearchIcon from '../../assets/svg/search.svg';
import {SearchIcon} from 'native-base';
import {Image} from 'native-base';

type Props = {};

const Header = (props: Props) => {
  const navigation = useNavigation<MainStackNavigation>();
  return (
    <View style={styles.wrapperButton}>
      <TouchableOpacity
        style={styles.searchBtn}
        onPress={() => navigation.navigate('Search')}>
        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
          }}>
          <Text style={styles.text}>Tìm kiếm...</Text>
          <SearchIcon />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  searchBtn: {
    height: 40,
    width: '90%',
    margin: 12,
    padding: 10,
    borderRadius: 50,
    paddingHorizontal: 20,
    backgroundColor: '#FEFDFE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  wrapperButton: {
    backgroundColor: '#FEB7B1',
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    fontFamily: 'Poppins-Regular',
  },
});

export default Header;
