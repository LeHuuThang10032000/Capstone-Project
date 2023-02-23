import {
  ActivityIndicator,
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
import {useNavigation} from '@react-navigation/native';
import {MainStackNavigation} from '../../../../stack/Navigation';

const FirstRoute = () => {
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
      'https://zennoshop.cf/api/user/history-transaction?filter_key=days',
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

const SecondRoute = () => {
  const [history, setHistory] = useState([]);
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getMonths();
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

  const getMonths = useCallback(async () => {
    const result = await axiosClient.get(
      'https://zennoshop.cf/api/user/history-transaction?filter_key=months',
    );
    setHistory(result.data?.data?.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchData();
    getMonths();
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

const ThirdRoute = () => {
  const [history, setHistory] = useState([]);
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getYears();
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

  const getYears = useCallback(async () => {
    const result = await axiosClient.get(
      'https://zennoshop.cf/api/user/history-transaction?filter_key=years',
    );
    setHistory(result.data?.data?.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchData();
    getYears();
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
