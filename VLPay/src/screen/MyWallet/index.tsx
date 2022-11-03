import { View, Text, Button } from 'react-native'
import React from 'react'
import { MainStackNavigation } from '../../stack/Navigation';
import { useNavigation } from '@react-navigation/native';

type Props = {}

const Index = (props: Props) => {
    const navigation = useNavigation<MainStackNavigation>();
    return (
        <View>
            <Text>My wallet</Text>
        </View>
    )
}

export default Index