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
