import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Text } from 'react-native'

//  components
import BackgroundContainer from '../components/BackgroundContainer'
import AlertModal from '../components/AlertModal'
import Cell from '../components/Cell'

//  utils
import { copyArray } from '../utils/copyArray'

const Game = () => {
  const initialState = [
    ['', '', ''], // 1st row
    ['', '', ''], // 2st row
    ['', '', ''] // 3st row
  ]

  const [grid, setGrid] = useState(initialState)

  const [currentTurn, setCurrentTurn] = useState('x')

  const [message, setMessage] = useState('')

  useEffect(() => {
    if (currentTurn === 'o') {
      setTimeout(() => {
        botTurn()
      }, 500)
    }
  }, [currentTurn])

  useEffect(() => {
    const winner = getWinner(grid)

    if (winner) {
      gameWon(winner)
    } else {
      checkTieState()
    }
  }, [grid])

  const onPress = (rowIndex, columnIndex) => {
    if (grid[rowIndex][columnIndex] !== '') {
      console.log('position already occupied')
    } else {
      setGrid((existingGrid) => {
        const updateGrid = [...existingGrid]
        updateGrid[rowIndex][columnIndex] = currentTurn
        return updateGrid
      })

      setCurrentTurn(currentTurn === 'x' ? 'o' : 'x')
    }
  }

  const getWinner = (winnerGrid) => {
    //  check rows
    for (let row = 0; row < 3; row++) {
      const isRowXWinning = winnerGrid[row].every(cell => cell === 'x')

      const isRowOWinning = winnerGrid[row].every(cell => cell === 'o')

      if (isRowXWinning) return 'x'

      if (isRowOWinning) return 'o'
    }

    //  checks colums
    for (let col = 0; col < 3; col++) {
      let isColumnXwinner = true
      let isColumnOwinner = true

      for (let row = 0; row < 3; row++) {
        if (winnerGrid[row][col] !== 'x') {
          isColumnXwinner = false
        }
        if (winnerGrid[row][col] !== 'o') {
          isColumnOwinner = false
        }
      }

      if (isColumnXwinner) return 'x'

      if (isColumnOwinner) return 'o'
    }

    //  check diagonals
    let isDiagonalLeftOWinning = true
    let isDiagonalLeftXWinning = true
    let isDiagonalRightOWinning = true
    let isDiagonalRightXWinning = true

    for (let i = 0; i < 3; i++) {
      if (winnerGrid[i][i] !== 'o') {
        isDiagonalLeftOWinning = false
      }

      if (winnerGrid[i][i] !== 'x') {
        isDiagonalLeftXWinning = false
      }

      if (winnerGrid[i][2 - i] !== 'o') {
        isDiagonalRightOWinning = false
      }

      if (winnerGrid[i][2 - i] !== 'x') {
        isDiagonalRightXWinning = false
      }
    }

    if (isDiagonalLeftXWinning || isDiagonalRightXWinning) return 'x'

    if (isDiagonalLeftOWinning || isDiagonalRightOWinning) return 'o'
  }

  const checkTieState = () => {
    if (!grid.some(row => row.some(cell => cell === ''))) inATie()
  }

  const gameWon = (player) => setMessage(`🏆  Player ${player.toLocaleUpperCase()} Win!`)

  const inATie = () => setMessage('(⊙_⊙;)  its a tie!')

  const resetGame = () => {
    setGrid(initialState)
    setCurrentTurn('x')
    setMessage('')
  }

  const botTurn = () => {
    //  collect all possible options
    const possibleOptions = []
    grid.forEach((row, rowIndex) => (
      row.forEach((cell, columnIndex) => {
        if (cell === '') {
          possibleOptions.push({ row: rowIndex, col: columnIndex })
        }
      })
    ))

    let chooseOptions

    //  ↓↓↓ check if the opponents Wins if it takes one of the possible positions ↓↓↓

    //  attack
    possibleOptions.forEach((possibleOption) => {
      const copyGrid = copyArray(grid)

      copyGrid[possibleOption.row][possibleOption.col] = 'o'

      const winner = getWinner(copyGrid)

      if (winner === 'o') {
        //  attack that position
        chooseOptions = possibleOption
      }
    })

    if (!chooseOptions) {
      //  defend
      possibleOptions.forEach((possibleOption) => {
        const copyGrid = copyArray(grid)

        copyGrid[possibleOption.row][possibleOption.col] = 'x'

        const winner = getWinner(copyGrid)

        if (winner === 'x') {
          //  defend that position
          chooseOptions = possibleOption
        }
      })
    }

    //  choose random
    if (!chooseOptions) {
      chooseOptions = possibleOptions[Math.floor(Math.random() * possibleOptions.length)]
    }

    if (chooseOptions) {
      onPress(chooseOptions.row, chooseOptions.col)
    }
  }

  return (
    <BackgroundContainer>
      <View onPres={() => console.log('touch')} style={styles.currentTurnContainer}>
        <Text style={styles.currentTurn}>Current turn: </Text>
        <Text style={[styles.currentTurn, { color: currentTurn === 'x' ? 'blue' : 'red', fontWeight: '700' }]}>
          {currentTurn.toLocaleUpperCase()}
        </Text>
      </View>
      <View style={styles.gridContainer}>
        {grid.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.row}>
            {row.map((cell, columnIndex) => (
              <Cell
                key={`row-${rowIndex}-column-${columnIndex}`}
                onPress={() => onPress(rowIndex, columnIndex)}
                cell={cell}
              />
            ))}
          </View>
        ))}
      </View>
      <AlertModal
        visible={!!message}
        message={message}
        button
        onPressButton={resetGame}
      />
    </BackgroundContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#242D34'
  },

  background: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 18
  },

  currentTurnContainer: {
    flexDirection: 'row',
    position: 'absolute',
    top: 50
  },

  currentTurn: {
    fontSize: 32,
    color: '#fff'
  },

  gridContainer: {
    width: '85%',
    aspectRatio: 1
  },

  row: {
    flex: 1,
    flexDirection: 'row',
    margin: 4
  }
})

export default Game
