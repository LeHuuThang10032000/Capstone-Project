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
import {MainStackNavigation} from '../../stack/Navigation';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import moment from 'moment';

const FirstRoute = () => {
  const [history, setHistory] = useState([]);
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [error, setError] = useState(false);

  const navigation = useNavigation<MainStackNavigation>();

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getDays();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  console.log('Error ===>', error);
  // console.log('MyID:', profile);

  const fetchData = useCallback(async () => {
    const result = await axiosClient.get(
      'https://zennoshop.cf/api/user/get-profile',
    );
    setProfile(result.data?.data?.id);
  }, []);

  const getDays = useCallback(async () => {
    setLoading(true);
    const result = await axiosClient.get(
      'https://zennoshop.cf/api/user/history-transaction?filter_key=days',
    );
    setHistory(result.data?.data?.data);
    console.log('Status code:', result.status);
    if (result.data?.data === null) {
      setError(true);
    }
    setLoading(false);
  }, []);

  // useEffect(() => {
  //   fetchData();
  //   getDays();
  // }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
      getDays();
    }, []),
  );
  return (
    <View style={{flex: 1, marginTop: 20}}>
      {loading && (
        <Center>
          <Lottie
            source={require('../../assets/lottie-file/loading.json')}
            autoPlay={true}
            style={{width: 100, height: 100}}
          />
        </Center>
      )}
      {!loading && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          {history.map((item: any, index: any) => {
            return (
              <View key={index}>
                <View px={3} style={styles.containerMonth}>
                  <Text style={styles.titleText}>
                    {moment(item.date).format('DD/MM/YYYY')}
                  </Text>
                </View>
                {item.data.map((item: any) => {
                  return (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() => {
                        console.log(item?.type);

                        if (item?.type === 'O') {
                          navigation.navigate('ShareBill', {
                            data: item,
                          });
                        } else {
                          navigation.navigate('DetailTransaction', {
                            title: item.title,
                            amount: item.amount,
                            code: item.code,
                            created_at: item.created_at,
                            type: item.type,
                            qr_code: item.qr_code,
                          });
                        }
                      }}>
                      <HStack
                        my={3}
                        mx={3}
                        key={item.id}
                        justifyContent="space-between">
                        <VStack>
                          <Text
                            style={styles.title}
                            ellipsizeMode="tail"
                            numberOfLines={1}>
                            {item.title}
                          </Text>
                          <Text style={styles.textDate}>
                            {moment(item.created_at).format(
                              'HH:mm [-] DD/MM/YYYY',
                            )}
                          </Text>
                        </VStack>
                        {item.from_id !== profile ? (
                          <Text style={styles.text}>
                            {formatCurrency(`${item.amount}`)}đ
                          </Text>
                        ) : (
                          <Text style={styles.text}>
                            -{formatCurrency(`${item.amount}`)}đ
                          </Text>
                        )}
                      </HStack>
                    </TouchableOpacity>
                  );
                })}
              </View>
            );
          })}
        </ScrollView>
      )}
      {error && (
        <Center>
          <Text>Không có giao dịch nào.</Text>
        </Center>
      )}
      {/* {loading ? (
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
                <View px={3} style={styles.containerMonth}>
                  <Text style={styles.titleText}>
                    {moment(item.date).format('DD/MM/YYYY')}
                  </Text>
                </View>
                {item.data.map((item: any) => {
                  return (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() => {
                        console.log(item?.type);

                        if (item?.type === 'O') {
                          navigation.navigate('ShareBill', {
                            data: item,
                          });
                        } else {
                          navigation.navigate('DetailTransaction', {
                            title: item.title,
                            amount: item.amount,
                            code: item.code,
                            created_at: item.created_at,
                          });
                        }
                      }}>
                      <HStack
                        my={3}
                        mx={3}
                        key={item.id}
                        justifyContent="space-between">
                        <VStack>
                          <Text
                            style={styles.title}
                            ellipsizeMode="tail"
                            numberOfLines={1}>
                            {item.title}
                          </Text>
                          <Text style={styles.textDate}>
                            {moment(item.created_at).format(
                              'HH:mm [-] DD/MM/YYYY',
                            )}
                          </Text>
                        </VStack>
                        {item.from_id !== profile ? (
                          <Text style={styles.text}>
                            {formatCurrency(`${item.amount}`)}đ
                          </Text>
                        ) : (
                          <Text style={styles.text}>
                            -{formatCurrency(`${item.amount}`)}đ
                          </Text>
                        )}
                      </HStack>
                    </TouchableOpacity>
                  );
                })}
              </View>
            );
          })}
        </ScrollView>
      )} */}
    </View>
  );
};

