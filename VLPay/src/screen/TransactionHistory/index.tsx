import {ScrollView, StyleSheet} from 'react-native';
import React from 'react';
import HeaderComp from '../../components/HeaderComp';
import {
  Center,
  HStack,
  Icon,
  Input,
  VStack,
  Text,
  View,
  Divider,
} from 'native-base';
import SearchIcon from '../../assets/svg/search.svg';
import HeaderDivider from '../Notification/HeaderDivider';

const Index = () => {
  return (
    <View style={styles.bgColor}>
      <HeaderComp title="History" />
      <Center bg="white">
        <Input
          placeholder="Search..."
          fontFamily={'Poppins-Bold'}
          width="90%"
          borderRadius="4"
          borderColor={'#A2A2A6'}
          mt="21"
          mb="21"
          py="3"
          px="1"
          pl="2"
          fontSize="16"
          bgColor={'#C7CEEA'}
          autoFocus={false}
          // onChangeText={text => searchFilterFunction(text)}
          // value={search}
          InputLeftElement={<Icon m="2" ml="3" size="6" as={<SearchIcon />} />}
        />
      </Center>

      <ScrollView>
        <VStack space={4} alignItems="center" pt={5} pb={5}>
          <Center w="90%" h={'10'} bg="#C7CEEA" alignItems="center">
            <Text
              style={{
                fontFamily: 'Poppins-SemiBold',
                fontSize: 16,
                color: '#312E49',
              }}>
              Tháng 10/2022
            </Text>
          </Center>

          <Center w="90%" h="10" bg="#ffffff" alignItems="flex-start">
            <HStack justifyContent="space-between" w={'100%'} px="5">
              <Text style={styles.titleText}>Chuyển tiền tới Huu Loc</Text>
              <Text style={styles.titleText}>-1.000.000đ</Text>
            </HStack>
            <HStack justifyContent="space-between" w={'100%'} px="5">
              <Text style={styles.text}>09:14 - 06/10/2022</Text>
              <Text style={styles.text}>Thành công</Text>
            </HStack>
          </Center>

          <Center w="90%" h="10" bg="#ffffff" alignItems="flex-start">
            <HStack justifyContent="space-between" w={'100%'} px="5">
              <Text style={styles.titleText}>Nhận tiền từ Thanh Tuan</Text>
              <Text style={styles.titleText}>+1.000.000đ</Text>
            </HStack>
            <HStack justifyContent="space-between" w={'100%'} px="5">
              <Text style={styles.text}>09:12 - 06/10/2022</Text>
              <Text style={styles.text}>Thành công</Text>
            </HStack>
          </Center>

          <Center w="90%" h={'10'} bg="#C7CEEA" alignItems="center">
            <Text
              style={{
                fontFamily: 'Poppins-SemiBold',
                fontSize: 16,
                color: '#312E49',
              }}>
              Tháng 09/2022
            </Text>
          </Center>

          <Center w="90%" h="10" bg="#ffffff" alignItems="flex-start">
            <HStack justifyContent="space-between" w={'100%'} px="5">
              <Text style={styles.titleText}>Chuyển tiền tới Robert Lam</Text>
              <Text style={styles.titleText}>-10.000đ</Text>
            </HStack>
            <HStack justifyContent="space-between" w={'100%'} px="5">
              <Text style={styles.text}>11:14 - 11/09/2022</Text>
              <Text style={styles.text}>Thành công</Text>
            </HStack>
          </Center>

          <Center w="90%" h="10" bg="#ffffff" alignItems="flex-start">
            <HStack justifyContent="space-between" w={'100%'} px="5">
              <Text style={styles.titleText}>Nhận tiền từ Jenny</Text>
              <Text style={styles.titleText}>+100.000đ</Text>
            </HStack>
            <HStack justifyContent="space-between" w={'100%'} px="5">
              <Text style={styles.text}>06:12 - 20/09/2022</Text>
              <Text style={styles.text}>Thành công</Text>
            </HStack>
          </Center>

          <Center w="90%" h="10" bg="#ffffff" alignItems="flex-start">
            <HStack justifyContent="space-between" w={'100%'} px="5">
              <Text style={styles.titleText}>Thanh toán hóa đơn</Text>
              <Text style={styles.titleText}>-22.000.000đ</Text>
            </HStack>
            <HStack justifyContent="space-between" w={'100%'} px="5">
              <Text style={styles.text}>06:14 - 20/09/2022</Text>
              <Text style={styles.text}>Thành công</Text>
            </HStack>
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
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: '#808080',
  },
  titleText: {
    fontFamily: 'Poppins-Bold',
    color: '#312E49',
    fontSize: 16,
  },
});

export default Index;
