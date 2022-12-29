import {FlatList, SafeAreaView, ScrollView, StyleSheet} from 'react-native';
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
  Image,
} from 'native-base';
import SearchIcon from '../../assets/svg/search.svg';
import HeaderDivider from '../Notification/HeaderDivider';
import {HISTORY_TRANSACTION_SAMPLE} from './mock';

const Index = () => {
  return (
    <SafeAreaView style={styles.container}>
      <HeaderComp title="Lịch sử giao dịch" />
      <View style={{paddingHorizontal: 15, flex: 1}}>
        <Center bg="white">
          <Input
            placeholder="Tìm giao dịch"
            fontFamily={'Poppins-Regular'}
            width="100%"
            borderRadius="4"
            borderColor={'#A2A2A6'}
            mt="21"
            mb="21"
            py="3"
            px="1"
            pl="2"
            fontSize="16"
            bgColor={'rgba(0, 0, 0, 0.06)'}
            autoFocus={false}
            // onChangeText={text => searchFilterFunction(text)}
            // value={search}
            InputLeftElement={
              <Icon ml="3" as={<SearchIcon color={'#000000'} />} />
            }
          />
        </Center>
        <ScrollView showsVerticalScrollIndicator={false}>
          {HISTORY_TRANSACTION_SAMPLE.map(item => {
            return (
              <View key={item.id}>
                <View style={styles.containerMonth}>
                  <Text style={styles.titleText}>{item.month}</Text>
                </View>
                {item.list_transaction.map(item => {
                  return (
                    <VStack py={5} key={item.id}>
                      <HStack justifyContent={'space-between'}>
                        <Text style={styles.text}>{item.description}</Text>
                        <Text style={styles.text}>{item.money}đ</Text>
                      </HStack>
                      <Text style={styles.textDate}>{item.date}</Text>
                    </VStack>
                  );
                })}
                <Divider my={5} bgColor={'black'} />
              </View>
            );
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    // paddingHorizontal: 15,
  },
  text: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#312E49',
  },
  textDate: {
    fontSize: 14,
    color: 'rgba(49, 46, 73, 0.5)',
    fontWeight: '600',
  },
  titleText: {
    fontFamily: 'Poppins-Bold',
    color: '#312E49',
    fontSize: 16,
  },
  containerMonth: {
    backgroundColor: '#C7CEEA4A',
    alignItems: 'center',
    padding: 20,
  },
});

export default Index;
