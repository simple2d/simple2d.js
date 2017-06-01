// shapes.js

/*
 * Draw a triangle
 */
S2D.DrawTriangle = function(x1, y1, r1, g1, b1, a1,
                            x2, y2, r2, g2, b2, a2,
                            x3, y3, r3, g3, b3, a3) {

  S2D.GL.DrawTriangle(x1, y1, r1, g1, b1, a1,
                      x2, y2, r2, g2, b2, a2,
                      x3, y3, r3, g3, b3, a3);
};


/*
 * Draw a quad, using two triangles
 */
S2D.DrawQuad = function(x1, y1, r1, g1, b1, a1,
                        x2, y2, r2, g2, b2, a2,
                        x3, y3, r3, g3, b3, a3,
                        x4, y4, r4, g4, b4, a4) {

  S2D.GL.DrawTriangle(x1, y1, r1, g1, b1, a1,
                      x2, y2, r2, g2, b2, a2,
                      x3, y3, r3, g3, b3, a3);

  S2D.GL.DrawTriangle(x3, y3, r3, g3, b3, a3,
                      x4, y4, r4, g4, b4, a4,
                      x1, y1, r1, g1, b1, a1);
};


/*
 * Draw a line from a quad
 */
S2D.DrawLine = function(x1,  y1,  x2,  y2,
                        width,
                        r1, g1, b1, a1,
                        r2, g2, b2, a2,
                        r3, g3, b3, a3,
                        r4, g4, b4, a4) {

  var length = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
  var x = ((x2 - x1) / length) * width / 2;
  var y = ((y2 - y1) / length) * width / 2;

  S2D.DrawQuad(
    x1 - y, y1 + x, r1, g1, b1, a1,
    x1 + y, y1 - x, r2, g2, b2, a2,
    x2 + y, y2 - x, r3, g3, b3, a3,
    x2 - y, y2 + x, r4, g4, b4, a4
  );
};
