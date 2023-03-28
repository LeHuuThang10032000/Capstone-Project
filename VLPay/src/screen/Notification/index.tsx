import {useNavigation} from '@react-navigation/native';
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
import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {axiosClient} from '../../components/apis/axiosClient';
import HeaderComp from '../../components/HeaderComp';
import {MainStackNavigation} from '../../stack/Navigation';
import HeaderDivider from './HeaderDivider';

type Props = {};

const Index = (props: Props) => {
  const [data, setData] = useState([]);
  const navigation = useNavigation<MainStackNavigation>();

  const fetchData = useCallback(async () => {
    setInterval(async () => {
      const result = await axiosClient.get(
        'https://zennoshop.cf/api/user/notification',
      );
      setData(result.data.data);
    }, 1000);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.bgColor}>
      <HeaderComp title="Thông báo" TrashIcon />
      <HeaderDivider />
      <ScrollView backgroundColor={'red'} width={'100%'}>
        <FlatList
          data={data}
          renderItem={({item}: any) => {
            // console.log(item);

            return (
              <View marginX={3} marginBottom={3}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('NotiShareBill')}>
                  <View
                    p={3}
                    w={'100%'}
                    borderRadius={10}
                    backgroundColor="#C7CEEA"
                    justifyContent={'center'}>
                    <VStack justifyContent="space-between">
                      <Text style={styles.text}>
                        {item.title} ({item.tag_model})
                      </Text>
                      <Text>{item.created_at}</Text>
                      <Text style={styles.titleText}>{item.body}</Text>
                    </VStack>
                  </View>
                </TouchableOpacity>
              </View>
            );
          }}
        />
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
