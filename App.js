import React from 'react'
import { Dimensions, StyleSheet, View, Modal, Alert, Pressable, useColorScheme, TouchableOpacity, Text } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'

import ThemeContext from './src/components/ThemeContext'
import TicTacToeScreen from './src/screens/TicTacToe'

import SystemIcon from './src/components/SystemIcon'

import * as Application from 'expo-application'

const Stack = createNativeStackNavigator()

const Routes = [
  {name: 'TicTacToe', title: 'Tic-Tac-Toe', component: TicTacToeScreen},
]

const window = Dimensions.get('window')

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    //backgroundColor: '#999',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 24,
  },
  buttonText: {
    fontSize: 16,
  },
  name: {
    fontSize: 24,
  },
  version: {
    fontSize: 16,
  },
  info: {
    justifyContent: 'center',
    alignItems: 'center',
  }
})

export default function App() {

  const theme = useColorScheme()

  const [dimensions, setDimensions] = React.useState({ window })

  const [openModal, setOpenModal] = React.useState(false)
  
  React.useEffect(() => {
    setDimensions({ window })
  }, [])

  React.useEffect(() => {

    const subscribed = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions({ window })
    })

    return () => subscribed?.remove()

  })

  let modal_width = dimensions.window.width > 600 ? 0.5 * dimensions.window.width : 0.8 * dimensions.window.width
  let modal_height = 0.6 * modal_width

  return (
    <SafeAreaProvider>
      <ThemeContext.Provider value={theme}>
        <NavigationContainer>
          <Stack.Navigator>
            {
              Routes.map(route => {
                return (
                  <Stack.Screen 
                  key={route.name}
                  name={route.name}
                  component={route.component} 
                  options={{
                    title: route.title,
                    headerStyle: {
                      backgroundColor: theme === 'dark' ? '#333' : '#F5F5F5',
                    },
                    headerTintColor: theme === 'dark' ? '#666' : '#333',
                    headerTitleStyle: {
                      fontWeight: 'bold',
                    },
                    headerRight: () => (
                      <TouchableOpacity onPress={() => setOpenModal(true)}>
                        <SystemIcon />
                      </TouchableOpacity>
                    )
                  }}
                  />
                )
              })
            }
          </Stack.Navigator>
        </NavigationContainer>
        <Modal 
        animationType="slide"
        transparent={true}
        visible={openModal}
        onRequestClose={() => {
          setOpenModal(false)
        }}
        >

          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <View style={[styles.modal, {
              backgroundColor: theme === 'dark' ? '#666' : '#fff',
              width: modal_width,
              height: modal_height,
              borderRadius: 16,
            }]}
            shadowOffset={{height: 1}}
            shadowColor='#000000'
            shadowOpacity={0.11}
            >
              <View style={styles.info}>
                <Text style={[styles.name, {
                  color: theme === 'dark' ? '#fff' : '#333',
                }]}>{Application.applicationName}</Text>
                <Text style={[styles.version, {
                  color: theme === 'dark' ? '#999' : '#999',
                }]}>v{Application.nativeApplicationVersion}</Text>
                <TouchableOpacity style={[styles.button, {
                  backgroundColor: theme === 'dark' ? '#fff' : '#333',
                }]} onPress={() => setOpenModal(false)}>
                  <Text style={[styles.buttonText, {
                    color: theme === 'dark' ? '#333' : '#fff',
                  }]}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ThemeContext.Provider>
    </SafeAreaProvider>
  )
}

//<Text style={{color: '#fff'}}>Menu</Text>