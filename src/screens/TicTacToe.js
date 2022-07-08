import React from 'react'
import { Dimensions, StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { useHeaderHeight } from '@react-navigation/elements'
import * as Localization from 'expo-localization'

import ThemeContext from '../components/ThemeContext'
import useTheme from '../components/useTheme'
import useCaption from '../components/useCaption'
import { wait, shuffle, getRandomInt } from '../lib/utils'

const window = Dimensions.get('window')

const paddingValue = 16
const marginValue = 16

const lineGroups = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
]

const getWinner = (squares) => {

    for(let i = 0; i < lineGroups.length; i++) {
        const [a, b, c] = lineGroups[i]
        if(squares[a] > 0 && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a]
        }
    }

    return null
}

const getNextMove = (value, tiles) => {

    for(let k = 0; k < lineGroups.length; k++) {

        const [a, b, c] = lineGroups[k]

        if(tiles[a] === value && tiles[b] === value && tiles[c] === 0) {
            
            return c

        } else if(tiles[a] === value && tiles[c] === value && tiles[b] === 0) {
            
            return b
        
        } else if(tiles[b] === value && tiles[c] === value && tiles[a] === 0) {
            
            return a

        }

    }

    return -1

}

const themeStyle = {
    container: {
        dark: '#333',
        light: '#f5f5f5',
    },
    text: {
        dark: '#fff',
        light: '#333',
    },
    tile: {
        dark: '#344',
        light: '#cdd',
    }
}

const runGameAI = (tiles) => {
    return wait(tiles)
}

const initialTiles = () => new Array(9).fill(0)

export default function Screen({ navigation }) {
    
    const theme = React.useContext(ThemeContext)

    const mytheme = useTheme(themeStyle, theme)
    const captions = useCaption(Localization.locale)

    const [tiles, setTiles] = React.useState(initialTiles)
    const [dimensions, setDimensions] = React.useState({ window })
    const headerHeight = useHeaderHeight()

    const [turn, toggleTurn] = React.useState(1)
    const [playState, setPlayState] = React.useState(0)
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

    React.useEffect(() => {
        if(turn === 2) {

            procAgent(tiles)

        } else {

            setPlayState(0)
        }
    }, [turn])

    const handleReset = () => {

        setTiles(initialTiles)

        toggleTurn(1)
        setWinner(0)
        setGameOver(false)

    }

    const handlePress = (index) => (e) => {
        
        if(playState > 0 || gameOver) {
            return
        }

        selectTile(index)

    }

    const selectTile = (_index) => {
        
        let _tiles = tiles.slice(0)

        if(_tiles.find((item, index) => index === _index) > 0) {
            return
        }

        setPlayState(1)

        _tiles = _tiles.map((item, index) => {
            if(index === _index) {
                return turn === 1 ? 1 : 2
            } else {
                return item
            }
        })
        
        setTiles(_tiles)

        const winner = getWinner(_tiles)

        if(!winner) {

            const blankTileExist = _tiles.some(item => item === 0)
            if(!blankTileExist) {
                
                setGameOver(true)
                setPlayState(0)

            } else {

                toggleTurn(turn === 1 ? 2 : 1)
                
            }

        } else {

            setWinner(winner)
            setGameOver(true)
            setPlayState(0)

        }

    }

    const procAgent = (gameTiles) => {

        runGameAI(gameTiles).then((gameTiles) => {
            
            // find potential winning move
            
            let tileNo = getNextMove(2, gameTiles)
            if(tileNo >= 0) {

                selectTile(tileNo)

            } else {

                // find player potential winning move

                tileNo = getNextMove(1, gameTiles)
                if(tileNo >= 0) {
                    
                    selectTile(tileNo)

                } else {

                    // empty tiles
                    const list = gameTiles.map((value, index) => ({value, index}))
                        .filter(item => item.value === 0)
                        .map(item => item.index)

                    const list2 = shuffle(list)
                    const index2 = getRandomInt(0, list2.length - 1)

                    selectTile(list2[index2])

                }

            }

        }).catch(error => {

            console.warn(`[AI Error] ${error}`)
            
            setPlayState(0)

        })

    }

    const winnerCaption = () => {

        const winnerKey = winner === 1 ? 'X' : 'O'

        return Localization.locale.indexOf("en") >= 0 ? `The winner is ${winnerKey}!` : `勝者は${winnerKey}です！`

    }

    const actualWidth = dimensions.window.width - (2 * paddingValue) - (2 * marginValue)
    const actualHeight = dimensions.window.height - (2 * paddingValue) - (2 * marginValue) - headerHeight - 50

    const dominantLength = actualWidth > actualHeight ? actualHeight : actualWidth

    const tileSize = (dominantLength - 6)/3
    const textSize = tileSize * 2 / 3
    
    return (
        <View style={[styles.container, {
            backgroundColor: mytheme('container'),
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
                                <TouchableOpacity 
                                activeOpacity={gameOver ? 1 : 0.5} 
                                onPress={handlePress(index)}
                                key={index} 
                                style={[styles.tile, {
                                    width: tileSize,
                                    height: tileSize,
                                    backgroundColor: mytheme('tile'),
                                    borderTopLeftRadius: index === 0 ? 16 : 0,
                                    borderTopRightRadius: index === 2 ? 16 : 0,
                                    borderBottomLeftRadius: index === 6 ? 16 : 0,
                                    borderBottomRightRadius: index === 8 ? 16 : 0,
                                }]}
                                shadowOffset={{height: 1}}
                                shadowColor='#000000'
                                shadowOpacity={0.11}
                                >
                                    <Text style={[styles.tileText,{
                                        fontSize: textSize,
                                        color: mytheme('container'),
                                    }]}>{item === 0 ? '' : item === 1 ? 'X' : 'O'}</Text>
                                </TouchableOpacity>
                            )
                        })
                    }
                    {
                        gameOver &&
                        <View style={styles.gameOver}>
                            <View style={styles.overlay}
                            shadowOffset={{height: 1}}
                            shadowColor='#000000'
                            shadowOpacity={0.11}
                            >
                                <TouchableOpacity onPress={handleReset} style={[styles.gameOverButton, {
                                    borderColor: mytheme('text'),
                                    backgroundColor: theme === 'dark' ? '#3339' : '#fff9',
                                }]}>
                                    <Text style={[styles.gameOverText, { color: mytheme('text') }]}>
                                        { captions('game.again') }
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    }
                    </View>
                </View>
                <View style={styles.info}>
                    {
                        !gameOver &&
                        <Text style={[styles.text, {
                            color: mytheme('text'),
                        }]}>{ captions('game.next') }: {turn === 1 ? 'X' : 'O'} {playState > 0 ? ` ${captions('game.wait')}` : ''}</Text>
                    }
                    {
                        (gameOver && winner > 0) &&
                        <Text style={[styles.text, {
                            color: mytheme('text'),
                        }]}>{ winnerCaption() }</Text>
                    }
                    {
                        (gameOver && winner === 0) &&
                        <Text style={[styles.text, {
                            color: mytheme('text'),
                        }]}>{ captions('game.draw')}</Text>
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
        marginRight: 2,
        marginBottom: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tileText: {
        fontWeight: 'bold',
    },
    text: {
        fontWeight: 'bold',
        fontSize: 20,
    },
    gameOver: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    gameOverButton: {
        borderWidth: 0.5,
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
        borderRadius: 12,
        width: '40%',
    }
})