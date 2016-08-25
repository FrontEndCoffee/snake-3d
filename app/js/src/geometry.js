'use strict'

export class Vector {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
  add(vector) {
    return new Vector(
      this.x + vector.x,
      this.y + vector.y
    )
  }
}

export class Line {
  constructor(v1, v2) {
    this.v1 = v1
    this.v2 = v2
  }
  draw(context, color) {
    const oldColor = context.strokeStyle
    context.strokeStyle = color
    context.beginPath()
    context.moveTo(v1.x, v1.y)
    context.lineTo(v2.x, v2.y)
    context.stroke()
    context.strokeStyle = oldStyle
  }
  get dX() {
    return this.v2.x - this.v1.x
  }
  get dY() {
    return this.v2.y - this.v1.y
  }
  get length() {
    return Math.sqrt(
      Math.pow(this.getDeltaX(), 2) +
      Math.pow(this.getDeltaY(), 2)
    )
  }
}

export class Entity {
  constructor(vertexVectors, posVector) {
    this.position = posVector
    this.vertexVectors = vertexVectors
  }
  get vectorVectors() {
    return this.vertexVectors.map(vector => vector.add(this.position))
  }
  get translate(deltaPos) {
    this.position = position.add(deltaPos)
  }
}

export class Rect extends Entity {
  constructor(size = 100, position = new Vector(0,0)) {
    super([
      new Vector( size/2, -size/2),
      new Vector( size/2,  size/2),
      new Vector(-size/2,  size/2),
      new Vector(-size/2, -size/2)
    ], position)
  }
}
