// shapes.js

/*
 * Draw a triangle
 */
S2D.DrawTriangle = function(x1, y1, c1r, c1g, c1b, c1a,
                            x2, y2, c2r, c2g, c2b, c2a,
                            x3, y3, c3r, c3g, c3b, c3a) {
  
  S2D.GL.DrawTriangle(x1, y1, c1r, c1g, c1b, c1a,
                      x2, y2, c2r, c2g, c2b, c2a,
                      x3, y3, c3r, c3g, c3b, c3a);
};


/*
 * Draw a quad, using two triangles
 */
S2D.DrawQuad = function(x1,  y1,
                        c1r, c1g, c1b, c1a,
                        x2,  y2,
                        c2r, c2g, c2b, c2a,
                        x3,  y3,
                        c3r, c3g, c3b, c3a,
                        x4,  y4,
                        c4r, c4g, c4b, c4a) {
  
  S2D.GL.DrawTriangle(x1, y1, c1r, c1g, c1b, c1a,
                      x2, y2, c2r, c2g, c2b, c2a,
                      x3, y3, c3r, c3g, c3b, c3a);
  
  S2D.GL.DrawTriangle(x3, y3, c3r, c3g, c3b, c3a,
                      x4, y4, c4r, c4g, c4b, c4a,
                      x1, y1, c1r, c1g, c1b, c1a);
};


/*
 * Draw a line from a quad
 */
S2D.DrawLine = function(x1,  y1,  x2,  y2,
                        width,
                        c1r, c1g, c1b, c1a,
                        c2r, c2g, c2b, c2a,
                        c3r, c3g, c3b, c3a,
                        c4r, c4g, c4b, c4a) {
  
  var length = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
  var x = ((x2 - x1) / length) * width / 2;
  var y = ((y2 - y1) / length) * width / 2;
  
  S2D.DrawQuad(
    x1 - y, y1 + x, c1r, c1g, c1b, c1a,
    x1 + y, y1 - x, c2r, c2g, c2b, c2a,
    x2 + y, y2 - x, c3r, c3g, c3b, c3a,
    x2 - y, y2 + x, c4r, c4g, c4b, c4a
  );
};
