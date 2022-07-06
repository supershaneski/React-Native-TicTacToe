import React from 'react'
import { Dimensions, StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import ThemeContext from '../components/ThemeContext'
import { useHeaderHeight } from '@react-navigation/elements'

const window = Dimensions.get('window')
const paddingValue = 16
const marginValue = 16

const getTheWinner = (squares) => {

    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ]

    for(let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i]
        if(squares[a] > 0 && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a]
        }
    }

    return null
}

const initialTiles = () => new Array(9).fill(0)

export default function Screen({ navigation }) {
    
    const theme = React.useContext(ThemeContext)

    const [tiles, setTiles] = React.useState(initialTiles)
    
    const [dimensions, setDimensions] = React.useState({ window })
    
    const headerHeight = useHeaderHeight()

    const [turn, toggleTurn] = React.useState(1)

    const [gameOver, setGameOver] = React.useState(false)
    const [winner, setWinner] = React.useState(0)

    React.useEffect(() => {

        setDimensions({ window })

    }, [])

    React.useEffect(() => {
        
        const subscribed = Dimensions.addEventListener('change', ({ window }) => {
            setDimensions({ window })
        })

        return () => subscribed?.remove()
    })

    const handleReset = () => {

        setTiles(initialTiles)

        toggleTurn(1)
        setWinner(0)
        setGameOver(false)

    }

    const handleClick = (_index) => {

        if(gameOver) {
            return
        }

        let _tiles = tiles.slice(0)

        if(_tiles.find((item, index) => index === _index) > 0) {
            return
        }

        _tiles = _tiles.map((item, index) => {
            if(index === _index) {
                return turn === 1 ? 1 : 2
            } else {
                return item
            }
        })
        
        setTiles(_tiles)

        const winner = getTheWinner(_tiles)

        if(!winner) {

            const blankTileExist = _tiles.some(item => item === 0)
            if(!blankTileExist) {
                setGameOver(true)
            } else {
                toggleTurn(turn === 1 ? 2 : 1)
            }

        } else {

            setWinner(winner)
            setGameOver(true)

        }

    }

    const actualWidth = dimensions.window.width - (2 * paddingValue) - (2 * marginValue)
    const actualHeight = dimensions.window.height - (2 * paddingValue) - (2 * marginValue) - headerHeight - 50

    const dominantLength = actualWidth > actualHeight ? actualHeight : actualWidth

    const tileSize = (dominantLength - 6)/3
    const textSize = tileSize * 2 / 3
    
    return (
        <View style={[styles.container, {
            backgroundColor: theme === 'dark' ? '#333' : '#f5f5f5',
        }]}>
            <View style={[styles.inner, {
                margin: marginValue,
                padding: paddingValue,
            }]}>
                <View style={styles.game}>
                    <View style={[styles.tileContainer, {
                        width: dominantLength,
                    }]}>
                    {
                        tiles.map((item, index) => {
                            return (
                                <TouchableOpacity activeOpacity={gameOver ? 1 : 0.5} onPress={() => handleClick(index)} key={index} style={[styles.tile, {
                                    width: tileSize,
                                    height: tileSize,
                                    borderTopLeftRadius: index === 0 ? 16 : 0,
                                    borderTopRightRadius: index === 2 ? 16 : 0,
                                    borderBottomLeftRadius: index === 6 ? 16 : 0,
                                    borderBottomRightRadius: index === 8 ? 16 : 0,
                                }]}>
                                    <Text style={[styles.tileText,{
                                        fontSize: textSize,
                                        color: theme === 'dark' ? '#333' : '#f5f5f5',
                                    }]}>{item === 0 ? '' : item === 1 ? 'X' : 'O'}</Text>
                                </TouchableOpacity>
                            )
                        })
                    }
                    {
                        gameOver &&
                        <View style={styles.gameOver}>
                            <View style={styles.overlay}>
                                <TouchableOpacity onPress={handleReset} style={[styles.gameOverButton, {
                                    borderColor: theme === 'dark' ? '#fff' : '#333',
                                    backgroundColor: theme === 'dark' ? 'transparent' : '#fff',
                                }]}>
                                    <Text style={[styles.gameOverText, {
                                        color: theme === 'dark' ? '#fff' : '#333'
                                    }]}>Try Again?</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    }
                    </View>
                </View>
                <View style={styles.info}>
                    {
                        !gameOver &&
                        <Text style={[styles.text, {color: theme === 'dark' ? '#fff' : '#333'}]}>Turn: {turn === 1 ? 'X' : 'O'}</Text>
                    }
                    {
                        (gameOver && winner > 0) &&
                        <Text style={[styles.text, {color: theme === 'dark' ? '#fff' : '#333'}]}>Winner is {winner === 1 ? 'X' : 'O'}!</Text>
                    }
                    {
                        (gameOver && winner === 0) &&
                        <Text style={[styles.text, {color: theme === 'dark' ? '#fff' : '#333'}]}>It's a tie!</Text>
                    }
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    
    inner: {
        flex: 1,
    },
    game: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    info: {
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tileContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },  
    tile: {
        backgroundColor: '#344',
        marginRight: 2,
        marginBottom: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tileText: {
        fontWeight: 'bold',
        //color: '#333',
    },
    text: {
        fontWeight: 'bold',
        fontSize: 20,
        //color: '#fff'
    },
    gameOver: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    gameOverButton: {
        borderWidth: 2,
        borderColor: '#fff',
        padding: 10,
        borderRadius: 12,
    },
    gameOverText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',
    },
    overlay: {
        width: '40%',
    }
})