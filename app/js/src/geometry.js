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
  stroke(context, color) {
    const oldColor = context.strokeStyle
    context.strokeStyle = color
    context.beginPath()
    context.moveTo(this.v1.x, this.v1.y)
    context.lineTo(this.v2.x, this.v2.y)
    context.stroke()
    context.strokeStyle = oldColor
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

export const PERSPECTIVE_CONSTANT = 0.875
export class Entity {

  constructor(vertecies, posVector) {
    this.position = posVector
    this.vertecies = vertecies
  }
  get absVertecies() {
    return this.vertecies.map(vector => vector.add(this.position))
  }
  get perspectiveVertecies() {
    return this.absVertecies.map(vertex => new Vector(
      vertex.x * PERSPECTIVE_CONSTANT,
      vertex.y * PERSPECTIVE_CONSTANT
    ))
  }
  translate(x,y) {
    this.position = this.position.add(new Vector(x,y))
  }
  fill(context, color) {
    const oldStyle = context.fillStyle
    context.fillStyle = color
    context.beginPath()
    this.absVertecies.forEach((v, i) => {
      if (i === 0) {
        context.moveTo(v.x, v.y)
      } else {
        context.lineTo(v.x, v.y)
      }
    })
    context.fill()
    context.fillStyle = oldStyle
  }
  stroke(context, color) {
    strokePoly(this.absVertecies, context, color)
  }
  stroke3d(context, fgColor, bgColor) {
    const oldStyle = context.strokeStyle
    strokePoly(this.perspectiveVertecies, context, bgColor)
    this.absVertecies.forEach((vertex, i) => {
      const vertex2 = this.perspectiveVertecies[i]
      new Line(vertex, vertex2).stroke(context, bgColor)
    })
    strokePoly(this.absVertecies, context, fgColor)
  }
  fill3d(context, fgColor, bgColor) {
    const entity = this
    this.perspectiveVertecies.forEach(function(currBackVertex, i, vertecies) {
      const nextBackVertex = vertecies[(i + 1) % vertecies.length]
      const currFrontVertex = entity.absVertecies[i]
      const nextFrontVertex = entity.absVertecies[(i + 1) % entity.absVertecies.length]
      fillPoly([
        currFrontVertex,
        nextFrontVertex,
        nextBackVertex,
        currBackVertex
      ], context, bgColor)
    })
    fillPoly(entity.absVertecies, context, fgColor)
  }
}

export class Rect extends Entity {
  constructor(width = 100, height = 100, xPos = 0, yPos = 0) {
    super([
      new Vector( width/2, -height/2),
      new Vector( width/2,  height/2),
      new Vector(-width/2,  height/2),
      new Vector(-width/2, -height/2)
    ], new Vector(xPos, yPos))
  }
}

// functions

function strokePoly(polygon, context, color) {
  polygon.forEach((curr, i, vertList) => {
    const next = vertList[ (i + 1) % vertList.length ]
    new Line(curr, next).stroke(context, color)
  })
}

function fillPoly(polygon, context, color) {
  const oldColor = context.fillStyle
  context.fillStyle = color
  context.beginPath()
  polygon.forEach((v, i) => {
    if (i === 0) {
      context.moveTo(v.x, v.y)
    } else {
      context.lineTo(v.x, v.y)
    }
  })
  context.fill()
  context.fillStyle = oldColor
}
