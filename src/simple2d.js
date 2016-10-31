// simple2d.js

// Simple 2D OpenGL namespace
S2D.GL = {};

// Simple 2D definitions
Object.defineProperty(S2D, "KEYDOWN", { value: 1 });
Object.defineProperty(S2D, "KEY",     { value: 2 });
Object.defineProperty(S2D, "KEYUP",   { value: 3 });

// Color
S2D.Color = {
  r: 1.0,
  g: 1.0,
  b: 1.0,
  a: 1.0
};

// Window
S2D.Window = {
  title:  null,
  width:  null,
  height: null,
  update: null,
  render: null,
  on_key: null, 
  on_mouse: null, 
  element: null,  // The HTML element to append the canvas
  canvas: null,
  background: null
};

// Image
S2D.Image = {
  texture: null,
  data: null,
  color: null,
  x: 0,
  y: 0,
  width: null,
  height: null,
  orig_width: null,
  orig_height: null
};
