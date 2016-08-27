'use strict'

import _ from 'underscore'
import { Vector, Entity, Line, Rect } from './geometry'
import { Snake } from './snake'

export class Game {

  constructor(canvas, context, gridWidth, gridHeight) {
    this.gridHeight = gridHeight
    this.gridWidth = gridWidth
    this.context = context
    this.canvas = canvas
    this.snake = new Snake(this)
    this.drawQueue = new DrawQueue()
    this.food = this.genFood()
  }

  init() {
    this.update(this)
    this.redraw(this)
  }

  newFood() {
    this.food = this.genFood()
  }

  update(game) {
    const snakePos = new Vector(
      this.snake.position.x * this.canvas.width/this.gridWidth,
      this.snake.position.y * this.canvas.height/this.gridHeight
    )
    if (_.isEqual(this.food.position, snakePos)) {
      this.snake.update(true)
      this.newFood()
    } else {
      this.snake.update()
    }

    if (this.snake.position.x > this.gridWidth/2 ||
        this.snake.position.y > this.gridHeight/2 ||
        this.snake.position.x < -this.gridWidth/2 ||
        this.snake.position.y < -this.gridHeight/2) {
          this.snake.die()
    }

    setTimeout(
      () => game.update(game),
      500 * Math.pow(0.9, window.score)
    )
  }

  redraw(game) {
    this.context.clearRect(
      -this.canvas.width/2,
      -this.canvas.height/2,
      this.canvas.width,
      this.canvas.height
    )
    this.snake.segments
      .map(vector => this.genPx(vector.x, vector.y))
      .forEach(rect => this.drawQueue.add(rect, ['orangered', 'darkred']))

    this.drawQueue.add(this.food, ['lime', 'green'])

    // draw all queued entities
    this.drawQueue.sort(DrawQueue.compareDist)
    this.drawQueue.forEach(item => {
      item.entity.fill3d(this.context, item.colors[0], item.colors[1])
    })
    this.drawQueue.reset()

    requestAnimationFrame(() => game.redraw(game))
  }

  handleKeyInput(event, game) {
    switch(event.key) {
      case "ArrowUp":
        game.snake.direction = Snake.DIRECTION_NORTH
        break
      case "ArrowRight":
        game.snake.direction = Snake.DIRECTION_EAST
        break
      case "ArrowDown":
        game.snake.direction = Snake.DIRECTION_SOUTH
        break
      case "ArrowLeft":
        game.snake.direction = Snake.DIRECTION_WEST
        break
    }
  }

  genFood() {
    const h = this.gridHeight/2-2
    const w = this.gridWidth/2-2
    const x = _.random(-w,w)
    const y = _.random(-h,h)
    return this.genPx(x,y)
  }

  genPx(x, y) {
    const xScl = this.canvas.width / this.gridWidth
    const yScl = this.canvas.height / this.gridHeight
    return new Rect(xScl, yScl, x*xScl, y*yScl)
  }
}

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
