
// S2D namespace
var S2D = {
  GL: {}
};

S2D.Color = {
  r: 0,
  g: 0,
  b: 0,
  a: 1
};

// The Window
S2D.Window = {
  title:   null,
  width:   null,
  height:  null,
  update:  null,
  render:  null,
  element: null,  // The HTML element to append the canvas
  canvas:  null,
  background: Object.create(S2D.Color)
};


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
 * Create a window
 */
S2D.CreateWindow = function(title, width, height, update, render, element, opts) {
  
  var win = Object.create(S2D.Window);
  
  win.title  = title;
  win.width  = width;
  win.height = height;
  win.update = update;
  win.render = render;
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
  
  var el = document.createElement('canvas');
  win.element.appendChild(el);
  el.setAttribute('width',  win.width);
  el.setAttribute('height', win.height);
  el.innerHTML = "Your browser doesn't appear to support" +
                 "the <code>&lt;canvas&gt;</code> element.";
  win.canvas = el;
  
  S2D.GL.Init(win);
  
  function mainLoop(win) {
    // console.log("mainLoop");
    
    S2D.GL.Clear(win.background);
    
    win.render();
    
    requestAnimationFrame(function() { mainLoop(win); });
  }
  mainLoop(win);
};


// OpenGL //////////////////////////////////////////////////////////////////////

var gl = null,      // The WebGL context
    canvas,         // The HTML canvas element
    indices = [0, 1, 2],
    shaderProgram,
    positionLocation,
    colorLocation;


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
  
  // Only continue if WebGL is available and working
  
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  
  var vertexSource = `
    uniform mat4 u_matrix;
    attribute vec4 a_position;
    attribute vec4 a_color;
    varying vec4 v_color;
    void main(void) {
      v_color = a_color;
      gl_Position = u_matrix * a_position;
    }`;
  
  var fragmentSource = `
    precision mediump float;
    varying vec4 v_color;
    void main(void) {
      gl_FragColor = v_color;
    }`;
  
  var vertexShader   = gl.createShader(gl.VERTEX_SHADER);
  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  
  gl.shaderSource(  vertexShader,   vertexSource);
  gl.shaderSource(fragmentShader, fragmentSource);
  
  gl.compileShader(vertexShader);
  gl.compileShader(fragmentShader);
  
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.error("An error occurred compiling the shaders: " + gl.getShaderInfoLog(vertexShader));
    return null;
  }
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.error("An error occurred compiling the shaders: " + gl.getShaderInfoLog(fragmentShader));
    return null;
  }
  
  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    console.error("Unable to initialize the shader program.");
  }
  
  positionLocation = gl.getAttribLocation(shaderProgram, "a_position");
  colorLocation = gl.getAttribLocation(shaderProgram, "a_color");
  
  gl.useProgram(shaderProgram);
  
  // set projection ////////////////////////////////////////////////////////////
  
  var orthoMatrix = [
    2.0,    0,            0,    0,
      0, -2.0,            0,    0,
      0,    0, -2.0 / 128.0,    0,  // 128.0 == far_z
    -1.0, 1.0,         -1.0,  1.0
  ];
  
  orthoMatrix[0] =  2.0 / win.width;
  orthoMatrix[5] = -2.0 / win.height;
  
  var modelLoc = gl.getUniformLocation(shaderProgram, "u_matrix");
  
  gl.uniformMatrix4fv(modelLoc, false, new Float32Array(orthoMatrix));
};


/*
 * Clear buffers to given color values
 */
S2D.GL.Clear = function(clr) {
  gl.clearColor(clr.r, clr.g, clr.b, clr.a);
  gl.clear(gl.COLOR_BUFFER_BIT);
};


// GL Drawing Functions ////////////////////////////////////////////////////////

S2D.GL.DrawTriangle = function(x1, y1, c1r, c1g, c1b, c1a,
                               x2, y2, c2r, c2g, c2b, c2a,
                               x3, y3, c3r, c3g, c3b, c3a) {
  
  var vertices = [
    x1, y1, 0.0,
    x2, y2, 0.0,
    x3, y3, 0.0
  ];
  
  var colors = [
    c1r, c1g, c1b,
    c2r, c2g, c2b,
    c3r, c3g, c3b
  ];
  
  gl.useProgram(shaderProgram);
  
  var vertexBuffer = gl.createBuffer(),
      indexBuffer  = gl.createBuffer(),
      colorBuffer  = gl.createBuffer();
  
  // Vertex
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0); 
  gl.enableVertexAttribArray(positionLocation);
  
  // Colors
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false,0,0) ;
  gl.enableVertexAttribArray(colorLocation);
  
  // Draw
  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
};
