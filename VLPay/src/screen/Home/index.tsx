import { View, Text, ScrollView, TouchableOpacity, ImageBackground } from 'react-native'
import React from 'react'
import Header from '../../components/Header'
import Banner from '../../components/Banner'

type Props = {}

const Index = (props: Props) => {
    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <Header />
            <Banner />
        </ScrollView>
    )
}

export default Index