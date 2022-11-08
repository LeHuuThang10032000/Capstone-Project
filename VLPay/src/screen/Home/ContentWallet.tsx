import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React from 'react'

type Props = {}

const ContentWallet = (props: Props) => {
    return (
        <View>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: 'space-between', padding: 20 }}>

                <View style={styles.wrapperButton}>
                    <TouchableOpacity style={styles.button} onPress={() => console.log('tranfer!')}>
                        <View >
                            <Image source={require('../../assets/img/moneytranfer.png')} />
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.text}>Chuyển tiền</Text>
                </View>

                <View style={styles.wrapperButton}>
                    <TouchableOpacity style={styles.button} onPress={() => console.log('3k!')}>
                        <View >
                            <Image source={require('../../assets/img/biking.png')} />
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.text}>Gửi xe 3k</Text>
                </View>

                <View style={styles.wrapperButton}>
                    <TouchableOpacity style={styles.button} onPress={() => console.log('promo!')}>
                        <View >
                            <Image source={require('../../assets/img/gift.png')} />
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.text}>Ưu đãi</Text>
                </View>

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