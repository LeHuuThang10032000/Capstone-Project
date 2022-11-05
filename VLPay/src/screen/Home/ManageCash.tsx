import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import BlindIcon from '../../assets/svg/blind_icon.svg';
import EyeIcon from '../../assets/svg/eye_icon.svg';

type Props = {}

const ManageCash = (props: Props) => {
    const [show, setShow] = useState(false);
    return (
        <View style={styles.wrapperContainer}>
            <View style={styles.container}>
                <View>
                    <TouchableOpacity onPress={() => setShow(!show)}>
                        {show ? <BlindIcon /> : <EyeIcon />}
                    </TouchableOpacity>
                    <Text>Wallet balance</Text>
                </View>

                <View>
                    {show ? (<Text>25.000 VND</Text>) : <Text>******</Text>}
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapperContainer: {
        overflow: 'hidden',
        paddingBottom: 5
    },
    container: {
        backgroundColor: '#ffffff',
        height: 60,
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.4,
        shadowRadius: 3,
        elevation: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20
    }
})

export default ManageCash