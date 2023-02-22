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
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { axiosClient } from '../../components/apis/axiosClient';
import HeaderComp from '../../components/HeaderComp';
import HeaderDivider from './HeaderDivider';

type Props = {};

const Index = (props: Props) => {

  const [data, setData] = useState([]);

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
      <HeaderComp title="Thông báo" />
      <HeaderDivider />
      <ScrollView backgroundColor={'red'} width={'100%'}>

        <FlatList
          data={data}
          renderItem={({ item }: any) => {
            // console.log(item);

            return (
              <Center
                w="90%"
                bg="#C7CEEA"
                rounded="md"
                shadow={3}
                alignItems="flex-start">
                <View paddingY={5}>
                  <HStack justifyContent="space-between" w={'100%'} px="5">
                    <View>
                      <Text style={styles.text}>{item.title} ({item.tag_model})</Text>
                      <Text>{item.created_at}</Text>
                    </View>
                  </HStack>
                  <View px="5">
                    <Text style={styles.titleText}>{item.body}</Text>
                  </View>
                </View>
              </Center>
            )
          }}
        />
      </ScrollView>
    </View >
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
