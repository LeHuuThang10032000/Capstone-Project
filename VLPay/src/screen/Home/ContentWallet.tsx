import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ViewProps,
  ImageSourcePropType,
} from 'react-native';
import React, {useCallback, useMemo} from 'react';
import {UText} from '../../components/UText';
import {Flex} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import {MainStackNavigation} from '../../stack/Navigation';

const ContentWallet = () => {
  const navigation = useNavigation<MainStackNavigation>();
  interface IImageButtonProps extends ViewProps {
    source: ImageSourcePropType;
    title: string;
    onPress: () => void;
  }

  const ImageButton = (props: IImageButtonProps) => {
    return (
      <TouchableOpacity
        onPress={props.onPress}
        style={{
          width: '33%',
          aspectRatio: 1,
          padding: 2,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image source={props.source} style={{width: 52, height: 52}} />
        <UText style={{fontSize: 13, marginTop: 8}}>{props.title}</UText>
      </TouchableOpacity>
    );
  };

  const items: IImageButtonProps[] = useMemo(() => {
    return [
      {
        source: require('../../assets/img/withdraw.png'),
        title: 'Rút tiền',
        onPress: () => {
          console.log('nothing');
        },
      },
      {
        source: require('../../assets/img/gift.png'),
        title: 'Ưu đãi',
        onPress: () => {
          console.log('nothing');
        },
      },
      {
        source: require('../../assets/img/deposit.png'),
        title: 'Nạp tiền',
        onPress: () => {
          console.log('nothing');
        },
      },
    ];
  }, []);

  const renderItems = useCallback(() => {
    return items.map((v, i) => (
      <ImageButton
        key={i}
        source={v.source}
        title={v.title}
        onPress={v.onPress}
      />
    ));
  }, [items]);

  return (
    <View>
      {/* <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: 20,
        }}>
        <View style={styles.wrapperButton}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => console.log('tranfer!')}>
            <View>
              <Image source={require('../../assets/img/moneytranfer.png')} />
            </View>
          </TouchableOpacity>
          <Text style={styles.text}>Chuyển tiền</Text>
        </View>

        <View style={styles.wrapperButton}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => console.log('promo!')}>
            <View>
              <Image source={require('../../assets/img/gift.png')} />
            </View>
          </TouchableOpacity>
          <Text style={styles.text}>Ưu đãi</Text>
        </View>
      </View> */}

      <View
        style={{
          padding: 16,
          marginTop: 24,
        }}>
        <Flex
          flexDirection={'row'}
          justifyContent="flex-start"
          alignItems="center"
          flexWrap="wrap">
          {renderItems()}
        </Flex>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#ffffff',
    width: 52,
    height: 52,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  wrapperButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#000000',
    fontWeight: 'normal',
    paddingTop: 5,
    fontFamily: 'Poppins-Regular',
  },
});

export default ContentWallet;
