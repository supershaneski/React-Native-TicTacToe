import React from 'react'
import { View, Text } from 'react-native'
import ThemeContext from '../components/ThemeContext'

export default function Screen({ navigation }) {
    const theme = React.useContext(ThemeContext)
    return (
        <View style={{
            backgroundColor: theme === 'dark' ? '#333' : '#f5f5f5',
            flex: 1,
        }}>
            <Text>TicTacToe</Text>
        </View>
    )
}