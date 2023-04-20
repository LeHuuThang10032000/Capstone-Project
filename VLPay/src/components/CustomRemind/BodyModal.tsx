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
} from 'native-base';
import MessageIcon from '../../assets/svg/message.svg';
import {useForm, Controller} from 'react-hook-form';
import {axiosClient} from '../apis/axiosClient';
import Toast from 'react-native-toast-message';

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

const BodyModal: React.FC<Props> = ({
  cancel,
  confirm,
  onPressCancel,
  onPressConfirm,
  orderId,
}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<Remind>({
    defaultValues: {
      remind: '',
    },
  });
  const onSubmit = async (data: Remind) => {
    console.log(data.remind);
    try {
      const formData = new FormData();
      formData.append('order_id', orderId);
      formData.append('message', data.remind);
      await axiosClient.post('/share-bill/remind', formData, {
        headers: {'content-type': 'multipart/form-data'},
      });
      onPressCancel();
      Toast.show({
        type: 'success',
        text1: 'Thành công',
        text2: 'Gửi thông báo thành công!',
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <ScrollView flex={1} style={{paddingHorizontal: 10}}>
      <Center style={{marginVertical: 20}}>
        <UText style={{fontSize: 14, textAlign: 'center'}}>
          Nội dung lời nhắc sẽ được gửi đến thông báo VLPay của bạn bè
        </UText>
      </Center>
      <Controller
        name="remind"
        control={control}
        rules={{required: 'Không được để trống'}}
        render={({field: {onChange, onBlur, value}}) => (
          <FormControl isInvalid={errors.remind !== undefined}>
            <TextArea
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              autoFocus={false}
              keyboardType="email-address"
              placeholder="Nhập nội dung"
              marginTop={5}
              marginX={3}
              style={{
                fontFamily: 'Poppins-Regular',
                fontSize: 14,
                padding: 3,
                flex: 1,
              }}
              autoCompleteType={undefined}
              rightElement={
                <MessageIcon style={{marginRight: 3, marginBottom: 40}} />
              }
            />
            <FormControl.ErrorMessage marginLeft={3}>
              {errors.remind?.message}
            </FormControl.ErrorMessage>
            <View
              position={'absolute'}
              background="#ffffff"
              style={{top: 8, left: 20}}>
              <Text color="#99A3A4">Ghi chú</Text>
            </View>
          </FormControl>
        )}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.text}>Nhắc nhở</Text>
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
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'Poppins-Bold',
    color: '#000000',
  },
});

export default BodyModal;
