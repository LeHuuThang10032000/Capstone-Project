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

interface Post {
  id: number;
  phone: string;
  image: string;
  name: string;
  location: string;
}

const ListStore = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchPosts();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  console.log(page);

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
    <TouchableOpacity>
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
      </HStack>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (isLoading && hasMore) {
      return <ActivityIndicator />;
    }
    return null;
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
        nestedScrollEnabled
      />
    </View>
  );
};

export default ListStore;
