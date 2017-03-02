// Simple2D.js — v0.1.0, built 03-01-2017

// start.js - Open the anonymous function defining the Simple 2D module

(function(undefined) {
  
  // Check if Simple 2D is already loaded
  if (typeof(this.S2D) !== 'undefined') {
    console.warn("Simple 2D already loaded! Loading twice may cause problems.");
    return this.S2D;
  }
  
  // Create the Simple 2D module
  var S2D = this.S2D = {};
  
  // ... Simple 2D library starts here ...


// simple2d.js

// Simple 2D OpenGL namespace
S2D.GL = {};

// Simple 2D definitions
Object.defineProperty(S2D, "KEYDOWN", { value: 1 });
Object.defineProperty(S2D, "KEY",     { value: 2 });
Object.defineProperty(S2D, "KEYUP",   { value: 3 });

// Viewport scaling modes
Object.defineProperty(S2D, "FIXED",   { value: 1 });
Object.defineProperty(S2D, "SCALE",   { value: 2 });
Object.defineProperty(S2D, "STRETCH", { value: 3 });

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
  orig_width: null,
  orig_height: null,
  viewport: {
    width: null,
    height: null,
    mode: null
  },
  pixel_ratio: null,
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


// image.js

/*
 * Create an image
 * Params: path = image file path
 */
S2D.CreateImage = function(path, loadedCallback) {
  
  // TODO: Check if image file exists
  
  // Create image object
  var img = Object.create(S2D.Image);
  img.data = new Image();
  img.color = Object.create(S2D.Color);
  
  img.data.onload = function() {
    img.texture = S2D.GL.CreateTexture(this);
    if (!img.width)  img.width  = this.width;
    if (!img.height) img.height = this.height;
    if (loadedCallback) loadedCallback();
  };
  
  // Causes image to be loaded
  img.data.src = path;
  
  return img;
};


/*
 * Draw an image
 */
S2D.DrawImage = function(img) {
  if (!img) return;
  S2D.GL.DrawImage(img);
};


// sprite.js

/*
 * Create a sprite, given an image file path
 */
S2D.CreateSprite = function(path) {
  
  // TODO: Check if sprite image file exists
  
  var spr = Object.create(S2D.Sprite);
  spr.img = S2D.CreateImage(path, function() {
    spr.width  = spr.img.width;
    spr.height = spr.img.height;
  });
  
  spr.tx1 = 0.0;
  spr.ty1 = 0.0;
  spr.tx2 = 1.0;
  spr.ty2 = 0.0;
  spr.tx3 = 1.0;
  spr.ty3 = 1.0;
  spr.tx4 = 0.0;
  spr.ty4 = 1.0;
  
  return spr;
};


/*
 * Clip a sprite
 */
S2D.ClipSprite = function(spr, x, y, w, h) {
  if (!spr) return;
  
  // Calculate ratios
  // rw = ratio width; rh = ratio height
  var rw = w / spr.img.width;
  var rh = h / spr.img.height;
  
  // Apply ratios to x, y coordinates
  // cx = crop x coord; cy = crop y coord
  var cx = x * rw;
  var cy = y * rh;
  
  // Convert given width, height to doubles
  // cw = crop width; ch = crop height
  var cw = w;
  var ch = h;
  
  // Apply ratio to texture width and height
  // tw = texture width; th = texture height
  var tw = rw * w;
  var th = rh * h;
  
  // Calculate and store sprite texture values
  
  spr.tx1 =  cx       / cw;
  spr.ty1 =  cy       / ch;
  
  spr.tx2 = (cx + tw) / cw;
  spr.ty2 =  cy       / ch;
  
  spr.tx3 = (cx + tw) / cw;
  spr.ty3 = (cy + th) / ch;
  
  spr.tx4 =  cx       / cw;
  spr.ty4 = (cy + th) / ch;
  
  // Store the sprite width and height
  spr.width  = w;
  spr.height = h;
};


/*
 * Draw a sprite
 */
S2D.DrawSprite = function(spr) {
  if (!spr) return;
  S2D.GL.DrawSprite(spr);
};


// text.js

/*
 * Create text, given a font file path, the message, and size
 */
S2D.CreateText = function(font, msg, size) {
  
  // Create image object
  var txt   = Object.create(S2D.Text);
  txt.color = Object.create(S2D.Color);
  txt.font  = font;
  txt.msg   = msg;
  txt.size  = size;
  
  return txt;
};


/*
* Sets the text message
*/
S2D.SetText = function(txt, msg) {
  if (msg == "") return;  // no need to create a texture
  
  S2D.GL.FreeTexture(txt.texture);
  
  // Create a canvas element to make a texture
  var ctx = document.createElement("canvas").getContext("2d");
  
  // TODO: Width and height should probably be variable, based on
  // `ctx.measureText(msg).width` or something.
  var w = 1000;
  var h = 1000;
  
  // Double size of font for high DPI
  var size = txt.size * 2;
  
  // Set context attributes and draw text
  ctx.canvas.width  = w;
  ctx.canvas.height = h;
  ctx.font = `${size}px ${txt.font}`;
  ctx.textAlign = "right";
  ctx.textBaseline = "bottom";
  ctx.fillStyle = "white";
  ctx.fillText(msg, w, h);
  
  txt.data    = S2D.TrimCanvas(ctx.canvas);  // trim the transparent pixels
  txt.texture = S2D.GL.CreateTexture(txt.data);
  txt.width   = txt.data.width  / 2;  // half size of texture for high DPI
  txt.height  = txt.data.height / 2;
};


/*
 * Draw text
 */
S2D.DrawText = function(txt) {
  if (!txt) return;
  
  if (!txt.texture) {
    S2D.SetText(txt, txt.msg);
  }
  
  S2D.GL.DrawText(txt);
};


// sound.js

/*
 * Create a sound, given an audio file path
 */
S2D.CreateSound = function(path) {
  
  // TODO: Check if audio file exists
  
  var sound = Object.create(S2D.Sound);
  sound.data = new Audio(path);
  
  return sound;
};


/*
 * Play the sound
 */
S2D.PlaySound = function(sound) {
  // Clone sound and play so audio can overlap
  sound.data.cloneNode(true).play();
};


// music.js

/*
 * Create the music, given an audio file path
 */
S2D.CreateMusic = function(path) {
  
  // TODO: Check if audio file exists
  
  var music = Object.create(S2D.Music);
  music.data = new Audio(path);
  
  return music;
};


/*
 * Play the music
 */
S2D.PlayMusic = function(music, loop) {
  S2D.StopMusic();
  music.data.loop = loop;
  S2D.current_music = music.data;
  S2D.current_music.play();
};


/*
 * Pause the playing music
 */
S2D.PauseMusic = function() {
  if (!S2D.current_music) return;
  S2D.current_music.pause();
};


/*
 * Resume the current music
 */
S2D.ResumeMusic = function() {
  if (!S2D.current_music) return;
  S2D.current_music.play();
};


/*
 * Stops the playing music; interrupts fader effects
 */
S2D.StopMusic = function() {
  if (!S2D.current_music) return;
  S2D.current_music.pause();
  S2D.current_music.currentTime = 0;
};


/*
 * Fade out the playing music
 */
S2D.FadeOutMusic = function(ms) {
  if (!S2D.current_music) return;
  
  if (S2D.current_music.paused) {
    S2D.StopMusic();
    return;
  }
  
  var fadeAudio = setInterval(function () {
    if (S2D.current_music.volume >= 0.05) {
      S2D.current_music.volume -= 0.05;
    } else {
      S2D.StopMusic();
      S2D.current_music.volume = 1.0;
      clearInterval(fadeAudio);
    }
    
  }, ms / 20);
};


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


// window.js

/*
 * Create a window
 */
S2D.CreateWindow = function(title, width, height, update, render, element, opts) {
  
  var win = Object.create(S2D.Window);
  
  win.title  = title;
  win.width  = width;
  win.height = height;
  win.orig_width  = width;
  win.orig_height = height;
  win.viewport.width  = width;
  win.viewport.height = height;
  win.viewport.mode   = S2D.SCALE;
  win.update = update;
  win.render = render;
  win.background = Object.create(S2D.Color);
  win.background.r = 0;
  win.background.g = 0;
  win.background.b = 0;
  win.background.a = 1;
  
  // `element` can be an ID string (e.g. "#game") or an actual DOM element
  if (typeof(element) == 'string') {
    win.element = document.getElementById(element);
  } else {
    win.element = element;
  }
  
  return win;
};


/*
 * Show the window
 */
S2D.Show = function(win) {
  
  // Create the canvas element
  
  var el = document.createElement('canvas');
  win.element.appendChild(el);
  
  el.setAttribute('width',  win.width);
  el.setAttribute('height', win.height);
  el.innerHTML = "Your browser doesn't appear to support" +
                 "the <code>&lt;canvas&gt;</code> element.";
  
  win.canvas = el;
  
  // Detect and set up canvas for high DPI
  
  win.canvas.style.width  = win.width  + "px";
  win.canvas.style.height = win.height + "px";
  
  var ratio = window.devicePixelRatio       ||
              window.webkitDevicePixelRatio ||
              window.mozDevicePixelRatio    ||
              window.opDevicePixelRatio     || 1;
  
  win.canvas.width  = win.width  * devicePixelRatio;
  win.canvas.height = win.height * devicePixelRatio;
  win.pixel_ratio = ratio;
  
  // Initialize WebGL
  S2D.GL.Init(win);
  
  S2D.onkeydown = function(e) {
    var key = S2D.GetKey(e.keyCode);
    if (!S2D.keys_down.includes(key)) {
      S2D.keys_down.push(key);
      if (win.on_key) win.on_key(S2D.KEYDOWN, key);
    }
  };
  document.addEventListener("keydown", S2D.onkeydown);
  
  S2D.onkeyup = function(e) {
    var key = S2D.GetKey(e.keyCode);
    var i = S2D.keys_down.indexOf(key);
    if (i > -1) S2D.keys_down.splice(i, 1);
    if (win.on_key) win.on_key(S2D.KEYUP, key);
  };
  document.addEventListener("keyup", S2D.onkeyup);
  
  // Clear keys down list when focus is lost
  window.addEventListener("blur", function functionName() {
    var e = {};
    S2D.keys_down.slice().forEach(function(key) {
      e.keyCode = key;
      S2D.onkeyup(e);
    });
  });
  
  S2D.onmousedown = function(e) {
    var x = e.pageX - win.canvas.offsetLeft;
    var y = e.pageY - win.canvas.offsetTop;
    var o = S2D.GetMouseOnViewport(win, x, y);
    if (win.on_mouse) win.on_mouse(o.x, o.y);
  };
  document.addEventListener("mousedown", S2D.onmousedown);
  
  // Get and store mouse position
  S2D.onmousemove = function(e) {
    var x = e.pageX - win.canvas.offsetLeft;
    var y = e.pageY - win.canvas.offsetTop;
    var o = S2D.GetMouseOnViewport(win, x, y);
    win.mouse.x = o.x;
    win.mouse.y = o.y;
  };
  document.addEventListener("mousemove", S2D.onmousemove);
  
  // Main loop
  
  var req;  // the animation frame request
  var start_ms = new Date();
  var end_ms   = new Date();
  var elapsed_ms;
  
  function mainLoop(win) {
    
    if (win.close) {
      cancelAnimationFrame(req);
      return;
    }
    
    S2D.GL.Clear(win.background);
    
    // Update frame counter
    win.frames++;
    
    // Calculate and store FPS
    end_ms = new Date();
    elapsed_ms = end_ms.getTime() - start_ms.getTime();
    win.fps = win.frames / (elapsed_ms / 1000.0);
    
    // Detect keys held down
    S2D.keys_down.forEach(function(key) {
      if (win.on_key) win.on_key(S2D.KEY, key);
    });
    
    if (win.update) win.update();
    if (win.render) win.render();
    
    requestAnimationFrame(function() { mainLoop(win); });
  }
  
  req = requestAnimationFrame(function() { mainLoop(win); });
};


/*
 * Close the window
 */
S2D.Close = function(win) {
  win.close = true;
  // win.canvas.remove();
};


// gl.js

var gl = null,      // The WebGL context
    canvas,         // The HTML canvas element
    indices = [0, 1, 2,  2, 3, 0],
    // Triangle shader
    shaderProgram,
    positionLocation,
    colorLocation,
    // Texture shader
    texShaderProgram,
    texPositionLocation,
    texColorLocation,
    texCoordLocation,
    samplerLocation;

var orthoMatrix = [
     0,   0,    0,   0,
     0,   0,    0,   0,
     0,   0,    0,   0,
  -1.0, 1.0, -1.0, 1.0
];


/*
 * Initialize WebGL
 */
S2D.GL.Init = function(win) {
  
  // Initialize the GL context
  try {
    // Try to grab the standard context. If it fails, fallback to experimental.
    gl = win.canvas.getContext("webgl") || win.canvas.getContext("experimental-webgl");
  } catch(e) {
    console.log("GL error caught");
  }
  
  // If we don't have a GL context, give up now
  if (!gl) {
    console.error("Unable to initialize WebGL. Your browser may not support it.");
    return null;
  }
  
  S2D.GL.WebGLInit();
  S2D.GL.SetViewport(win);
};


/*
 * Initialize WebGL
 */
S2D.GL.WebGLInit = function() {
  
  // Enable transparency
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  
  // Vertex shader source string
  var vertexSource = `
    uniform mat4 u_matrix;
    attribute vec4 a_position;
    attribute vec4 a_color;
    attribute vec2 a_texcoord;
    varying vec4 v_color;
    varying vec2 v_texcoord;
    void main(void) {
      v_color = a_color;
      v_texcoord = a_texcoord;
      gl_Position = u_matrix * a_position;
    }`;
  
  // Fragment shader source string
  var fragmentSource = `
    precision mediump float;
    varying vec4 v_color;
    void main(void) {
      gl_FragColor = v_color;
    }`;
  
  // Fragment shader source string for textures
  var texFragmentSource = `
    precision mediump float;
    varying vec4 v_color;
    varying vec2 v_texcoord;
    uniform sampler2D s_texture;
    void main(void) {
      gl_FragColor = texture2D(s_texture, v_texcoord) * v_color;
    }`;
  
  // Load the vertex and fragment shaders
  var vertexShader      = S2D.GL.LoadShader(  gl.VERTEX_SHADER,      vertexSource, "Vertex");
  var fragmentShader    = S2D.GL.LoadShader(gl.FRAGMENT_SHADER,    fragmentSource, "Fragment");
  var texFragmentShader = S2D.GL.LoadShader(gl.FRAGMENT_SHADER, texFragmentSource, "Texture Fragment");
  
  // Triangle Shader //
  
  // Create the texture shader program object
  shaderProgram = gl.createProgram();
  
  // Attach the shader objects to the program object
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  
  // Link the shader program
  gl.linkProgram(shaderProgram);
  
  // Check if linked
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    console.error("Unable to initialize the shader program.");
  }
  
  // Get the attribute locations
  positionLocation = gl.getAttribLocation(shaderProgram, "a_position");
  colorLocation    = gl.getAttribLocation(shaderProgram, "a_color");
  
  // Texture Shader //
  
  // Create the texture shader program object
  texShaderProgram = gl.createProgram();
  
  // Attach the shader objects to the program object
  gl.attachShader(texShaderProgram, vertexShader);
  gl.attachShader(texShaderProgram, texFragmentShader);
  
  // Link the shader program
  gl.linkProgram(texShaderProgram);
  
  // Check if linked
  if (!gl.getProgramParameter(texShaderProgram, gl.LINK_STATUS)) {
    console.error("Unable to initialize the texture shader program.");
  }
  
  // Get the attribute locations
  texPositionLocation = gl.getAttribLocation(texShaderProgram, "a_position");
  texColorLocation    = gl.getAttribLocation(texShaderProgram, "a_color");
  texCoordLocation    = gl.getAttribLocation(texShaderProgram, "a_texcoord");
  
  // Get the sampler location
  samplerLocation = gl.getUniformLocation(texShaderProgram, "s_texture");
};


/*
 * Creates a shader object, loads shader string, and compiles.
 */
S2D.GL.LoadShader = function(type, shaderSrc, shaderName) {
  
  var shader = gl.createShader(type);
  
  gl.shaderSource(shader, shaderSrc);
  gl.compileShader(shader);
  
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Error compiling shader \"" + shaderName + "\":\n" + gl.getShaderInfoLog(shader));
    return null;
  }
  
  return shader;
};


