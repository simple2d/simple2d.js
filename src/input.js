// input.js

/*
 * Get the mouse coordinates relative to the viewport
 */
S2D.GetMouseOnViewport = function(win, wx, wy) {
  
  var scale;  // viewport scale factor
  var w, h;   // width and height of scaled viewport
  var x, y;   // mouse positions to be returned
  
  switch (win.viewport.mode) {
    
    case S2D.FIXED:
      x = wx / (win.orig_width  / win.viewport.width);
      y = wy / (win.orig_height / win.viewport.height);
      break;
    
    case S2D.SCALE:
      var o = S2D.GL.GetViewportScale(win);
      x = wx * 1 / o.scale - (win.width  - o.w) / (2.0 * o.scale);
      y = wy * 1 / o.scale - (win.height - o.h) / (2.0 * o.scale);
      break;
    
    case S2D.STRETCH:
      x = wx * win.viewport.width  / win.width;
      y = wy * win.viewport.height / win.height;
      break;
  }
  
  return {
    x: x,
    y: y
  };
};


/*
 * Get the mouse button name from its code
 */
S2D.GetMouseButtonName = function(code) {
  switch (code) {
    case 0:
      return S2D.MOUSE_LEFT;
    case 1:
      return S2D.MOUSE_MIDDLE;
    case 2:
      return S2D.MOUSE_RIGHT;
    case 3:
      return S2D.MOUSE_X1;
    case 4:
      return S2D.MOUSE_X2;
  }
};
