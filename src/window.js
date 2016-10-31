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
  
  var el = document.createElement('canvas');
  win.element.appendChild(el);
  
  el.setAttribute('width',  win.width);
  el.setAttribute('height', win.height);
  el.innerHTML = "Your browser doesn't appear to support" +
                 "the <code>&lt;canvas&gt;</code> element.";
  
  win.canvas = el;
  
  S2D.GL.Init(win);
  
  var i = 0;
  var req;
  
  function mainLoop(win) {
    
    S2D.GL.Clear(win.background);
    
    if (win.update) win.update();
    if (win.render) win.render();
    
    req = requestAnimationFrame(function() { mainLoop(win); });
    
    i++;
    if (i == 10) {
      cancelAnimationFrame(req);
    }
  }
  
  mainLoop(win);
};


/*
 * Close the window
 */
S2D.Close = function(win) {};
