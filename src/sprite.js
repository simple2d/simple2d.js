// sprite.js

/*
 * Create a sprite, given an image file path
 */
S2D.CreateSprite = function(path) {

  // TODO: Check if sprite image file exists

  var spr = Object.create(S2D.Sprite);
  spr.color = Object.create(S2D.Color);
  spr.img = S2D.CreateImage(path, function() {
    if (!spr.width ) spr.width  = spr.img.width;
    if (!spr.height) spr.height = spr.img.height;
    spr.clip_width  = spr.img.width;
    spr.clip_height = spr.img.height;
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

  // Store the sprite dimensions
  spr.width  = (spr.width  / spr.clip_width ) * w;
  spr.height = (spr.height / spr.clip_height) * h;
  spr.clip_width  = w;
  spr.clip_height = h;
};


/*
 * Draw a sprite
 */
S2D.DrawSprite = function(spr) {
  if (!spr) return;
  S2D.GL.DrawSprite(spr);
};
