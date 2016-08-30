'use strict'

import {v} from './geometry'
import _ from 'underscore'

export const DIRECTION_NORTH = v(0,-1)
export const DIRECTION_EAST = v(1,0)
export const DIRECTION_SOUTH = v(0,1)
export const DIRECTION_WEST = v(-1,0)

export function snake() {
  let _pos = v(0,0),
      _tail = [],
      _dir = DIRECTION_NORTH
  const die = () => {
    window.deaths++
    window.score = 0
    window.updateScore()
    _pos = v(0,0)
    _tail = []
    _dir = DIRECTION_NORTH
  }
  return {
    die: die,
    setDir: dir => _dir = dir,
    update: (grow = false) => {
      // get coordinates for new tail segment
      const tailEndPos = _tail[_tail.length-1] || _pos
      // update the scoreboard
      if (grow) {
        window.score++
        if (window.score > window.highscore) {
          window.highscore = window.score
        }
        window.updateScore()
      }
      // move the tail segments
      _tail = _tail.map((vec, i) => (i===_tail.length-1) ? _pos : _tail[i+1])
      // move the head
      _pos = _pos.add(_dir)
      // add a new segment
      if (grow) _tail.unshift(tailEndPos)
      // check for self collision
      _tail.forEach(vec => {if (_.isEqual(_pos, vec)) die()})
    },
    getTail: () => _tail.concat([_pos]),
    getPos: () => _pos
  }
}
