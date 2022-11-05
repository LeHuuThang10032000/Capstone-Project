import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import React, { useState } from 'react';
import SearchIcon from '../../assets/svg/search.svg';
import { useNavigation } from '@react-navigation/native';
import { MainStackNavigation } from '../../stack/Navigation';

type Props = {}

const Header = (props: Props) => {
    const navigation = useNavigation<MainStackNavigation>();
    return (
        <View style={styles.wrapperButton}>
            <TouchableWithoutFeedback onPress={() => navigation.navigate('Search')}>
                <View style={styles.searchBtn}>
                    <Text>Search...</Text>
                    <SearchIcon />
                </View>
            </TouchableWithoutFeedback>
        </View>
    )
}

const styles = StyleSheet.create({
    searchBtn: {
        height: 40,
        width: '90%',
        margin: 12,
        padding: 10,
        borderRadius: 50,
        paddingHorizontal: 20,
        backgroundColor: '#FEFDFE',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    wrapperButton: {
        backgroundColor: '#FEB7B1',
        height: 96,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    }
});

export default Header