'use strict'

import {Game} from './game'

const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')
context.translate(canvas.clientWidth/2, canvas.clientHeight/2)
const snakeGame = new Game(canvas, context, 32, 24)
window.onkeydown = snakeGame.handleKeyInput

snakeGame.init()
