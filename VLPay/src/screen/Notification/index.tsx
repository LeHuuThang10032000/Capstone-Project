import {
  Center,
  Container,
  Divider,
  Heading,
  HStack,
  ScrollView,
  Text,
  View,
  VStack,
} from 'native-base';
import React from 'react';
import {StyleSheet} from 'react-native';
import HeaderComp from '../../components/HeaderComp';
import HeaderDivider from './HeaderDivider';

type Props = {};

const Index = (props: Props) => {
  return (
    <View style={styles.bgColor}>
      <HeaderComp title="Notification" />
      <HeaderDivider />
      <ScrollView>
        <VStack space={4} alignItems="center" pt={5} pb={5}>
          <Center
            w="90%"
            h="20"
            bg="#C7CEEA"
            rounded="md"
            shadow={3}
            alignItems="flex-start">
            <HStack justifyContent="space-between" w={'100%'} px="5">
              <Text style={styles.text}>VLPay</Text>
              <Text>Thứ 2, 16/10</Text>
            </HStack>
            <View px="5">
              <Text style={styles.titleText}>Get 35.000đ from BICH THUY</Text>
            </View>
          </Center>

          <Center
            w="90%"
            h="20"
            bg="#C7CEEA"
            rounded="md"
            shadow={3}
            alignItems="flex-start">
            <HStack justifyContent="space-between" w={'100%'} px="5">
              <Text style={styles.text}>VLPay</Text>
              <Text>Thứ 2, 16/10</Text>
            </HStack>
            <View px="5">
              <Text style={styles.titleText}>Get 35.000đ from BICH THUY</Text>
            </View>
          </Center>

          <Center
            w="90%"
            h="20"
            bg="#C7CEEA"
            rounded="md"
            shadow={3}
            alignItems="flex-start">
            <HStack justifyContent="space-between" w={'100%'} px="5">
              <Text style={styles.text}>VLPay</Text>
              <Text>Thứ 2, 16/10</Text>
            </HStack>
            <View px="5">
              <Text style={styles.titleText}>Get 35.000đ from BICH THUY</Text>
            </View>
          </Center>

          <Center
            w="90%"
            h="20"
            bg="#C7CEEA"
            rounded="md"
            shadow={3}
            alignItems="flex-start">
            <HStack justifyContent="space-between" w={'100%'} px="5">
              <Text style={styles.text}>VLPay</Text>
              <Text>Thứ 2, 16/10</Text>
            </HStack>
            <View px="5">
              <Text style={styles.titleText}>Get 35.000đ from BICH THUY</Text>
            </View>
          </Center>

          <Center
            w="90%"
            h="20"
            bg="#C7CEEA"
            rounded="md"
            shadow={3}
            alignItems="flex-start">
            <HStack justifyContent="space-between" w={'100%'} px="5">
              <Text style={styles.text}>VLPay</Text>
              <Text>Thứ 2, 16/10</Text>
            </HStack>
            <View px="5">
              <Text style={styles.titleText}>Get 35.000đ from BICH THUY</Text>
            </View>
          </Center>

          <Center
            w="90%"
            h="20"
            bg="#C7CEEA"
            rounded="md"
            shadow={3}
            alignItems="flex-start">
            <HStack justifyContent="space-between" w={'100%'} px="5">
              <Text style={styles.text}>VLPay</Text>
              <Text>Thứ 2, 16/10</Text>
            </HStack>
            <View px="5">
              <Text style={styles.titleText}>Get 35.000đ from BICH THUY</Text>
            </View>
          </Center>

          <Center
            w="90%"
            h="20"
            bg="#C7CEEA"
            rounded="md"
            shadow={3}
            alignItems="flex-start">
            <HStack justifyContent="space-between" w={'100%'} px="5">
              <Text style={styles.text}>VLPay</Text>
              <Text>Thứ 2, 16/10</Text>
            </HStack>
            <View px="5">
              <Text style={styles.titleText}>Get 35.000đ from BICH THUY</Text>
            </View>
          </Center>
        </VStack>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  bgColor: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  text: {
    fontFamily: 'Poppins-Light',
  },
  titleText: {
    fontFamily: 'Poppins-Bold',
    color: '#312E49',
  },
});

export default Index;
