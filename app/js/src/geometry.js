'use strict'

export const PERSPECTIVE_CONSTANT = 0.950
export const ADDED_THIKNESS = -0.1

export function v(x, y) {
  const _x = x,
      _y = y
  return {
    getX: () => _x,
    getY: () => _y,
    add: vec => v(_x + vec.getX(), _y + vec.getY())
  }
}

export function line(v1, v2) {
  const _v1 = v1,
        _v2 = v2,

        dX = () => _v2.getX() - _v1.getX(),
        dY = () => _v2.getY() - _v1.getY()
  return {
    stroke: (context, color) => {
      const oldColor = context.strokeStyle
      context.strokeStyle = color
      context.beginPath()
      context.moveTo(_v1.getX(), _v1.getY())
      context.lineTo(_v2.getX(), _v2.getY())
      context.stroke()
      context.strokeStyle = oldColor
    },
    dX: dX,
    dY: dY,
    length: () => Math.sqrt( Math.pow( dX(), 2 ) + Math.pow( dY(), 2 ) )
  }
}

export function entity(verts, pos) {
  let _pos = pos
  const _verts = verts,
        absVerts = () => _verts.map(x => x.add(_pos)),
        bgVerts = () => absVerts().map(vec => v(
          vec.getX() * PERSPECTIVE_CONSTANT + ADDED_THIKNESS,
          vec.getY() * PERSPECTIVE_CONSTANT + ADDED_THIKNESS
        )),
        strokePoly = (verts, context, color) => {
          verts.foreach((curr, i) => {
            const next = verts[ (i + 1) % verts.length ]
            line(curr, next).stroke(context, color)
          })
        },
        fillPoly = (verts, context, color) => {
          const oldColor = context.fillStyle
          context.fillStyle = color
          context.beginPath()
          verts.forEach((vec, i) => {
            if (i === 0) {
              context.moveTo(vec.getX(), vec.getY())
            } else {
              context.lineTo(vec.getX(), vec.getY())
            }
          })
          context.fill()
          context.fillStyle = oldColor
        }
  return {
    translate: (x,y) => _pos = _pos.add( v(x,y) ),
    fill: (context, color) => fillPoly(_verts, context, color),
    stroke: (context, color) => strokePoly(_verts, context, color),
    fill3d: (context, fgColor, bgColor) => {
      bgVerts().forEach((currBack, i) => {
        const nextBack = bgVerts()[(i+1)%bgVerts().length],
              currFront = absVerts()[i],
              nextFront = absVerts()[(i+1)%absVerts().length]
        fillPoly([currFront, nextFront, nextBack, currBack], context, bgColor)
      })
      fillPoly(absVerts(), context, fgColor)
    },
    getPos: () => _pos
  }
}

export function rect(x,y,w,h) {
  return entity([v(w/2,-h/2), v(w/2,h/2), v(-w/2,h/2), v(-w/2,-h/2)], v(x,y))
}
