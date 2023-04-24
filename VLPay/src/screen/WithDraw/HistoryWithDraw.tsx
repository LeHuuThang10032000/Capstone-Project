import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import HeaderBack from '../../components/HeaderBack';
import {axiosClient} from '../../components/apis/axiosClient';
import {Center, HStack, ScrollView, VStack} from 'native-base';
import {formatCurrency} from '../../components/helper';
import Lottie from 'lottie-react-native';
import moment from 'moment';

type Props = {};

const HistoryWithDraw = (props: Props) => {
  const [history, setHistory] = useState([]);
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getDays();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  // console.log('===>', history);
  console.log('MyID:', profile);

  const fetchData = useCallback(async () => {
    const result = await axiosClient.get(
      'https://zennoshop.cf/api/user/get-profile',
    );
    setProfile(result.data?.data?.id);
  }, []);

  const getDays = useCallback(async () => {
    const result = await axiosClient.get(
      'https://zennoshop.cf/api/user/withdraw-history?filter_key=days',
    );
    setHistory(result.data?.data?.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchData();
    getDays();
  }, []);
  return (
    <View style={{flex: 1}}>
      <HeaderBack title="Lịch sử rút tiền" />
      {loading ? (
        <Center>
          <Lottie
            source={require('../../assets/lottie-file/loading.json')}
            autoPlay={true}
            style={{width: 100, height: 100}}
          />
        </Center>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          {history.map((item: any, index: any) => {
            return (
              <View key={index}>
                <View style={styles.containerMonth}>
                  <Text style={styles.titleText}>
                    {moment(item.date).format('DD/MM/YYYY')}
                  </Text>
                </View>
                {item.data.map((item: any) => {
                  return (
                    <HStack
                      backgroundColor="#FFFFFF"
                      p={3}
                      key={item.id}
                      justifyContent="space-between">
                      <VStack>
                        <Text
                          style={styles.title}
                          ellipsizeMode="tail"
                          numberOfLines={1}>
                          {item.status === 'pending'
                            ? 'Đang xử lý'
                            : 'Đã duyệt'}
                        </Text>
                        <Text style={styles.textDate}>
                          {moment(item.created_at).format(
                            'HH:mm [-] DD/MM/YYYY',
                          )}
                        </Text>
                      </VStack>
                      <Text style={styles.text}>
                        -{formatCurrency(`${item.amount}`)}đ
                      </Text>
                    </HStack>
                  );
                })}
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};

export default HistoryWithDraw;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    // paddingHorizontal: 15,
  },
  title: {
    width: 250,
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#312E49',
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
  tabTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  tabTextNotSelected: {
    color: '#333',
    fontWeight: '700',
  },
});
