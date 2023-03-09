// Searching using Search Bar Filter in React Native List View
// https://aboutreact.com/react-native-search-bar-filter-on-listview/

// import React in our code
import {useNavigation} from '@react-navigation/native';
import {
  Center,
  Heading,
  HStack,
  Icon,
  Image,
  Input,
  Skeleton,
  VStack,
} from 'native-base';
import React, {useState, useEffect, useCallback} from 'react';
import BackIcon from '../../assets/svg/left-arrow.svg';
import SearchIcon from '../../assets/svg/search.svg';

// import all the components we are going to use
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  FlatList,
  TextInput,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {MainStackNavigation} from '../../stack/Navigation';
import {UserData} from '../../model/UserData';
import Lottie from 'lottie-react-native';
import {axiosClient} from '../../components/apis/axiosClient';
import HeaderBack from '../../components/HeaderBack';

type Props = {
  text: string;
};

const Index = () => {
  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);
  const [loading, setLoading] = useState(false);

  const onPress = useCallback((f_name: string, phone: string, id: string) => {
    navigation.navigate('DetailUser', {
      id: id,
      f_name: f_name,
      phone: phone,
    });
  }, []);

  const navigation = useNavigation<MainStackNavigation>();
  const handleBack = () => {
    navigation.goBack();
  };

  const loadData = async () => {
    setLoading(true);
    axiosClient
      .get('https://zennoshop.cf/api/user/users')
      .then(res => {
        setMasterDataSource(res.data.data);
        setLoading(false);
      })
      .catch(e => console.log(e));
  };

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    setLoading(true);
    axiosClient
      .get('https://zennoshop.cf/api/user/search?key')
      .then(res => {
        setMasterDataSource(res.data.data);
        setFilteredDataSource(res.data.data);
        setLoading(false);
      })
      .catch(e => console.log(e));
  }, []);

  const searchFilterFunction = async (text: string) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource and update FilteredDataSource
      // const newData = masterDataSource.filter(function (item: UserData) {
      // Applying filter for the inserted text in search bar
      // const itemData = item.phone ? item.phone : '';
      // const textData = text;
      // return itemData.indexOf(textData) > -1;
      const result = await axiosClient.get(
        'https://zennoshop.cf/api/user/search?key=' + text,
      );
      console.log(result);

      setFilteredDataSource(result.data.data);
      // setSearch(text);
    }
  };

  const ItemView = ({item}: any) => {
    return (
      // Flat List Item

      <TouchableOpacity
        onPress={() => {
          onPress(item.f_name, item.phone, item.id);
        }}>
        <HStack alignItems="center" p="5" backgroundColor={'white'} marginY={1}>
          <Image
            source={{uri: 'https://picsum.photos/200/150'}}
            alt="rduser"
            size="sm"
            borderRadius="50"
          />
          <VStack>
            <Text
              style={[styles.itemStyle, {fontWeight: 'bold', fontSize: 16}]}>
              {item.f_name}
            </Text>
            <Text style={styles.itemStyle}>{item.phone}</Text>
          </VStack>
        </HStack>
      </TouchableOpacity>
    );
  };

  const EmptyComponent = () => {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Lottie
          source={require('../../assets/lottie-file/not-found.json')}
          autoPlay={true}
          style={{width: 200, height: 200}}
        />
        <Heading size={'md'}>Không tìm thấy người dùng nào.</Heading>
      </View>
    );
  };

  const StoreAndUserList = ({data}) => {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.sectionHeader}>{data?.stores && 'Quán:'}</Text>
        <View>
          {data?.stores &&
            data?.stores.map(store => (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('DetailStore', {
                    id: store.id,
                  });
                }}>
                <HStack key={store.id}>
                  <Image source={{uri: store.image}} width={50} height={50} />
                  <VStack style={{marginLeft: 10, marginBottom: 10}}>
                    <Text style={styles.item}>{store.name}</Text>
                    <Text style={styles.item}>{store.phone}</Text>
                  </VStack>
                </HStack>
              </TouchableOpacity>
            ))}
        </View>
        <Text style={styles.sectionHeader}>{data?.users && 'Người dùng:'}</Text>
        <View>
          {data?.users &&
            data?.users.map(user => (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('DetailUser', {
                    id: user.id,
                    f_name: user.f_name,
                    phone: user.phone,
                  });
                }}>
                <HStack key={user.id}>
                  <Image source={{uri: ''}} alt={''} width={50} height={50} />
                  <VStack style={{marginLeft: 10, marginBottom: 10}}>
                    <Text style={styles.item}>{user.f_name}</Text>
                    <Text style={styles.item}>{user.phone}</Text>
                  </VStack>
                </HStack>
              </TouchableOpacity>
            ))}
        </View>
        <View style={{height: 30}} />
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <HeaderBack title="Người dùng trên VLPay" />
      <Center marginY={5}>
        <Input
          placeholder="Nhập số điện thoại để tìm kiếm..."
          width="90%"
          borderRadius="50"
          py="3"
          px="1"
          pl="5"
          fontSize="14"
          bgColor={'white'}
          onChangeText={text => searchFilterFunction(text)}
          InputRightElement={
            <Icon
              m="2"
              ml="2"
              mr="5"
              size="6"
              color="gray.400"
              as={<SearchIcon />}
            />
          }
        />
      </Center>
      <StoreAndUserList data={filteredDataSource} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  itemStyle: {
    paddingLeft: 10,
    fontFamily: 'Poppins-Regular',
  },
  textInputStyle: {
    height: 40,
    borderWidth: 1,
    paddingLeft: 20,
    margin: 5,
    borderColor: '#009688',
    backgroundColor: '#FFFFFF',
  },
  searchBtn: {
    height: 40,
    width: '90%',
    margin: 12,
    padding: 10,
    borderRadius: 50,
    paddingHorizontal: 20,
    backgroundColor: '#FEFDFE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  wrapperButton: {
    backgroundColor: '#FEB7B1',
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    fontFamily: 'Poppins-Regular',
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  sectionHeader: {
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 16,
    marginBottom: 8,
  },
  item: {
    fontSize: 16,
    marginBottom: 4,
  },
});

export default Index;
