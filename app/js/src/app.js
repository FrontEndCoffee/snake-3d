'use strict'

import { Vector, Entity, Rect } from './geometry'

const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')

context.translate(canvas.clientWidth/2, canvas.clientHeight/2)
context.lineWidth = 2

new Rect(100, 100, -150, -50).stroke3d(context, 'dodgerblue', 'darkblue')
new Rect(100, 100,  150,   0).fill3d(context, 'orangered', 'darkred')
new Rect(100, 100, -300, 100).fill3d(context, 'dodgerblue', 'darkblue')
new Rect(100, 100,  300, 100).stroke3d(context, 'orangered', 'darkred')

const hexagon = new Entity(
  [
    new Vector(-35,50), new Vector( 35,50),
    new Vector(60,0), new Vector(35,-50),
    new Vector(-35,-50), new Vector(-60,0)
  ],
  new Vector(100,150)
)
hexagon.stroke3d(context, 'lime', 'green')

const star = new Entity(
  [
    new Vector(0,-120), new Vector(20,-40),
    new Vector(100,-40), new Vector(40,20),
    new Vector(60,100), new Vector(0,60),
    new Vector(-60,100), new Vector(-40,20),
    new Vector(-100,-40), new Vector(-20,-40)
  ],
  new Vector(-100, 150)
)
star.fill3d(context, 'magenta', 'purple')

const trianglePath = [new Vector(0,-20), new Vector(30,20), new Vector(-30,20)]
new Entity(trianglePath, new Vector(70, -140)).fill3d(context, 'yellow', 'orange')
new Entity(trianglePath, new Vector(100, -100)).fill3d(context, 'yellow', 'orange')
new Entity(trianglePath, new Vector(40, -100)).fill3d(context, 'yellow', 'orange')