const SecondRoute = () => {
  const [history, setHistory] = useState([]);
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const navigation = useNavigation<MainStackNavigation>();

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
    setLoading(true);
    const result = await axiosClient.get(
      'https://zennoshop.cf/api/user/history-transaction?filter_key=months',
    );
    setHistory(result.data?.data?.data);
    setLoading(false);
  }, []);

  // useEffect(() => {
  //   fetchData();
  //   getMonths();
  // }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
      getMonths();
    }, []),
  );
  return (
    <View style={{flex: 1, marginTop: 20}}>
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
                <View px={3} style={styles.containerMonth}>
                  {/* <Text style={styles.titleText}>{item.date}</Text> */}
                  <Text style={styles.titleText}>
                    {moment(item.date).format('[Tháng] MM/YYYY')}
                  </Text>
                </View>
                {item.data.map((item: any) => {
                  return (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() => {
                        console.log(item?.type);

                        if (item?.type === 'O') {
                          navigation.navigate('ShareBill', {
                            data: item,
                          });
                        } else {
                          navigation.navigate('DetailTransaction', {
                            title: item.title,
                            amount: item.amount,
                            code: item.code,
                            created_at: item.created_at,
                          });
                        }
                      }}>
                      <HStack
                        my={3}
                        mx={3}
                        key={item.id}
                        justifyContent="space-between">
                        <VStack>
                          <Text
                            ellipsizeMode="tail"
                            numberOfLines={1}
                            style={styles.title}>
                            {item.title}
                          </Text>
                          <Text style={styles.textDate}>
                            {moment(item.created_at).format(
                              'HH:mm [-] DD/MM/YYYY',
                            )}
                          </Text>
                        </VStack>
                        {item.from_id !== profile ? (
                          <Text style={styles.text}>
                            {formatCurrency(`${item.amount}`)}đ
                          </Text>
                        ) : (
                          <Text style={styles.text}>
                            -{formatCurrency(`${item.amount}`)}đ
                          </Text>
                        )}
                      </HStack>
                    </TouchableOpacity>
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
  const navigation = useNavigation<MainStackNavigation>();

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
    try {
      const result = await axiosClient.get(
        'https://zennoshop.cf/api/user/get-profile',
      );
      setProfile(result.data?.data?.id);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getYears = useCallback(async () => {
    setLoading(true);
    try {
      const result = await axiosClient.get(
        'https://zennoshop.cf/api/user/history-transaction?filter_key=years',
      );
      setHistory(result.data?.data?.data);
      setLoading(false);
    } catch (error) {
      console.log('error', error);
    }
  }, []);

  // useEffect(() => {
  //   fetchData();
  //   getYears();
  // }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
      getYears();
    }, []),
  );

  return (
    <View style={{flex: 1, marginTop: 20}}>
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
                <View px={3} style={styles.containerMonth}>
                  <Text style={styles.titleText}>
                    {' '}
                    {moment(item.date).format('[Năm] YYYY')}
                  </Text>
                </View>
                {item.data.map((item: any) => {
                  return (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() => {
                        console.log(item?.type);

                        if (item?.type === 'O') {
                          navigation.navigate('ShareBill', {
                            data: item,
                          });
                        } else {
                          navigation.navigate('DetailTransaction', {
                            title: item.title,
                            amount: item.amount,
                            code: item.code,
                            created_at: item.created_at,
                          });
                        }
                      }}>
                      <HStack my={3} mx={3} justifyContent="space-between">
                        <VStack>
                          <Text
                            ellipsizeMode="tail"
                            numberOfLines={1}
                            style={styles.title}>
                            {item.title}
                          </Text>
                          <Text style={styles.textDate}>
                            {moment(item.created_at).format(
                              'HH:mm [-] DD/MM/YYYY',
                            )}
                          </Text>
                        </VStack>
                        {item.from_id !== profile ? (
                          <Text style={styles.text}>
                            {formatCurrency(`${item.amount}`)}đ
                          </Text>
                        ) : (
                          <Text style={styles.text}>
                            -{formatCurrency(`${item.amount}`)}đ
                          </Text>
                        )}
                      </HStack>
                    </TouchableOpacity>
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
    fontSize: 14,
    color: '#312E49',
  },
  text: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: '#312E49',
  },
  textDate: {
    fontSize: 12,
    color: 'rgba(49, 46, 73, 0.5)',
    fontWeight: '600',
  },
  titleText: {
    fontFamily: 'Poppins-Bold',
    color: '#312E49',
    fontSize: 16,
  },
  containerMonth: {
    backgroundColor: '#F1F2F6',
    alignItems: 'flex-start',
    padding: 15,
    borderColor: '#99A3A4',
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
