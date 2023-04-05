import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
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
  Pressable,
  Row,
} from 'native-base';
import Lottie from 'lottie-react-native';
import {TabView, SceneMap, NavigationState} from 'react-native-tab-view';
import TText from '../Transfer/TText';
import {axiosClient} from '../../components/apis/axiosClient';
import {formatCurrency} from '../../components/helper';
import {HistoryOrder} from '../../store/cart';
import CircleArrow from '../../assets/svg/circle-arrow.svg';
import {useNavigation} from '@react-navigation/native';
import {MainStackNavigation} from '../../stack/Navigation';

const FirstRoute = () => {
  const [history, setHistory] = useState<HistoryOrder>();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const navigation = useNavigation<MainStackNavigation>();

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getOrder();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  console.log('History order:', history);

  const getOrder = useCallback(async () => {
    const result = await axiosClient.get('order?page=1&limit=1000');
    setHistory(result.data?.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    setLoading(true);
    getOrder();
  }, []);
  return (
    <View style={{paddingHorizontal: 5, flex: 1, marginTop: 20}}>
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
          {history?.orders?.map(item => (
            <VStack key={item.id} marginY={3} padding={3} borderWidth={1}>
              <HStack justifyContent={'space-between'}>
                <VStack>
                  <Text fontSize={18} fontWeight={'bold'} color="#000000">
                    {item.store_name}
                  </Text>
                  <Text color={'#919191'}>Mã Đơn: {item.order_code}</Text>
                </VStack>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('MyDetailOrder', {id: item.id})
                  }>
                  <CircleArrow />
                </TouchableOpacity>
              </HStack>
              <HStack justifyContent={'space-between'}>
                <Text>Ngày đặt: {item.created_at}</Text>
                <Text>
                  Tổng: {formatCurrency((item?.order_total ?? 0).toString())}đ
                </Text>
              </HStack>
            </VStack>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const SecondRoute = () => {
  const [history, setHistory] = useState<HistoryOrder>();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const navigation = useNavigation<MainStackNavigation>();

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getOrder();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  // console.log('===>', history);
  console.log('History order:', history);

  const getOrder = useCallback(async () => {
    const result = await axiosClient.get(
      'order?page=1&limit=1000&status=taken',
    );
    setHistory(result.data?.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    setLoading(true);
    getOrder();
  }, []);
  return (
    <View style={{paddingHorizontal: 5, flex: 1, marginTop: 20}}>
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
          {history?.orders?.map(item => (
            <VStack key={item.id} marginY={3} padding={3} borderWidth={1}>
              <HStack justifyContent={'space-between'}>
                <VStack>
                  <Text fontSize={18} fontWeight={'bold'} color="#000000">
                    {item.store_name}
                  </Text>
                  <Text color={'#919191'}>Mã Đơn: {item.order_code}</Text>
                </VStack>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('MyDetailOrder', {id: item.id})
                  }>
                  <CircleArrow />
                </TouchableOpacity>
              </HStack>
              <HStack justifyContent={'space-between'}>
                <Text>Ngày đặt: {item.created_at}</Text>
                <Text>
                  Tổng: {formatCurrency((item?.order_total ?? 0).toString())}đ
                </Text>
              </HStack>
            </VStack>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute,
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
      borderRadius={4}
      backgroundColor={selected ? '#4285F4' : '#F1F2F6'}>
      <TText
        style={selected ? styles.tabTextSelected : styles.tabTextNotSelected}>
        {title}
      </TText>
    </Center>
  </Pressable>
);

const MyOrder = () => {
  const layout = useWindowDimensions();
  const [tabIndex, setTabIndex] = useState(0);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'first', title: 'Đang đặt'},
    {key: 'second', title: 'Đã đặt'},
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
  }, [tabIndex, routes]);

  const renderTabBar = useCallback(
    (props: {
      navigationState: NavigationState<{key: string; title: string}>;
    }) => {
      const routesData = props.navigationState.routes;
      return (
        <Row backgroundColor={'#F1F2F6'} borderRadius={4} mx={3}>
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
      <HeaderComp title="Lịch sử đơn hàng" />
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
        initialLayout={{width: layout.width}}
        style={{marginTop: 20}}
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

export default MyOrder;
