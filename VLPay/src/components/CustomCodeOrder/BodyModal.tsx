import {Alert, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {UText} from '../UText';
import {
  Center,
  TextArea,
  View,
  Text,
  FormControl,
  ScrollView,
  Input,
} from 'native-base';
import MessageIcon from '../../assets/svg/message.svg';
import {useForm, Controller} from 'react-hook-form';
import {axiosClient} from '../apis/axiosClient';
import Toast from 'react-native-toast-message';
import {useNavigation} from '@react-navigation/native';
import {MainStackNavigation} from '../../stack/Navigation';

type Props = {
  cancel: string;
  confirm: string;
  onPressCancel: () => void;
  onPressConfirm: () => void;
  orderId: number;
};

interface Remind {
  remind: string;
}

const BodyModalCode: React.FC<Props> = ({
  cancel,
  confirm,
  onPressCancel,
  onPressConfirm,
  orderId,
}) => {
  const navigation = useNavigation<MainStackNavigation>();

  const {
    control,
    handleSubmit,
    setError,
    formState: {errors},
  } = useForm<Remind>({
    defaultValues: {
      remind: '',
    },
  });
  const onSubmit = async (data: Remind) => {
    console.log(data);
    console.log(orderId);

    try {
      const formData = new FormData();
      formData.append('order_id', orderId);
      formData.append('taken_code', data.remind);
      await axiosClient.post('/order/taken-order', formData, {
        headers: {'content-type': 'multipart/form-data'},
      });
      navigation.navigate('Home');
      Toast.show({
        type: 'success',
        text1: 'Thành công',
        text2: 'Nhận hàng thành công!',
      });
    } catch (error) {
      console.log(error);
      setError('remind', {
        type: 'pattern',
        message: 'Mã đơn hàng không hợp lệ',
      });
    }
  };
  return (
    <ScrollView flex={1} style={{paddingHorizontal: 10}}>
      <Center style={{marginVertical: 20}}>
        <UText style={{fontSize: 18, textAlign: 'center', fontWeight: 'bold'}}>
          Nhập mã đơn hàng
        </UText>
      </Center>
      <Controller
        name="remind"
        control={control}
        rules={{required: 'Không được để trống mã đơn hàng'}}
        render={({field: {onChange, onBlur, value}}) => (
          <FormControl isInvalid={errors.remind !== undefined}>
            <Input
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              textAlign={'center'}
              autoFocus={false}
              keyboardType="number-pad"
              marginX={10}
              maxLength={4}
              style={{
                fontFamily: 'Poppins-Regular',
                fontSize: 14,
                padding: 3,
                flex: 1,
              }}
            />
            <FormControl.ErrorMessage marginLeft={10}>
              {errors.remind?.message}
            </FormControl.ErrorMessage>
          </FormControl>
        )}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.text}>Xác nhận</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  containerBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    marginTop: 20,
  },
  buttonCancel: {
    backgroundColor: '#B5EAD8',
    height: 40,
    width: '48%',
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  buttonConfirm: {
    backgroundColor: '#FEB7B1',
    height: 40,
    width: '48%',
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  button: {
    backgroundColor: '#B5EAD8',
    padding: 15,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 6,
    marginHorizontal: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'Poppins-Bold',
    color: '#000000',
  },
});

export default BodyModalCode;
