'use strict'

import _ from 'underscore'
import { v, entity, line, rect } from './geometry'
import * as s from './snake'

export function game(params) {
  const {canvas, context, gridWidth, gridHeight} = params,
        X_SCL = canvas.width / gridWidth,
        Y_SCL = canvas.height / gridHeight,
        snake = s.snake(),
        renderQueue = drawQueue(),

        update = () => {
          // determine positions of food and snake head
          const foodPos = food.getPos().scale(v(1/X_SCL, 1/Y_SCL)),
                headPos = snake.getPos().add(snake.getDir())

          // handle eating logic
          if (headPos.equals(foodPos)) {
            snake.update(true)
            food = generateFood()
          } else {
            snake.update()
          }

          // check for level border collision
          if (snake.getPos().getX() > gridWidth/2 ||
              snake.getPos().getY() > gridHeight/2 ||
              snake.getPos().getX() < -gridWidth/2 ||
              snake.getPos().getY() < -gridHeight/2) {
                snake.die()
          }

          // handle timing logic
          setTimeout(update, 500 * Math.pow(0.9, window.score))
        },
        redraw = () => {
          // clear frame
          context.clearRect(
            -canvas.width/2, -canvas.height/2, canvas.width, canvas.height
          )
          // prepare snake for drawing
          snake.getTail()
               .map(vec => genPx(vec.getX(), vec.getY()))
               .forEach(rect => renderQueue.add(rect, ['orangered', 'darkred']))
          // prepare food for drawing
          renderQueue.add(food, ['lime', 'green'])

          // draw queue
          renderQueue.sort()
          renderQueue.forEach(item =>
            item.entity.fill3d(context, item.colors[0], item.colors[1]))
          renderQueue.reset()

          requestAnimationFrame(redraw)
        },
        genPx = (x,y) => rect(x * X_SCL, y * Y_SCL, X_SCL, Y_SCL),
        generateFood = () => {
          const h = gridHeight/2-2,
                w = gridWidth/2-2,
                x = _.random(-w,w),
                y = _.random(-h,h)
          return genPx(x,y)
        }
  let food = generateFood()

  return {
    init: () => {
      update()
      redraw()
    },
    handleKeyInput: e => {
      switch(e.key) {
        case "ArrowUp": snake.setDir(s.DIRECTION_NORTH); break
        case "ArrowRight": snake.setDir(s.DIRECTION_EAST); break
        case "ArrowDown": snake.setDir(s.DIRECTION_SOUTH); break
        case "ArrowLeft": snake.setDir(s.DIRECTION_WEST); break
      }
    }
  }
}

function drawQueue(queue) {
  let _queue = queue || []
  return {
    reset: () => _queue = [],
    add: (entity, colors) => {
      const dist = line(entity.getPos(), v(0,0)).length()
      _queue.push({entity, colors, dist})
    },
    map: fn => drawQueue(_queue.map(fn)),
    forEach: fn => _queue.forEach(fn),
    sort: () => _queue.sort((a,b) => b.dist - a.dist)
  }
}
