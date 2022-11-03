import { View, Text, TextInput, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import SearchIcon from '../assets/svg/search.svg'

type Props = {}

const Header = (props: Props) => {
    const [search, setSearch] = useState('');
    return (
        <View style={{ backgroundColor: '#FEB7B1', height: 96, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', }}>
            <TextInput
                style={styles.input}
                placeholder="Search..." />
            <SearchIcon style={{ position: 'absolute', right: 50 }} />
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
        height: 40,
        width: '90%',
        margin: 12,
        padding: 10,
        borderRadius: 50,
        paddingHorizontal: 20,
        backgroundColor: '#FEFDFE'
    },
});

export default Header