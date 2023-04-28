import React, {useState, useEffect} from 'react';
import {
  View,
  FlatList,
  Text,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {axiosClient} from '../../components/apis/axiosClient';
import {Heading, HStack, Image, VStack} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import {MainStackNavigation} from '../../stack/Navigation';

interface Post {
  id: number;
  phone: string;
  image: string;
  name: string;
  location: string;
  status: string;
}

const ListStore = () => {
  const navigation = useNavigation<MainStackNavigation>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  console.log('List store: ', posts);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchPosts();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const fetchPosts = async () => {
    setIsLoading(true);
    const response = await axiosClient.get(
      //   `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=10`,
      `https://zennoshop.cf/api/user/store?limit=10&page=${page}`,
    );
    const data = response.data?.data;
    setPosts(posts.concat(data));
    setIsLoading(false);
    if (data.length === 0) {
      setHasMore(false);
    }
  };

  useEffect(() => {
    if (hasMore) {
      fetchPosts();
    }
  }, [page]);

  const renderItem = ({item}: {item: Post}) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('DetailStore', {
          store_id: item.id,
          status: item?.status,
        });
      }}>
      <HStack
        py={3}
        mx={3}
        px={3}
        mb={3}
        backgroundColor="#FFFFFF"
        alignItems="center"
        borderWidth={1}
        borderRadius={10}>
        <Image
          source={{uri: item.image}}
          width={52}
          height={52}
          borderRadius={50}
          borderWidth={1}
          borderColor="#000000"
          alt="img-store"
        />
        <VStack pl={3}>
          <Heading size={'sm'}>
            {item.name} ({item.location})
          </Heading>
          <Text>{item.phone}</Text>
        </VStack>
        {item?.promocodes ? (
          <Text
            style={{
              position: 'absolute',
              right: 0,
              top: -1,
              backgroundColor: 'red',
              color: 'white',
              borderRadius: 30,
              width: 20,
              height: 20,
              textAlign: 'center',
              lineHeight: 20,
            }}>
            {item?.promocodes}
          </Text>
        ) : (
          <></>
        )}
      </HStack>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (isLoading && hasMore) {
      return <ActivityIndicator />;
    }
    return null;
  };

  const renderHeader = () => {
    return <Text>Header</Text>;
  };

  const handleLoadMore = () => {
    if (hasMore) {
      setPage(page + 1);
    }
  };

  return (
    <View>
      <Text
        style={{
          paddingHorizontal: 16,
          fontSize: 18,
          fontFamily: 'Poppins-Bold',
          color: '#000000',
        }}>
        Danh sách cửa hàng
      </Text>
      <FlatList
        // refreshControl={
        //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        // }
        data={posts}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
};

export default ListStore;
