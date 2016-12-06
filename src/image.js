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
    img.texture = S2D.GL.SetUpTexture(this);
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
