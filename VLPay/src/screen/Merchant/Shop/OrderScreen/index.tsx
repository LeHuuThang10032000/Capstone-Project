import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import HeaderComp from '../../../../components/HeaderComp';
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
  Pressable,
  Row,
} from 'native-base';
import Lottie from 'lottie-react-native';
import {TabView, SceneMap, NavigationState} from 'react-native-tab-view';
import {axiosClient} from '../../../../components/apis/axiosClient';
import {formatCurrency} from '../../../../components/helpers/formatNum';
import TText from '../../../Transfer/TText';
import HeaderBack from '../../../../components/HeaderBack';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {MainStackNavigation} from '../../../../stack/Navigation';
import {baseUrl} from '../../../../components/apis/baseUrl';
import {UText} from '../../../../components/UText';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import 'moment/locale/vi'; // Import the Vietnamese
interface Order {
  id: number;
  order_code: string;
  created_at: string;
  user_id: number;
  order_total: number;
}

interface Orders {
  orders: Order[];
  total_size: number;
  limit: string;
  page: string;
}

const FirstRoute = () => {
  const navigation = useNavigation<MainStackNavigation>();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [page, setPage] = useState<number>(1);
  const [storeId, setStoreId] = useState(null);
  const [order, setOrder] = useState<Orders>();
  const [history, setHistory] = useState([]);
  const isFocused = useIsFocused();

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getOrders();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, [storeId]);

  const getStore = useCallback(async () => {
    const date = new Date(); // Create a new date object with the current date and time
    const isoString = date.toISOString(); // Convert the date to an ISO-formatted string
    const formattedDate = isoString.slice(0, 10); // Extract the first 10 characters of the string (YYYY-MM-DD)
    const result = await axiosClient.get(
      'https://zennoshop.cf/api/user/merchant/store',
    );
    setStoreId(result?.data?.data?.id);
  }, []);

  const getOrders = useCallback(async () => {
    const result = await axiosClient.get(
      `merchant/order?limit=100&page=1&store_id=${storeId}&status=pending`,
    );
    const data = result?.data?.data;
    setOrder(data);
  }, [storeId]);

  useEffect(() => {
    getStore();
    if (isFocused) {
      getOrders();
    }
  }, [getStore, getOrders, isFocused]);

  return (
    <View style={{paddingHorizontal: 15, flex: 1, marginTop: 20}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {order ? (
          order?.orders?.map(item => (
            <>
              <TouchableOpacity
                onPress={() => {
                  item.store_id = storeId;
                  item.detail = false;
                  navigation.navigate('OrderDetailScreen', {
                    data: item,
                  });
                }}>
                <HStack
                  py={3}
                  alignItems={'center'}
                  justifyContent="space-between">
                  <VStack>
                    <Text fontWeight={'bold'} color="#4285F4">
                      #{item.order_code}
                    </Text>
                    <Text color="#818181">{item.created_at}</Text>
                    <Text fontWeight={'bold'}>{item.id}</Text>
                  </VStack>
                  <Text fontWeight={'bold'} color="#818181">
                    {formatCurrency(`${item.order_total}`)}đ
                  </Text>
                </HStack>
              </TouchableOpacity>
              <Divider />
            </>
          ))
        ) : (
          <Center>
            <Text>Không có đơn hàng nào</Text>
          </Center>
        )}
      </ScrollView>
    </View>
  );
};

