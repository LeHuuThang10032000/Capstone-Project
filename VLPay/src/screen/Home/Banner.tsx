import { View, Text, ImageBackground, TouchableWithoutFeedback, TouchableHighlight, StyleSheet } from 'react-native'
import React from 'react'
import TopUp from '../../assets/svg/topup.svg';
import Withdraw from '../../assets/svg/withdraw.svg';
import QRcode from '../../assets/svg/qrcode.svg';
import ScanQR from '../../assets/svg/scanqr.svg';


type Props = {}

const Banner = (props: Props) => {
    return (
        <View>
            <ImageBackground source={require('../../assets/img/banner.png')} resizeMode="cover" style={{ justifyContent: "center", height: 150 }}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: 'center' }}>
                    <TouchableWithoutFeedback onPress={() => console.log('top up!')}>
                        <View style={styles.wrapperButton}>
                            <View style={styles.button}>
                                <TopUp />
                            </View>
                            <Text style={styles.text}>TOP UP</Text>
                        </View>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback onPress={() => console.log('with draw!')}>
                        <View style={styles.wrapperButton}>
                            <View style={styles.button}>
                                <Withdraw />
                            </View>
                            <Text style={styles.text}>WITH DRAW</Text>
                        </View>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback onPress={() => console.log('qr code!')}>
                        <View style={styles.wrapperButton}>
                            <View style={styles.button}>
                                <QRcode />
                            </View>
                            <Text style={styles.text}>QR CODE</Text>
                        </View>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback onPress={() => console.log('scan qr!')}>
                        <View style={styles.wrapperButton}>
                            <View style={styles.button}>
                                <ScanQR />
                            </View>
                            <Text style={styles.text}>SCAN QR</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#ffffff',
        width: 52,
        height: 52,
        marginHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20
    },
    wrapperButton: {
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        color: '#ffffff',
        fontWeight: 'bold',
        paddingTop: 5
    },
})

export default Banner