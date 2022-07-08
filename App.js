import React from 'react'
import { Modal, useColorScheme, TouchableOpacity } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'

import ThemeContext from './src/components/ThemeContext'
import TicTacToeScreen from './src/screens/TicTacToe'
import SystemIcon from './src/components/SystemIcon'
import About from './src/components/About'

const Stack = createNativeStackNavigator()

const Routes = [
  {name: 'TicTacToe', title: 'Tic-Tac-Toe', component: TicTacToeScreen},
]

export default function App() {

  const theme = useColorScheme()
  const [openModal, setOpenModal] = React.useState(false)
  
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
        onRequestClose={() => setOpenModal(false)}
        >
          <About onClose={() => setOpenModal(false)} />
        </Modal>
      </ThemeContext.Provider>
    </SafeAreaProvider>
  )
}