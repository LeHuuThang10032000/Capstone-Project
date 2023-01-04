import * as React from 'react';
import {View, Text, Dimensions} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import 'react-native-reanimated';
import {Image} from 'native-base';

const {width} = Dimensions.get('window');

const carouselImages = [
  // 'https://i.ibb.co/FDwNR9d/img1.jpg',
  // 'https://i.ibb.co/7G5qqGY/1.jpg',
  // 'https://i.ibb.co/Jx7xqf4/pexels-august-de-richelieu-4427816.jpg',
  // 'https://i.ibb.co/GV08J9f/pexels-pixabay-267202.jpg',
  // 'https://i.ibb.co/sK92ZhC/pexels-karolina-grabowska-4210860.jpg',
  require('../../../assets/img/promo1.png'),
  require('../../../assets/img/promo2.png'),
  require('../../../assets/img/promo3.png'),
];

export default function PromoCarousel() {
  return (
    <View style={{flex: 1, paddingTop: 48}}>
      <Text
        style={{
          paddingHorizontal: 16,
          fontSize: 18,
          fontFamily: 'Poppins-Bold',
          color: '#000000',
        }}>
        Các chương trình khuyến mãi
      </Text>
      <Carousel
        loop
        mode="parallax"
        width={width}
        height={width / 2}
        autoPlay={true}
        data={carouselImages}
        scrollAnimationDuration={2000}
        // onSnapToItem={(index: number) => console.log('current index:', index)}
        renderItem={({item, index}) => (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
            }}>
            <Image
              source={item}
              style={{
                width: width,
                height: width / 2,
                resizeMode: 'cover',
                borderRadius: 8,
              }}
              alt="carousel"
            />
          </View>
        )}
      />
    </View>
  );
}
