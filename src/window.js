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
    
    // Get and store mouse position
    document.onmousemove = function(e) {
      var x = e.pageX - win.canvas.offsetLeft;
      var y = e.pageY - win.canvas.offsetTop;
      
      // console.log(x, y);
      win.mouse.x = x;
      win.mouse.y = y;
    };
    
    document.onkeypress = function(e) {
      console.log(e);
      if (win.on_key) win.on_key(e);
    };
    
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
  console.log("close");
  win.close = true;
  // win.canvas.remove();
};
