// music.js

/*
 * Create the music, given an audio file path
 */
S2D.CreateMusic = function(path) {
  
  // TODO: Check if image file exists
  
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
    
    console.log("S2D.current_music.volume", S2D.current_music.volume);
    
    if (S2D.current_music.volume >= 0.05) {
      S2D.current_music.volume -= 0.05;
    } else {
      S2D.StopMusic();
      S2D.current_music.volume = 1.0;
      clearInterval(fadeAudio);
    }
    
  }, ms / 20);
};
