'use strict'

function Vector(x,y) {
  this.x = x
  this.y = y
}
Vector.prototype.add = function(vector) {
  return new Vector(
    this.x + vector.x,
    this.y + vector.y
  )
}

function Line(v1, v2) {
  this.v1 = v1
  this.v2 = v2
}
Line.prototype.getDeltaX = function() {
  return this.v2.x - this.v1.x
}
Line.prototype.getDeltaY = function() {
  return this.v2.y - this.v1.y
}
Line.prototype.getLength = function() {
  return Math.sqrt(
    Math.pow(this.getDeltaX(), 2) +
    Math.pow(this.getDeltaY(), 2)
  )
}

function Polygon(vectors) {
  if (vectors.length < 3) throw 'Polygon must have at least 3 verticies'
  this.verticies = vectors
}

function Entity(shape, position) {
  this.shape = shape
  this.position = position
}
Entity.prototype.getVerticies = function() {
  const position = this.position
  return this.shape.verticies.map(function(vertexVector) {
    return vertexVector.add(position)
  })
}
Entity.prototype.translate = function(vector) {
  this.position = this.position.add(vector)
}

module.exports = {
  Vector: Vector,
  Line: Line,
  Polygon: Polygon,
  Entity: Entity
}
