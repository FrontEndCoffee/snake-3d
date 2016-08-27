'use strict'

import _ from 'underscore'
import { Vector, Entity, Line, Rect } from './geometry'
import { Snake } from './snake'

class DrawQueue {
  constructor(){
    this.queue = []
  }
  add(entity, colors) {
    const dist = new Line(entity.position, new Vector(0,0)).length
    this.queue.push({entity, colors, dist})
  }
  reset() {
    this.queue = []
  }
  map(fn) {
    const res = this
    res.queue = this.queue.map(fn)
    return res
  }
  forEach(fn) {
    this.queue.forEach(fn)
  }
  sort(compFn) {
    this.queue.sort(compFn)
  }
  static compareDist(a, b) {
    return b.dist - a.dist
  }
}

const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')
context.translate(canvas.clientWidth/2, canvas.clientHeight/2)
context.lineWidth = 2

const gridHeight = 24
const gridWidth = 32
let drawQueue = new DrawQueue()
let food = genFood()
const snake = new Snake()

window._s = snake
window.onkeydown = e => {
  switch(e.key) {
    case "ArrowUp":
      snake.direction = Snake.DIRECTION_NORTH
      break
    case "ArrowRight":
      snake.direction = Snake.DIRECTION_EAST
      break
    case "ArrowDown":
      snake.direction = Snake.DIRECTION_SOUTH
      break
    case "ArrowLeft":
      snake.direction = Snake.DIRECTION_WEST
      break
  }
}

setInterval(update , 300)

function update() {
  const snakePos = new Vector(
    snake.position.x * canvas.width/gridWidth,
    snake.position.y * canvas.height/gridHeight
  )
  if (_.isEqual(food.position, snakePos)) {
    snake.update(true)
    food = genFood()
  } else {
    snake.update()
  }

  if (snake.position.x > gridWidth/2 ||
      snake.position.y > gridHeight/2 ||
      snake.position.x < -gridWidth/2 ||
      snake.position.y < -gridHeight/2) {
        snake.die()
      }
}


// draw loop
function redraw() {

  context.clearRect(-canvas.width/2, -canvas.height/2, canvas.width, canvas.height)

  snake.segments
    .map(vector => genPx(vector.x, vector.y))
    .forEach(rect => drawQueue.add(rect, ['orangered', 'darkred']))

  drawQueue.add(food, ['lime', 'green'])

  // draw all queued entities
  drawQueue.sort(DrawQueue.compareDist)
  drawQueue.forEach(item => {
    item.entity.fill3d(context, item.colors[0], item.colors[1])
  })
  drawQueue.reset()

  requestAnimationFrame(redraw)
}

redraw()

// functions

function genFood() {
  const h = gridHeight/2-2
  const w = gridWidth/2-2
  const x = rand(-w,w)
  const y = rand(-h,h)
  return genPx(x,y)
}

function genPx(x, y) {
  const xScl = canvas.width / gridWidth
  const yScl = canvas.height / gridHeight
  return new Rect(xScl, yScl, x*xScl, y*yScl)
}

function rand(min,max) {
  return (Math.random()*(max+1-min)|0) + min
}
