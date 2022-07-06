import React from 'react'
import { useColorScheme } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'

import ThemeContext from './src/components/ThemeContext'
import TicTacToeScreen from './src/screens/TicTacToe'

const Stack = createNativeStackNavigator()

const Routes = [
  {name: 'TicTacToe', title: 'Tic-Tac-Toe', component: TicTacToeScreen},
]

export default function App() {

  const theme = useColorScheme()

  console.log("theme", theme)

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
                    headerTintColor: theme === 'dark' ? '#FFF' : '#333',
                    headerTitleStyle: {
                      fontWeight: 'bold',
                    },
                  }}
                  />
                )
              })
            }
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeContext.Provider>
    </SafeAreaProvider>
  )
}