// window.js

/*
 * Create a window
 */
S2D.CreateWindow = function(title, width, height, update, render, element, opts) {
  
  var win = Object.create(S2D.Window);
  
  win.title  = title;
  win.width  = width;
  win.height = height;
  win.orig_width  = width;
  win.orig_height = height;
  win.viewport.width  = width;
  win.viewport.height = height;
  win.viewport.mode   = S2D.SCALE;
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
  
  // Prevent right clicking in canvas
  win.canvas.addEventListener("contextmenu", function(e) { e.preventDefault(); });
  
  // Detect and set up canvas for high DPI
  
  win.canvas.style.width  = win.width  + "px";
  win.canvas.style.height = win.height + "px";
  
  var ratio = window.devicePixelRatio       ||
              window.webkitDevicePixelRatio ||
              window.mozDevicePixelRatio    ||
              window.opDevicePixelRatio     || 1;
  
  win.canvas.width  = win.width  * devicePixelRatio;
  win.canvas.height = win.height * devicePixelRatio;
  win.pixel_ratio = ratio;
  
  // Initialize WebGL
  S2D.GL.Init(win);
  
  S2D.onkeydown = function(e) {
    if (win.on_key) {
      var key = S2D.GetKey(e.keyCode);
      if (!S2D.keys_down.includes(key)) {
        S2D.keys_down.push(key);
          var event = Object.create(S2D.Event);
          event.type = S2D.KEY_DOWN; event.key = key;
          win.on_key(event);
      }
    }
  };
  document.addEventListener("keydown", S2D.onkeydown);
  
  S2D.onkeyup = function(e) {
    if (win.on_key) {
      var key = S2D.GetKey(e.keyCode);
      var i = S2D.keys_down.indexOf(key);
      if (i > -1) S2D.keys_down.splice(i, 1);
      var event = Object.create(S2D.Event);
      event.type = S2D.KEY_UP; event.key = key;
      win.on_key(event);
    }
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
    if (win.on_mouse) {
      var o = S2D.GetMouseOnViewport(win,
        e.pageX - win.canvas.offsetLeft, e.pageY - win.canvas.offsetTop
      );
      var event = Object.create(S2D.Event);
      event.type = S2D.MOUSE_DOWN;
      event.button = S2D.GetMouseButtonName(e.button);
      event.x = o.x; event.y = o.y;
      win.on_mouse(event);
    }
  };
  document.addEventListener("mousedown", S2D.onmousedown);
  
  S2D.onmouseup = function(e) {
    if (win.on_mouse) {
      var o = S2D.GetMouseOnViewport(win,
        e.pageX - win.canvas.offsetLeft, e.pageY - win.canvas.offsetTop
      );
      var event = Object.create(S2D.Event);
      event.type = S2D.MOUSE_UP;
      event.button = S2D.GetMouseButtonName(e.button);
      event.x = o.x; event.y = o.y;
      win.on_mouse(event);
    }
  };
  document.addEventListener("mouseup", S2D.onmouseup);
  
  // Get and store mouse position, call mouse move
  S2D.onmousemove = function(e) {
    var o = S2D.GetMouseOnViewport(win,
      e.pageX - win.canvas.offsetLeft, e.pageY - win.canvas.offsetTop
    );
    win.mouse.x = o.x;
    win.mouse.y = o.y;
    if (win.on_mouse) {
      var event = Object.create(S2D.Event);
      event.type = S2D.MOUSE_MOVE;
      event.x = o.x; event.y = o.y;
      event.delta_x = o.x - win.mouse.last_x; event.delta_y = o.y - win.mouse.last_y;
      win.on_mouse(event);
      win.mouse.last_x = o.x; win.mouse.last_y = o.y;
    }
  };
  document.addEventListener("mousemove", S2D.onmousemove);
  
  // Get and store mouse wheel scrolling
  S2D.onmousewheel = function(e) {
    if (win.on_mouse) {
      var event = Object.create(S2D.Event);
      event.type = S2D.MOUSE_SCROLL;
      event.direction = e.webkitDirectionInvertedFromDevice ?
        S2D.MOUSE_SCROLL_INVERTED : S2D.MOUSE_SCROLL_NORMAL;
      event.delta_x = e.deltaX;
      event.delta_y = e.deltaY;
      win.on_mouse(event);
    }
    e.preventDefault();
  };
  window.addWheelListener(document, S2D.onmousewheel);
  
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
      if (win.on_key) {
        var event = Object.create(S2D.Event);
        event.type = S2D.KEY_HELD; event.key = key;
        win.on_key(event);
      }
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