const SecondRoute = () => {
  const navigation = useNavigation<MainStackNavigation>();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [page, setPage] = useState<number>(1);
  const [storeId, setStoreId] = useState(null);
  const [order, setOrder] = useState<Orders>();
  const [history, setHistory] = useState([]);
  const isFocused = useIsFocused();

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getOrders();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, [storeId]);

  const getStore = useCallback(async () => {
    const date = new Date(); // Create a new date object with the current date and time
    const isoString = date.toISOString(); // Convert the date to an ISO-formatted string
    const formattedDate = isoString.slice(0, 10); // Extract the first 10 characters of the string (YYYY-MM-DD)
    const result = await axiosClient.get(
      'https://zennoshop.cf/api/user/merchant/store',
    );
    setStoreId(result?.data?.data?.id);
  }, []);

  const getOrders = useCallback(async () => {
    const result = await axiosClient.get(
      `merchant/order?limit=100&page=1&store_id=${storeId}&status=processing`,
    );
    const data = result?.data?.data;
    setOrder(data);
  }, [storeId]);

  useEffect(() => {
    getStore();
    if (isFocused) {
      getOrders();
    }
  }, [getStore, getOrders, isFocused]);

  return (
    <View style={{paddingHorizontal: 15, flex: 1, marginTop: 20}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {order ? (
          order?.orders?.map(item => (
            <>
              <TouchableOpacity
                onPress={() => {
                  item.store_id = storeId;
                  item.detail = false;
                  navigation.navigate('OrderDetailScreen', {
                    data: item,
                  });
                }}>
                <HStack
                  py={3}
                  alignItems={'center'}
                  justifyContent="space-between">
                  <VStack>
                    <Text fontWeight={'bold'} color="#4285F4">
                      #{item.order_code}
                    </Text>
                    <Text color="#818181">{item.created_at}</Text>
                    <Text fontWeight={'bold'}>{item.id}</Text>
                  </VStack>
                  <Text fontWeight={'bold'} color="#818181">
                    {formatCurrency(`${item.order_total}`)}đ
                  </Text>
                </HStack>
              </TouchableOpacity>
              <Divider />
            </>
          ))
        ) : (
          <Center>
            <Text>Không có đơn hàng nào</Text>
          </Center>
        )}
      </ScrollView>
    </View>
  );
};

const ThirdRoute = () => {
  const navigation = useNavigation<MainStackNavigation>();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [page, setPage] = useState<number>(1);
  const [storeId, setStoreId] = useState(null);
  const [order, setOrder] = useState<Orders>();
  const [history, setHistory] = useState([]);
  const isFocused = useIsFocused();

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getOrders();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, [storeId]);

  const getStore = useCallback(async () => {
    const date = new Date(); // Create a new date object with the current date and time
    const isoString = date.toISOString(); // Convert the date to an ISO-formatted string
    const formattedDate = isoString.slice(0, 10); // Extract the first 10 characters of the string (YYYY-MM-DD)
    const result = await axiosClient.get(
      'https://zennoshop.cf/api/user/merchant/store',
    );
    setStoreId(result?.data?.data?.id);
  }, []);

  const getOrders = useCallback(async () => {
    const result = await axiosClient.get(
      `merchant/order?limit=100&page=1&store_id=${storeId}&status=finished`,
    );
    const data = result?.data?.data;
    setOrder(data);
  }, [storeId]);

  useEffect(() => {
    getStore();
    if (isFocused) {
      getOrders();
    }
  }, [getStore, getOrders, isFocused]);

  return (
    <View style={{paddingHorizontal: 15, flex: 1, marginTop: 20}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {order ? (
          order?.orders?.map(item => (
            <>
              <TouchableOpacity
                onPress={() => {
                  item.store_id = storeId;
                  item.detail = false;
                  navigation.navigate('OrderDetailScreen', {
                    data: item,
                  });
                }}>
                <HStack
                  py={3}
                  alignItems={'center'}
                  justifyContent="space-between">
                  <VStack>
                    <Text fontWeight={'bold'} color="#4285F4">
                      #{item.order_code}
                    </Text>
                    <Text color="#818181">{item.created_at}</Text>
                    <Text fontWeight={'bold'}>{item.id}</Text>
                  </VStack>
                  <Text fontWeight={'bold'} color="#818181">
                    {formatCurrency(`${item.order_total}`)}đ
                  </Text>
                </HStack>
              </TouchableOpacity>
              <Divider />
            </>
          ))
        ) : (
          <Center>
            <Text>Không có đơn hàng nào</Text>
          </Center>
        )}
      </ScrollView>
    </View>
  );
};

