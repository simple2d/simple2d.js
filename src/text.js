// text.js


/*
 * Create text, given a font file path, the message, and size
 */
S2D.CreateText = function(font, msg, size) {
  
  // Create image object
  var txt   = Object.create(S2D.Text);
  txt.color = Object.create(S2D.Color);
  txt.font  = font;
  txt.size  = size;
  
  // Create a canvas element to make a texture
  var ctx = document.createElement("canvas").getContext("2d");
  
  // TODO: Width and height should probably be variable, based on
  // `ctx.measureText(msg).width` or something.
  var w = 1000;
  var h = 1000;
  
  // Double size of font for high DPI
  size = size * 2;
  
  // Set context attributes and draw text
  ctx.canvas.width  = w;
  ctx.canvas.height = h;
  ctx.font = `${size}px ${font}`;
  ctx.textAlign = "right";
  ctx.textBaseline = "bottom";
  ctx.fillStyle = "white";
  ctx.fillText(msg, w, h);
  
  // Wait until after the window is ready to create the WebGL texture
  window.addEventListener('DOMContentLoaded', function() {
    if (msg == "") return;  // no need to create a texture
    txt.data    = S2D.TrimCanvas(ctx.canvas);  // trim the transparent pixels
    txt.texture = S2D.GL.CreateTexture(txt.data);
    txt.width   = txt.data.width  / 2;  // half size of texture for high DPI
    txt.height  = txt.data.height / 2;
  });
  
  return txt;
};


/*
* Sets the text message
*/
S2D.SetText = function(txt, msg) {
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
  S2D.GL.DrawText(txt);
};
