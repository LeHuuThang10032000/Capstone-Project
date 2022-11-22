import React, {useState} from 'react';

const ModalProvider = () => {
  const [modalVisible, setModalVisible] = useState<any>(false);
  const closeModal = () => {
    setModalVisible(!modalVisible);
  };
  const toggleModal = () => {
    setModalVisible(true);
  };

  return {modalVisible, setModalVisible, toggleModal, closeModal};
};

export default ModalProvider;
