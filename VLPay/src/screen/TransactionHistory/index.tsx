import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
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
                  <Text style={styles.titleText}>{item.date}</Text>
                </View>
                {item.data.map((item: any) => {
                  return (
                    <HStack p={3} key={item.id} justifyContent="space-between">
                      <VStack>
                        {item.from_id === profile ? (
                          <Text style={styles.text}>Chuyển tiền đến ...</Text>
                        ) : (
                          <Text style={styles.text}>Nhận tiền từ ...</Text>
                        )}
                        <Text style={styles.textDate}>{item.created_at}</Text>
                      </VStack>
                      {item.from_id !== profile ? (
                        <Text style={styles.text}>
                          +{formatCurrency(`${item.amount}`)}đ
                        </Text>
                      ) : (
                        <Text style={styles.text}>
                          -{formatCurrency(`${item.amount}`)}đ
                        </Text>
                      )}
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
                  <Text style={styles.titleText}>{item.date}</Text>
                </View>
                {item.data.map((item: any) => {
                  return (
                    <HStack p={3} key={item.id} justifyContent="space-between">
                      <VStack>
                        {item.from_id === profile ? (
                          <Text style={styles.text}>Chuyển tiền đến ...</Text>
                        ) : (
                          <Text style={styles.text}>Nhận tiền từ ...</Text>
                        )}
                        <Text style={styles.textDate}>{item.created_at}</Text>
                      </VStack>
                      {item.from_id !== profile ? (
                        <Text style={styles.text}>
                          +{formatCurrency(`${item.amount}`)}đ
                        </Text>
                      ) : (
                        <Text style={styles.text}>
                          -{formatCurrency(`${item.amount}`)}đ
                        </Text>
                      )}
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
                  <Text style={styles.titleText}>{item.date}</Text>
                </View>
                {item.data.map((item: any) => {
                  return (
                    <HStack p={3} key={item.id} justifyContent="space-between">
                      <VStack>
                        {item.from_id === profile ? (
                          <Text style={styles.text}>Chuyển tiền đến ...</Text>
                        ) : (
                          <Text style={styles.text}>Nhận tiền từ ...</Text>
                        )}
                        <Text style={styles.textDate}>{item.created_at}</Text>
                      </VStack>
                      {item.from_id !== profile ? (
                        <Text style={styles.text}>
                          +{formatCurrency(`${item.amount}`)}đ
                        </Text>
                      ) : (
                        <Text style={styles.text}>
                          -{formatCurrency(`${item.amount}`)}đ
                        </Text>
                      )}
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

const renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute,
  third: ThirdRoute,
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

const Index = () => {
  const layout = useWindowDimensions();
  const [tabIndex, setTabIndex] = useState(0);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'first', title: 'Ngày'},
    {key: 'second', title: 'Tháng'},
    {key: 'third', title: 'Năm'},
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
  }, [tabIndex, routes]);

  const renderTabBar = useCallback(
    (props: {
      navigationState: NavigationState<{key: string; title: string}>;
    }) => {
      const routesData = props.navigationState.routes;
      return (
        <Row backgroundColor={'#F1F2F6'} mx={'10'} borderRadius={4} p={1}>
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
      <HeaderComp title="Lịch sử giao dịch" />
      {/* <View style={{paddingHorizontal: 15, flex: 1}}>
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
      </View> */}
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

export default Index;
