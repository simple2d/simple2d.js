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
