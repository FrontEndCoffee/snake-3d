'use strict'

const PERSPECTIVE_CONSTANT = 0.875

const shapes = require('./shapes')
const Vector = shapes.Vector
const Line = shapes.Line
const Polygon = shapes.Polygon
const Entity = shapes.Entity

const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')

const canvasSize = new Vector(canvas.clientWidth, canvas.clientHeight)

const blockSize = new Vector(150, 200)


const position = new Vector(0,0)
const blockShape = new Polygon([
  new Vector( 64,  64),
  new Vector( 64, -64),
  new Vector(-64, -64),
  new Vector(-64,  64)
])

const blockEntity = new Entity(blockShape, position)
blockEntity.position = new Vector(12, 23)


// init
context.translate(canvasSize.x/2, canvasSize.y/2)
context.fillStyle = "rgba(255,255,255,0.9)"
window.ctx = context

window.onmousemove = function(e) {

  const mousePos = new Vector(
    e.clientX - canvas.offsetLeft,
    e.clientY - canvas.offsetTop
  )

  clearFrame()
  drawCursor(mousePos)

  blockEntity.position = mousePos

  // create shadow Entity
  const line = new Line(
    blockEntity.position,
    new Vector(0,0)
  )

  const blockShadowEntity = new Entity(
    blockEntity.verticies,
    blockEntity.position
  )

  const frontpaneVertecies = blockEntity.getVerticies()
  const backpaneVertecies = frontpaneVertecies.map(addPerspective)


  // draw backpane dots (#777)
  context.fillStyle = '#777'
  backpaneVertecies.forEach(function(vertexVector) {
    context.fillRect(vertexVector.x-1, vertexVector.y-1, 3, 3)
  })

  // draw backpane lines (#777)
  context.strokeStyle = '#777'
  backpaneVertecies.forEach(function(vertexVector, i, vertecies) {
    const nextVertex = vertecies[(i + 1) % vertecies.length]
    drawLine(vertexVector, nextVertex)
  })

  // draw middle lines (#bbb)
  context.strokeStyle = '#bbb'
  backpaneVertecies.forEach(function(vertexVector, i) {
    const frontpaneVertex = frontpaneVertecies[i]
    drawLine(vertexVector, frontpaneVertex)
  })

  // draw frontpane lines (#fff)
  context.strokeStyle = '#fff'
  frontpaneVertecies.forEach(function(vertexVector, i, vertecies) {
    const nextVertex = vertecies[(i + 1) % vertecies.length]
    drawLine(vertexVector, nextVertex)
  })

  // draw frontpane dots (#fff)
  context.fillStyle = '#fff'
  frontpaneVertecies.forEach(function(vertexVector) {
    context.fillRect(vertexVector.x-1, vertexVector.y-1, 3, 3)
  })


}

function clearFrame() {
  context.clearRect(
    -canvasSize.x/2,
    -canvasSize.y/2,
    canvasSize.x,
    canvasSize.y
  )
}

function drawLine(vector1, vector2) {
  context.beginPath()
  context.moveTo(vector1.x, vector1.y)
  context.lineTo(vector2.x, vector2.y)
  context.stroke()
}

function addPerspective(vertexVector) {
  return new Vector(
    vertexVector.x * PERSPECTIVE_CONSTANT,
    vertexVector.y * PERSPECTIVE_CONSTANT
  )
}

function drawCursor(mousePosVec) {
  const oldStyle = context.fillStyle
  context.fillStyle = '#fff'
  context.fillRect(mousePosVec.x-5, mousePosVec.y-1, 10, 2)
  context.fillRect(mousePosVec.x-1, mousePosVec.y-5, 2, 10)
  context.fillStyle = oldStyle
}