/*
 * Calculate the viewport's scaled width and height
 */
S2D.GL.GetViewportScale = function(win) {
  
  var s = Math.min(
    win.width  / win.viewport.width,
    win.height / win.viewport.height
  );
  
  var w = win.viewport.width  * s;
  var h = win.viewport.height * s;
  
  return {
    w: w,
    h: h,
    scale: s
  };
};


/*
 * Sets the viewport and matrix projection
 */
S2D.GL.SetViewport = function(win) {
  
  var ortho_w = win.viewport.width;
  var ortho_h = win.viewport.height;
  var x, y, w, h;  // calculated GL viewport values
  
  x = 0; y = 0; w = win.width; h = win.height;
  
  switch (win.viewport.mode) {
    
    case S2D.FIXED:
      w = win.orig_width;
      h = win.orig_height;
      y = win.height - h;
      break;
    
    case S2D.SCALE:
      var o = S2D.GL.GetViewportScale(win);
      // Center the viewport
      x = win.width  / 2.0 - o.w/2.0;
      y = win.height / 2.0 - o.h/2.0;
      break;
      
    case S2D.STRETCH:
      break;
  }
  
  gl.viewport(
    x * win.pixel_ratio,
    y * win.pixel_ratio,
    w * win.pixel_ratio,
    h * win.pixel_ratio
  );
  
  orthoMatrix[0] =  2.0 / ortho_w;
  orthoMatrix[5] = -2.0 / ortho_h;
  
  gl.useProgram(shaderProgram);
  
  gl.uniformMatrix4fv(
    gl.getUniformLocation(shaderProgram, "u_matrix"),
    false, new Float32Array(orthoMatrix)
  );
  
  gl.useProgram(texShaderProgram);
  
  gl.uniformMatrix4fv(
    gl.getUniformLocation(texShaderProgram, "u_matrix"),
    false, new Float32Array(orthoMatrix)
  );
};


