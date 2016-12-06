// sound.js

/*
 * Create a sound, given an audio file path
 */
S2D.CreateSound = function(path) {
  
  // TODO: Check if image file exists
  
  var sound = Object.create(S2D.Sound);
  sound.data = new Audio(path);
  
  return sound;
};


/*
 * Play the sound
 */
S2D.PlaySound = function(sound) {
  sound.data.play();
};
