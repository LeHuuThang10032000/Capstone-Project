import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import HeaderBack from '../../../../components/HeaderBack';
import {axiosClient} from '../../../../components/apis/axiosClient';
import {Center, HStack, Image, Pressable, View, VStack} from 'native-base';
import Clock from '../../../../assets/svg/clock.svg';
import ExtendIcon from '../../../../assets/svg/extend.svg';
import Phone from '../../../../assets/svg/phone.svg';

const DetailShop = ({route}: any) => {
  const {name, image, cover_photo} = route.params;
  console.log(cover_photo);

  return (
    <View flex={1} backgroundColor="#FFFFFF">
      <HeaderBack
        title="Thông tin quán"
        onPressRight={true}
        onPress={() => console.log('hellow')}
      />
      <Image
        source={{uri: image}}
        width={'100%'}
        height={'30%'}
        alt="image-store"
        resizeMode="cover"
        zIndex="-999"
      />
      <Center>
        {cover_photo !== null ? (
          <Image
            source={{uri: image}}
            width={100}
            height={100}
            borderRadius={50}
            alt="image-store"
            resizeMode="cover"
            position={'absolute'}
          />
        ) : (
          <Image
            source={require('../../../../assets/img/iconShop.png')}
            width={100}
            height={100}
            borderRadius={50}
            alt="image-store"
            resizeMode="cover"
            position={'absolute'}
          />
        )}
      </Center>
      <Center>
        <View style={{paddingTop: 60}} justifyContent="center">
          <Text style={styles.text}>{name}</Text>
        </View>
        <TouchableOpacity style={styles.button}>
          <HStack>
            <Clock />
            <VStack pl={3}>
              <Text style={styles.textButton}>Thời gian hoạt động</Text>
              <Text
                style={[styles.textButton, {color: '#7A7A7A', fontSize: 14}]}>
                Thời gian giao hàng
              </Text>
              <Text>Hàng ngày 7:00 - 22:00</Text>
            </VStack>
          </HStack>
          <Center>
            <ExtendIcon />
          </Center>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, {paddingTop: 20}]}>
          <HStack>
            <Phone />
            <VStack pl={3}>
              <Text style={styles.textButton}>Liên hệ</Text>
              <Text
                style={[styles.textButton, {color: '#7A7A7A', fontSize: 14}]}>
                +24 328323
              </Text>
              <Text>Bahaiauco@gmail.com</Text>
            </VStack>
          </HStack>
        </TouchableOpacity>
      </Center>
    </View>
  );
};

export default DetailShop;

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    color: '#312E49',
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 50,
  },
  imagePromo: {
    width: 32,
    height: 32,
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
  //   text: {
  //     fontFamily: 'Poppins-Regular',
  //     color: '#312E49',
  //     fontSize: 16,
  //     fontWeight: '600',
  //   },
  textButton: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#312E49',
  },
});
