import { ScrollView } from 'react-native'
import React from 'react'
import Header from './Header'
import Banner from './Banner'
import ManageCash from './ManageCash'
import ContentWallet from './ContentWallet'

type Props = {}

const Index = (props: Props) => {
    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <Header />
            <Banner />
            <ManageCash />
            <ContentWallet />
        </ScrollView>
    )
}

export default Index