const FourthRoute = () => {
  const navigation = useNavigation<MainStackNavigation>();
  const [refreshing, setRefreshing] = React.useState(false);
  const [date, setDate] = useState(new Date());
  const [dateStr, setDateStr] = useState(new Date().toISOString().slice(0, 10));
  const [open, setOpen] = useState(false);
  const [storeId, setStoreId] = useState(0);
  const [historyTaken, setHistoryTaken] = useState([]);
  const [historyCanceled, setHistoryCanceled] = useState([]);
  const [order, setOrder] = useState([]);
  const [history, setHistory] = useState([]);
  moment.locale('vi'); // Set the locale to Vietnamese

  const _formattedDate = moment(date).format('LL');
  const getStore = useCallback(async () => {
    const date = new Date(); // Create a new date object with the current date and time
    const isoString = date.toISOString(); // Convert the date to an ISO-formatted string
    const formattedDate = isoString.slice(0, 10); // Extract the first 10 characters of the string (YYYY-MM-DD)
    const result = await axiosClient.get(
      'https://zennoshop.cf/api/user/merchant/store',
    );
    const _history = await axiosClient.get(
      baseUrl +
        'merchant/history-order?page=1&limit=10&store_id=' +
        result?.data?.data?.id +
        '&date=' +
        formattedDate,
    );
    setOrder(_history?.data?.data);
    setHistoryCanceled(_history?.data?.data?.total_canceled_orders);
    setHistoryTaken(_history?.data?.data?.total_taken_order);
    setHistory(_history?.data?.data?.orders);
    setStoreId(result?.data?.data?.id);
  }, []);

  useEffect(() => {
    getStore();
  }, [getStore]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  return (
    <View style={{flex: 1, marginTop: 20}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <VStack>
          <UText style={{alignSelf: 'center'}}>Chọn ngày</UText>
          <TouchableOpacity onPress={() => setOpen(true)}>
            <UText
              style={{
                alignSelf: 'center',
                fontWeight: '700',
                borderWidth: 0.5,
                borderRadius: 10,
                paddingHorizontal: 10,
              }}>
              {_formattedDate}
            </UText>
          </TouchableOpacity>
          <DatePicker
            modal
            open={open}
            date={date}
            onConfirm={async _date => {
              const time = _date.toISOString().slice(0, 10);

              const _history = await axiosClient.get(
                baseUrl +
                  'merchant/history-order?page=1&limit=10&store_id=' +
                  storeId +
                  '&date=' +
                  time,
              );

              setHistoryCanceled(_history?.data?.data?.total_canceled_orders);
              setHistoryTaken(_history?.data?.data?.total_taken_order);
              setHistory(_history?.data?.data?.orders);
              setDate(_date);
              setOpen(false);
            }}
            onCancel={() => {
              setOpen(false);
            }}
          />
          <ScrollView>
            <VStack
              alignItems={'center'}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 20,
                borderColor: 'rgba(0, 0, 0, 0.13)',
                borderWidth: 1,
                marginTop: 10,
              }}>
              <UText
                style={{color: '#FEB7B1', fontWeight: '700', fontSize: 25}}>
                {(order?.total_revenue ?? 0).toLocaleString()}đ
              </UText>
              <UText style={{fontWeight: '700'}}>Tổng doanh thu</UText>
              <UText style={{textAlign: 'center', color: '#8A8A8A'}}>
                Đây là doanh thu trước khi được điều {'\n'}chỉnh và khấu trừ
              </UText>
            </VStack>
            <VStack>
              <View
                style={{
                  borderColor: 'rgba(0, 0, 0, 0.13)',
                  borderWidth: 1,
                  marginTop: 20,
                }}>
                <HStack
                  justifyContent={'space-between'}
                  style={{paddingHorizontal: 16, paddingVertical: 10}}>
                  <VStack alignItems={'center'}>
                    <UText style={{fontWeight: '700'}}>
                      {historyTaken ?? 0}
                    </UText>
                    <UText>Đơn hàng hoàn tất</UText>
                  </VStack>
                  <VStack alignItems={'center'}>
                    <UText style={{fontWeight: '700'}}>
                      {historyCanceled ?? 0}
                    </UText>
                    <UText>Đơn đã huỷ</UText>
                  </VStack>
                </HStack>
              </View>
              <VStack style={{paddingHorizontal: 16, marginTop: 10}}>
                <UText
                  style={{fontWeight: '700', marginBottom: 10, fontSize: 20}}>
                  ĐƠN HÀNG
                </UText>
                {history.map(item => {
                  return (
                    <HStack
                      alignItems={'center'}
                      justifyContent={'space-between'}>
                      <VStack>
                        <UText style={{fontWeight: '700'}}>
                          #{item.order_code}
                        </UText>
                        <UText>
                          Đã {item?.status === 'taken' ? 'hoàn tất' : 'huỷ'}{' '}
                          {item?.created_at.split(' ')[1]}
                        </UText>
                      </VStack>
                      <HStack>
                        <UText>
                          {(item?.order_total ?? 0).toLocaleString()}đ
                        </UText>
                        <View style={{width: 20}} />
                        <TouchableOpacity
                          onPress={() => {
                            item.store_id = storeId;
                            item.detail = true;
                            navigation.navigate('OrderDetailScreen', {
                              data: item,
                            });
                          }}>
                          <UText>{'>'}</UText>
                        </TouchableOpacity>
                      </HStack>
                    </HStack>
                  );
                })}
              </VStack>
            </VStack>
          </ScrollView>
        </VStack>
      </ScrollView>
    </View>
  );
};

const renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute,
  third: ThirdRoute,
  fourth: FourthRoute,
});

const TabButton = ({
  title,
  selected,
  index,
  onPress,
}: {
  title: string;
  selected: boolean;
  index: number;
  onPress: (index: number) => void;
}) => (
  <Pressable
    flex={1}
    onPress={() => {
      onPress(index);
    }}>
    <Center
      padding={2}
      borderBottomWidth={3}
      borderBottomColor={selected ? '#4285F4' : '#F1F2F6'}>
      <TText
        style={selected ? styles.tabTextSelected : styles.tabTextNotSelected}>
        {title}
      </TText>
    </Center>
  </Pressable>
);

const Index = () => {
  const navigation = useNavigation<MainStackNavigation>();
  const layout = useWindowDimensions();
  const [tabIndex, setTabIndex] = useState(0);
  const [index, setIndex] = useState(0);
  const [statusState, setStatusState] = useState('');
  const [routes] = useState([
    {key: 'first', title: 'Đơn mới'},
    {key: 'second', title: 'Đang làm'},
    {key: 'third', title: 'Chờ lấy'},
    {key: 'fourth', title: 'Lịch sử'},
  ]);

  useEffect(() => {
    if (routes[tabIndex].key === 'first') {
      setIndex(0);
      return;
    }
    if (routes[tabIndex].key === 'second') {
      setIndex(1);
      return;
    }
    if (routes[tabIndex].key === 'third') {
      setIndex(2);
      return;
    }
    if (routes[tabIndex].key === 'fourth') {
      setIndex(3);
      return;
    }
  }, [tabIndex, routes]);

  const renderTabBar = useCallback(
    (props: {
      navigationState: NavigationState<{key: string; title: string}>;
    }) => {
      const routesData = props.navigationState.routes;
      return (
        <Row backgroundColor={'#FFFFFF'} borderRadius={4}>
          {routesData.map((v, i) => {
            return (
              <TabButton
                title={v.title}
                selected={props.navigationState.index === i}
                index={i}
                onPress={setTabIndex}
                key={i}
              />
            );
          })}
        </Row>
      );
    },
    [],
  );

  const fetchData = async () => {
    try {
      const result = await axiosClient.get('/merchant/store');
      setStatusState(
        result?.data?.data?.status !== 'closing' ? 'true' : 'false',
      );
    } catch (error) {}
  };

  useEffect(() => {
    fetchData();
  }, []);

  const isFocused = useIsFocused();
  useEffect(() => {
    // Call only when screen open or when back on screen
    if (isFocused) {
      setStatusState('');
      fetchData();
    }
  }, [isFocused]);

  return (
    <SafeAreaView style={styles.container}>
      <HeaderBack
        title="Quán trà sữa"
        hideRight={true}
        statusValue={statusState}
      />
      <ImageBackground
        source={require('../../../../assets/img/banner.png')}
        resizeMode="cover"
        style={{justifyContent: 'center', height: 150}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            marginHorizontal: 20,
          }}>
          <View style={styles.wrapperButton}>
            <TouchableOpacity onPress={() => navigation.navigate('QR')}>
              <View style={styles.buttonTranfer}>
                <Image
                  source={require('../../../../assets/img/QRmerchant.png')}
                  style={{width: 52, height: 52}}
                  alt={'just image'}
                />
              </View>
            </TouchableOpacity>
            <Text style={styles.textButton}>MÃ QR</Text>
          </View>
        </View>
      </ImageBackground>
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
        initialLayout={{width: layout.width}}
      />
    </SafeAreaView>
  );
};

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
  textButton: {
    color: '#ffffff',
    fontWeight: 'bold',
    paddingTop: 5,
    fontFamily: 'Poppins-Regular',
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
    color: '#4285F4',
    fontWeight: '700',
  },
  tabTextNotSelected: {
    color: '#333',
    fontWeight: '700',
  },
  button: {
    backgroundColor: '#ffffff',
    width: 52,
    height: 52,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  buttonTranfer: {
    width: 52,
    height: 52,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  wrapperButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Index;
