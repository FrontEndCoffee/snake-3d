'use strict'

import {Vector} from './geometry'
import _ from 'underscore'

export class Snake {

  static get DIRECTION_NORTH() { return new Vector(0,-1) }
  static get DIRECTION_EAST() { return new Vector(1,0) }
  static get DIRECTION_SOUTH() { return new Vector(0,1) }
  static get DIRECTION_WEST() { return new Vector(-1,0) }

  constructor(game) {
    this.game = game
    this.position = new Vector(0,0)
    this.tail = []
    this.direction = Snake.DIRECTION_NORTH
  }

  update(grow = false) {

    const tailEndPos = (this.tail[this.tail.length-1] || this).position
    const snake = this

    if (grow) {
      window.score++
      if (window.score > window.highscore) {
        window.highscore = window.score
      }
      window.updateScore()
    }

    this.tail = this.tail.map((segment, i) => {
      if (i===snake.tail.length-1) {
        segment.position = snake.position
      } else {
        segment.position = snake.tail[i+1].position
      }
      return segment
    })

    this.position = this.position.add(this.direction)
    if (grow) this.tail.unshift(new SnakeSegment(tailEndPos))

    this.tail.forEach(segment => {
      if (_.isEqual(snake.position, segment.position)) {
        snake.die()
      }
    })
  }

  die() {
    window.deaths++
    window.score = 0
    window.updateScore()
    this.constructor()
  }

  get segments() {
    return [this.position].concat(
      this.tail.map(segment => segment.position)
    )
  }

}
export class SnakeSegment {
  constructor(pos) {
    this.position = pos
  }
}
