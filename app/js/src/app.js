'use strict'

import {Game} from './game'

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
const snakeGame = new Game(canvas, context, 32, 24)
window.onkeydown = event => snakeGame.handleKeyInput(event, snakeGame)

snakeGame.init()
window.updateScore()
