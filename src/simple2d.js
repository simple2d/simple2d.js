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
  title: null,
  width: null,
  height: null,
  update: null,
  render: null,
  mouse: {
    x: 0,
    y: 0
  },
  on_key: null, 
  on_mouse: null, 
  element: null,  // The HTML element to append the canvas
  canvas: null,
  background: null,
  frames: 0,
  close: false
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

// Sprite
S2D.Sprite = {
  img: null,
  x: 0,
  y: 0,
  width: null,
  height: null,
  tx1: null,
  ty1: null,
  tx2: null,
  ty2: null,
  tx3: null,
  ty3: null,
  tx4: null,
  ty4: null
};

// Text
S2D.Text = {
  texture: null,
  data: null,
  color: null,
  x: 0,
  y: 0,
  width: null,
  height: null,
  font: null,
  size: null,
  msg: null
};

// Sound
S2D.Sound = {
  data: null
};

// Music
S2D.Music = {
  data: null
};

// Global current music playing
S2D.current_music = null;

// Collection of keys currently pressed
S2D.keys_down = [];

// On keyboard starting at top row, left to right
S2D.key_map = {
  27: "Escape",
  
  192: "`",
  189: "-",
  187: "=",
  8:   "Backspace",
  
  9:   "Tab",
  219: "[",
  221: "]",
  220: "\\",
  
  20:  "CapsLock",
  186: ";",
  222: "'",
  13:  "Return",
  
  16:  "Shift",
  188: ",",
  190: ".",
  191: "/",
  
  17:  "Ctrl",
  18:  "Option",
  91:  "Left Command",
  32:  "Space",
  93:  "Right Command",
  37:  "Left",
  38:  "Up",
  39:  "Right",
  40:  "Down"
};

// Web-specific helpers

// Looks up a key from a given keycode
S2D.GetKey = function(keycode) {
  if (typeof(keycode) == "string") {
    return keycode;
  } else if (S2D.key_map[keycode]) {
    return S2D.key_map[keycode];
  } else {
    return String.fromCharCode(keycode);
  }
};

// Trim transparent pixels from canvas
// Adapted from: https://gist.github.com/remy/784508
S2D.TrimCanvas = function(c) {
  var ctx = c.getContext('2d'),
    copy = document.createElement('canvas').getContext('2d'),
    pixels = ctx.getImageData(0, 0, c.width, c.height),
    l = pixels.data.length,
    i,
    bound = {
      top: null,
      left: null,
      right: null,
      bottom: null
    },
    x, y;
  
  for (i = 0; i < l; i += 4) {
    if (pixels.data[i+3] !== 0) {
      x = (i / 4) % c.width;
      y = ~~((i / 4) / c.width);
      
      if (bound.top === null) {
        bound.top = y;
      }
      
      if (bound.left === null) {
        bound.left = x; 
      } else if (x < bound.left) {
        bound.left = x;
      }
      
      if (bound.right === null) {
        bound.right = x; 
      } else if (bound.right < x) {
        bound.right = x;
      }
      
      if (bound.bottom === null) {
        bound.bottom = y;
      } else if (bound.bottom < y) {
        bound.bottom = y;
      }
    }
  }
  
  var trimHeight = bound.bottom - bound.top,
      trimWidth = bound.right - bound.left,
      trimmed = ctx.getImageData(bound.left, bound.top, trimWidth, trimHeight);
  
  copy.canvas.width = trimWidth;
  copy.canvas.height = trimHeight;
  copy.putImageData(trimmed, 0, 0);
  
  // open new window with trimmed image:
  return copy.canvas;
};
