import {FlatList, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import HeaderBack from '../../components/HeaderBack';
import {axiosClient} from '../../components/apis/axiosClient';

interface UserData {
  f_name: string;
  phone: string;
}

const Index = () => {
  const [profile, setProfile] = useState({});
  console.log(profile);

  useEffect(() => {
    axiosClient
      .get('https://zennoshop.cf/api/user/friends')
      .then(res => setProfile(res.data?.data))
      .catch(e => console.log(e));
  }, []);

  return (
    <View>
      <HeaderBack title="Demo friend list" />
      <FlatList
        data={Object.values(profile)}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}: any) => (
          <>
            <Text>{item?.f_name}</Text>
            <Text>{item?.phone}</Text>
          </>
        )}
      />
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({});
