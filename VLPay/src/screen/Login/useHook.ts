import {useForm} from 'react-hook-form';

export interface ILoginInfoValue {
  phoneNumber: string;
  password: string;
}

export type InitialData = {
  phoneNumber: string;
  password: string;
};

const useSubmitAuth = (
  initial: InitialData,
  onSuccess: () => void,
  onError: (error?: string) => void,
) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<ILoginInfoValue>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      phoneNumber: initial.phoneNumber,
      password: initial.password,
    },
  });
};
