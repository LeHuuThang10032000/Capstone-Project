// Searching using Search Bar Filter in React Native List View
// https://aboutreact.com/react-native-search-bar-filter-on-listview/

// import React in our code
import {useNavigation} from '@react-navigation/native';
import {HStack, Icon, Image, Input, Skeleton, VStack} from 'native-base';
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
} from 'react-native';
import {MainStackNavigation} from '../../stack/Navigation';
import {UserData} from '../../model/UserData';
import Lottie from 'lottie-react-native';

type Props = {
  text: string;
};

const Index = () => {
  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);
  const [loading, setLoading] = useState(false);

  const onPress = useCallback(
    (
      email: string,
      picture: string,
      title: string,
      first: string,
      last: string,
      phone: string,
    ) => {
      navigation.navigate('DetailFriend', {
        email: email,
        picture: picture,
        title: title,
        first: first,
        last: last,
        phone: phone,
      });
    },
    [],
  );

  const navigation = useNavigation<MainStackNavigation>();
  const handleBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    setLoading(true);
    fetch('https://randomuser.me/api/?results=50')
      .then(response => response.json())
      .then(responseJson => {
        setFilteredDataSource(responseJson.results);
        setMasterDataSource(responseJson.results);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const searchFilterFunction = (text: string) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource and update FilteredDataSource
      const newData = masterDataSource.filter(function (item: UserData) {
        // Applying filter for the inserted text in search bar
        const itemData = item.name.last ? item.name.last : '';
        const textData = text;
        return itemData.indexOf(textData) > -1;
      });
      setFilteredDataSource(newData);
      setSearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setFilteredDataSource(masterDataSource);
      setSearch(text);
    }
  };

  const ItemView = ({item}: any) => {
    return (
      // Flat List Item
      <TouchableOpacity
        onPress={() => {
          onPress(
            item.email,
            item.picture.large,
            item.name.title,
            item.name.first,
            item.name.last,
            item.phone,
          );
        }}>
        <HStack alignItems="center" p="5">
          <Image
            source={{uri: `${item.picture.large}`}}
            alt="rduser"
            size="sm"
            borderRadius="50"
          />
          <VStack>
            <Text style={styles.itemStyle}>
              {item.name.title} {item.name.first} {item.name.last}
            </Text>
            <Text style={styles.itemStyle}>{item.email}</Text>
          </VStack>
        </HStack>
      </TouchableOpacity>
    );
  };

  const ItemSeparatorView = () => {
    return (
      // Flat List Item Separator
      <View
        style={{
          height: 0.5,
          width: '100%',
          backgroundColor: '#C8C8C8',
        }}
      />
    );
  };

  const EmptyComponent = () => {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Lottie
          source={require('../../assets/lottie-file/loading.json')}
          autoPlay={true}
          style={{width: 100, height: 100}}
        />
      </View>
    );
  };

  const getItem = (item: UserData) => {
    // Function for click on an item
    Alert.alert(item.name.title + ' ' + item.name.first + ' ' + item.name.last);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.wrapperButton}>
        <HStack alignItems="center" px="5">
          <TouchableOpacity onPress={handleBack}>
            <BackIcon />
          </TouchableOpacity>
          <Input
            placeholder="Search..."
            width="90%"
            borderRadius="50"
            py="3"
            px="1"
            pl="5"
            fontSize="14"
            bgColor={'white'}
            onChangeText={text => searchFilterFunction(text)}
            value={search}
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
        </HStack>
      </View>
      <FlatList
        data={filteredDataSource}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={ItemSeparatorView}
        renderItem={ItemView}
        ListEmptyComponent={EmptyComponent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
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
});

export default Index;
