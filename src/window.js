// window.js

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
    if (win.on_mouse) win.on_mouse(x, y);
  };
  document.addEventListener("mousedown", S2D.onmousedown);
  
  // Get and store mouse position
  S2D.onmousemove = function(e) {
    var x = e.pageX - win.canvas.offsetLeft;
    var y = e.pageY - win.canvas.offsetTop;
    
    win.mouse.x = x;
    win.mouse.y = y;
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
