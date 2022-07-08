import React from 'react'
import { Dimensions, View, Text, TouchableOpacity } from 'react-native'
import * as Application from 'expo-application'
import * as Localization from 'expo-localization'

import ThemeContext from './ThemeContext'
import useTheme from './useTheme'
import useCaption from './useCaption'

const customStyle = {
    container: {
        dark: '#666',
        light: '#fff'
    },
    text: {
        dark: '#fff',
        light: '#333'
    },
    button: {
        dark: '#333',
        light: '#fff'
    },
}

const window = Dimensions.get('window')

export default ({ onClose }) => {

    const theme = React.useContext(ThemeContext)
    const customTheme = useTheme(customStyle, theme)
    const captions = useCaption(Localization.locale)

    const [dimensions, setDimensions] = React.useState({ window })

    React.useEffect(() => {
        setDimensions({ window })
    }, [])

    React.useEffect(() => {

        const subscribed = Dimensions.addEventListener('change', ({ window }) => {
            setDimensions({ window })
        })
      
        return () => subscribed?.remove()
    })
    
    let modal_width = 0.9 * dimensions.window.width
    let modal_height = 0.5 * dimensions.window.height

    modal_width = modal_width > 500 ? 500 : modal_width
    modal_height = modal_height > 300 ? 300 : modal_height

    return (
        <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <View style={{
                backgroundColor: customTheme('container'),
                width: modal_width,
                height: modal_height,
                borderRadius: 6,
                padding: 20,
            }}
            shadowOffset={{height: 1}}
            shadowColor='#000000'
            shadowOpacity={0.11}
            >
                <View style={{
                    flex: 1,
                }}>
                    <Text style={{
                        fontSize: 30,
                        color: customTheme('text'),
                    }}>{Application.applicationName}</Text>
                    <Text style={{
                        fontSize: 16,
                        color: '#999',
                    }}>v{Application.nativeApplicationVersion}</Text>
                    <Text style={{
                        marginVertical: 16,
                        color: customTheme('text'),
                    }}>{captions('about.description')}</Text>
                </View>
                <View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <TouchableOpacity style={{
                        backgroundColor: customTheme('text'),
                        paddingVertical: 10,
                        paddingHorizontal: 20,
                        borderRadius: 12,
                        marginTop: 24,
                        width: 150,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }} onPress={onClose}>
                    <Text style={{
                        color: customTheme('button'),
                        fontSize: 16,
                    }}>{ captions('about.close') }</Text>
                    </TouchableOpacity>
              </View>
            </View>
          </View>
    )
}