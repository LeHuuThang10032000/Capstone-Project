import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient';
import styles from './styles';
import { UText, Utitle } from '../../components/UText';
import MailIcon from '../../assets/svg/mail.svg';
// import { TextInput } from 'react-native-gesture-handler';

type Props = {}

const index = (props: Props) => {
    return (
        <LinearGradient
            colors={['#FEB7B1', '#FFFFFF']}
            style={styles.linearGradient}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Utitle style={styles.headerItem}>Forgot Password</Utitle>
                </View>
                <View style={styles.content}>
                    <Utitle style={{ fontSize: 18 }}>E-mail</Utitle>
                    <View style={styles.itemField}>
                        <TextInput placeholder="Input your email VLU" style={styles.textInput} />
                    </View>
                </View>
                <TouchableOpacity style={styles.buttonInput}>
                    <UText style={styles.textButtonInput}>Send to your email</UText>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    )
}

export default index