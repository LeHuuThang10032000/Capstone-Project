import {
  FlatList,
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
import SearchIcon from '../../assets/svg/search.svg';
import HeaderDivider from '../Notification/HeaderDivider';
import {HISTORY_TRANSACTION_SAMPLE} from './mock';
import {TabView, SceneMap, NavigationState} from 'react-native-tab-view';
import TText from '../Transfer/TText';

const FirstRoute = () => {
  return (
    <View style={{paddingHorizontal: 15, flex: 1, marginTop: 20}}>
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
  );
};

const SecondRoute = () => {
  return (
    <View style={{paddingHorizontal: 15, flex: 1, marginTop: 20}}>
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
  );
};

const ThirdRoute = () => {
  return (
    <View style={{paddingHorizontal: 15, flex: 1, marginTop: 20}}>
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
    {key: 'second', title: 'Tuần'},
    {key: 'third', title: 'Tháng'},
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
