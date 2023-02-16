import React from 'react';
import {Center, HStack, VStack, Text, View} from 'native-base';
import WarningIcon from '../../../assets/svg/warning-red.svg';
import HeaderBack from '../../../components/HeaderBack';

type Props = {};

const NotiScreen = (props: Props) => {
  return (
    <View flex={1}>
      <HeaderBack title="Tạo Shop" />
      <Center flex={1}>
        <HStack>
          <WarningIcon />
          <VStack mx={3}>
            <Text fontWeight="bold" color={'#E74C3C'}>
              Yêu cầu của bạn đã được gửi.
            </Text>
            <Text fontWeight="bold" color={'#E74C3C'}>
              Vui lòng đợi xét duyệt. Sau khi
            </Text>
            <Text fontWeight="bold" color={'#E74C3C'}>
              được xét duyệt bạn sẽ nhận
            </Text>
            <Text fontWeight="bold" color={'#E74C3C'}>
              được thông báo qua App hoặc
            </Text>
            <Text fontWeight="bold" color={'#E74C3C'}>
              bằng Email. Bạn chú ý đến{' '}
            </Text>
            <Text fontWeight="bold" color={'#E74C3C'}>
              thông báo ở App và email nhé.
            </Text>
          </VStack>
        </HStack>
      </Center>
    </View>
  );
};

export default NotiScreen;
