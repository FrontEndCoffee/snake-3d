'use strict'

import {game} from './game'

const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')
context.translate(canvas.clientWidth/2, canvas.clientHeight/2)
window.score = 0
window.highscore = 0
window.deaths = 0
window.updateScore = () => {
  document.getElementById('score').innerText = 'score: '+ window.score
  document.getElementById('highscore').innerText = 'highscore: '+ window.highscore
  document.getElementById('death').innerText = 'death count: '+ window.deaths
}
const snakeGame = game({
  canvas,
  context,
  gridWidth: 32,
  gridHeight: 24
})
window.onkeydown = snakeGame.handleKeyInput

snakeGame.init()
window.updateScore()
