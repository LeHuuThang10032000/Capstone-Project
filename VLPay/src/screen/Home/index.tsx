import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from './Header';
import Banner from './Banner';
import ManageCash from './ManageCash';
import ContentWallet from './ContentWallet';
import PromoCarousel from './PromoCarousel';
import {Init} from '../../redux/actions/authAction';
import Login from '../Login';
import {useDispatch, useSelector} from 'react-redux';
import {axiosClient} from '../../components/apis/axiosClient';
import {formatCurrency} from '../../components/helper';
import ListStore from './ListStore';
import {Heading, HStack, Image, VStack} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import {MainStackNavigation} from '../../stack/Navigation';

interface Post {
  id: number;
  phone: string;
  image: string;
  name: string;
  location: string;
}

const Index = () => {
  const navigation = useNavigation<MainStackNavigation>();
  const token = useSelector((state: any) => state.authReducer.authToken);
  const [userWallet, setUserWallet] = useState(0);
  const [credit, setCredit] = useState(0);
  const [isloading, setIsloading] = useState(false);

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

  console.log(posts);

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
      onPress={() =>
        navigation.navigate('DetailStore', {
          id: item.id,
        })
      }>
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

  const renderHeader = () => {
    return (
      <>
        <Header />
        <Banner wallet={userWallet} />
        <ManageCash wallet={userWallet} credit={credit} loading={isloading} />
        <ContentWallet />
        <PromoCarousel />
        <Text
          style={{
            paddingHorizontal: 16,
            paddingBottom: 16,
            fontSize: 18,
            fontFamily: 'Poppins-Bold',
            color: '#000000',
          }}>
          Danh sách cửa hàng
        </Text>
      </>
    );
  };

  const handleLoadMore = () => {
    if (hasMore) {
      setPage(page + 1);
    }
  };

  const fetchData = async () => {
    if (token) {
      setInterval(async () => {
        const result = await axiosClient.get('/user-wallet');
        setUserWallet(result?.data?.data?.balance);
        setCredit(result?.data?.data?.credit_limit);
        setIsloading(true);
      }, 2000);
    }
  };
  useEffect(() => {
    fetchData();
  }, [token]);
  const dispatch = useDispatch();
  const init = async () => {
    dispatch(await Init());
  };
  useEffect(() => {
    init();
  });
  return (
    <>
      {token ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={posts}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListHeaderComponent={renderHeader}
        />
      ) : (
        <Login />
      )}
    </>
  );
};

export default Index;
