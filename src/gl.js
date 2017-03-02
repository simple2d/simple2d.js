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