/*
 * Clear buffers to given color values
 */
S2D.GL.Clear = function(clr) {
  gl.clearColor(clr.r, clr.g, clr.b, clr.a);
  gl.clear(gl.COLOR_BUFFER_BIT);
};


/*
 * Creates a texture for rendering
 */
S2D.GL.CreateTexture = function(data) {
  
  var texture = gl.createTexture();
  
  // Bind the named texture to a texturing target
  gl.bindTexture(gl.TEXTURE_2D, texture);
  
  // Specifies the 2D texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, data);
  
  // Set the filtering mode
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  
  gl.bindTexture(gl.TEXTURE_2D, null);
  
  return texture;
};


/*
 * Free a texture
 */
S2D.GL.FreeTexture = function(texture) {
  gl.deleteTexture(texture);
};


/*
 * Draw triangle
 */
S2D.GL.DrawTriangle = function(x1, y1, c1r, c1g, c1b, c1a,
                               x2, y2, c2r, c2g, c2b, c2a,
                               x3, y3, c3r, c3g, c3b, c3a) {
  
  var vertices = [
    x1, y1, 0.0,
    x2, y2, 0.0,
    x3, y3, 0.0
  ];
  
  var colors = [
    c1r, c1g, c1b, c1a,
    c2r, c2g, c2b, c2a,
    c3r, c3g, c3b, c3a
  ];
  
  gl.useProgram(shaderProgram);
  
  // Vertex
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  
  gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(positionLocation);
  
  // Colors
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  
  gl.vertexAttribPointer(colorLocation, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(colorLocation);
  
  // Draw
  gl.drawArrays(gl.TRIANGLES, 0, 3);
};


/*
 * Draw a texture
 */
S2D.GL.DrawTexture = function(x, y, w, h,
                              r, g, b, a,
                              tx1, ty1, tx2, ty2, tx3, ty3, tx4, ty4,
                              texture) {
  
  var vertices =
  //  x, y coords      | x, y texture coords
    [ x,     y,     0.0, tx1, ty1,
      x + w, y,     0.0, tx2, ty2,
      x + w, y + h, 0.0, tx3, ty3,
      x,     y + h, 0.0, tx4, ty4 ];
  
  var colors = [
    r, g, b, a,
    r, g, b, a,
    r, g, b, a,
    r, g, b, a
  ];
  
  gl.useProgram(texShaderProgram);
  
  // Vertex
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  
  gl.vertexAttribPointer(texPositionLocation, 3, gl.FLOAT, false, 5*4, 0);
  gl.enableVertexAttribArray(texPositionLocation);
  
  gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 5*4, 3*4);
  gl.enableVertexAttribArray(texCoordLocation);
  
  // Colors
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  
  gl.vertexAttribPointer(texColorLocation, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(texColorLocation);
  
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  
  gl.uniform1i(samplerLocation, 0);
  
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
  
  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
};


/*
 * Draw image
 */
S2D.GL.DrawImage = function(img) {
  S2D.GL.DrawTexture(
    img.x, img.y, img.width, img.height,
    img.color.r, img.color.g, img.color.b, img.color.a,
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    img.texture
  );
};


/*
 * Draw sprite
 */
S2D.GL.DrawSprite = function(spr) {
  S2D.GL.DrawTexture(
    spr.x, spr.y, spr.width, spr.height,
    spr.img.color.r, spr.img.color.g, spr.img.color.b, spr.img.color.a,
    spr.tx1, spr.ty1, spr.tx2, spr.ty2, spr.tx3, spr.ty3, spr.tx4, spr.ty4,
    spr.img.texture
  );
};


/*
 * Draw text
 */
S2D.GL.DrawText = function(txt) {
  S2D.GL.DrawTexture(
    txt.x, txt.y, txt.width, txt.height,
    txt.color.r, txt.color.g, txt.color.b, txt.color.a,
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    txt.texture
  );
};


// end.js - Close the anonymous function defining the Simple 2D module

// Call anonymous and the Simple 2D module to the global scope
}).call(this);
