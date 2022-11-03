import { View, Text, ImageBackground, TouchableOpacity, TouchableHighlight, StyleSheet } from 'react-native'
import React from 'react'
import TopUp from '../assets/svg/topup.svg';
import Withdraw from '../assets/svg/withdraw.svg';
import QRcode from '../assets/svg/qrcode.svg';
import ScanQR from '../assets/svg/scanqr.svg';


type Props = {}

const Banner = (props: Props) => {
    return (
        <View>
            <ImageBackground source={require('../assets/img/banner.png')} resizeMode="cover" style={{ justifyContent: "center", height: 150 }}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: 'center' }}>
                    <View style={styles.wrapperButton}>
                        <TouchableHighlight style={styles.button}>
                            <TopUp />
                        </TouchableHighlight>
                        <View style={{ paddingTop: 5 }}>
                            <Text style={styles.text}>NẠP TIỀN</Text>
                        </View>
                    </View>
                    <View style={styles.wrapperButton}>
                        <TouchableHighlight style={styles.button}>
                            <Withdraw />
                        </TouchableHighlight>
                        <View style={{ paddingTop: 5 }}>
                            <Text style={styles.text}>RÚT TIỀN</Text>
                        </View>
                    </View>
                    <View style={styles.wrapperButton}>
                        <TouchableHighlight style={styles.button}>
                            <QRcode />
                        </TouchableHighlight>
                        <View style={{ paddingTop: 5 }}>
                            <Text style={styles.text}>MÃ RÚT TIỀN</Text>
                        </View>
                    </View>
                    <View style={styles.wrapperButton}>
                        <TouchableHighlight style={styles.button}>
                            <ScanQR />
                        </TouchableHighlight>
                        <View style={{ paddingTop: 5 }}>
                            <Text style={styles.text}>QUÉT MÃ</Text>
                        </View>
                    </View>
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
    },
    text: {
        color: '#ffffff',
        fontWeight: 'bold'
    }
})

export default Banner