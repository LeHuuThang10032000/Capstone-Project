import { View, Text, TouchableWithoutFeedback, StyleSheet, Image } from 'react-native'
import React from 'react'

type Props = {}

const ContentWallet = (props: Props) => {
    return (
        <View>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: 'space-between', padding: 20 }}>
                <TouchableWithoutFeedback onPress={() => console.log('tranfer!')}>
                    <View style={styles.wrapperButton}>
                        <View style={styles.button}>
                            <Image source={require('../../assets/img/moneytranfer.png')} />
                        </View>
                        <Text style={styles.text}>Chuyển tiền</Text>
                    </View>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback onPress={() => console.log('3k!')}>
                    <View style={styles.wrapperButton}>
                        <View style={styles.button}>
                            <Image source={require('../../assets/img/biking.png')} />
                        </View>
                        <Text style={styles.text}>Gửi xe 3k</Text>
                    </View>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback onPress={() => console.log('promo!')}>
                    <View style={styles.wrapperButton}>
                        <View style={styles.button}>
                            <Image source={require('../../assets/img/gift.png')} />
                        </View>
                        <Text style={styles.text}>Ưu đãi</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
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
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    wrapperButton: {
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        color: '#000000',
        fontWeight: 'normal',
        paddingTop: 5
    },
})

export default ContentWallet