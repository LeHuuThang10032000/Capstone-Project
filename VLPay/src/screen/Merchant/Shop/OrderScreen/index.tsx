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
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [page, setPage] = useState<number>(1);
  const [storeId, setStoreId] = useState(null);
  const [order, setOrder] = useState<Orders>();
  const isFocused = useIsFocused();

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getOrders();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, [storeId]);

  console.log('store ID:', storeId);
  console.log('Order LIst:', order);

  const getStore = useCallback(async () => {
    const result = await axiosClient.get(
      'https://zennoshop.cf/api/user/merchant/store',
    );
    setStoreId(result?.data?.data?.id);
  }, []);

  const getOrders = useCallback(async () => {
    const result = await axiosClient.get(
      `/merchant/order?limit=100&page=1&store_id=${storeId}&status=pending`,
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
              <Divider />
            </>
          ))
        ) : (
          <Center>Không có đơn hàng nào</Center>
        )}
      </ScrollView>
    </View>
  );
};

const SecondRoute = () => {
  const [history, setHistory] = useState([]);
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <View style={{paddingHorizontal: 15, flex: 1, marginTop: 20}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        // refreshControl={
        //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        // }
      >
        <Center>Không có đơn hàng nào</Center>
      </ScrollView>
    </View>
  );
};

const ThirdRoute = () => {
  const [history, setHistory] = useState([]);
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <View style={{paddingHorizontal: 15, flex: 1, marginTop: 20}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <Center>Không có đơn hàng nào</Center>
      </ScrollView>
    </View>
  );
};

const FourthRoute = () => {
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  return (
    <View style={{paddingHorizontal: 15, flex: 1, marginTop: 20}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <Center>Không có đơn hàng nào</Center>
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

  return (
    <SafeAreaView style={styles.container}>
      <HeaderBack title="Quán trà sữa" hideRight={true} />
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
            <TouchableOpacity onPress={() => console.log('nothing')}>
              <View style={styles.buttonTranfer}>
                <Image
                  source={require('../../../../assets/img/withdrawMerchant.png')}
                  style={{width: 52, height: 52}}
                  alt={'just image'}
                />
              </View>
            </TouchableOpacity>
            <Text style={styles.textButton}>RÚT TIỀN</Text>
          </View>

          <View style={styles.wrapperButton}>
            <TouchableOpacity onPress={() => navigation.navigate('QR')}>
              <View style={styles.button}>
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
