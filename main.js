// Constants
var zoomStepFactor = 1.3;

function draw(){
  var canvas = document.getElementById("demo-canvas");
  var mouseInCanvas = false;
  var showRect = false;
  var drawShadowRect = false;
  var shadowRect = null;
  var persistentRects = [];
  var zoomLevel = 1;
  var leftX = 0;

  // Turns x in screen coordinates - translates and zooms.
  function tz(x) {
    return (x - leftX)* zoomLevel;
  }

  function invtz(x) {
    return (x / zoomLevel) + leftX;
  }

  // Zooms a length.
  function zoom(l) {
    return l * zoomLevel;
  }

  function invzoom(l) {
    return l / zoomLevel;
  }

  function drawPersistentRects(ctx) {
    ctx.fillStyle = "rgb(200,0,200)";
    for (var rect of persistentRects) {
      ctx.fillRect(tz(rect.start), 5, zoom(rect.end - rect.start), 40);
      ctx.strokeRect(tz(rect.start), 5, zoom(rect.end - rect.start), 40);
    }
  }

  function drawLoop() {
    if (canvas.getContext) {
      var ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, 1000, 50);

      drawPersistentRects(ctx);

      if (showRect) {
        ctx.fillStyle = "rgb(200,0,200)";
        ctx.fillRect (tz(50), 5, tz(50), 40);
      }

      if (drawShadowRect) {
        ctx.fillStyle = "rgba(0, 150, 0, .5)";
        ctx.fillRect(tz(shadowRect.start), 5, zoom(shadowRect.end - shadowRect.start), 40);
      }

      ctx.beginPath();
      for (var x = 0; x < 1000; x += 50) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 20);
      }
      ctx.stroke();

      for (var x = 0; x < 1000; x += 50) {
        ctx.fillStyle = "rgb(0,0,0)";
        var xValue = invtz(x).toFixed(2);
        ctx.fillText("" + xValue, x, 10, 40);
      }

    }
    window.requestAnimationFrame(drawLoop);
  }

  function getMousePos(e) {
    var rect = canvas.getBoundingClientRect();
    return {x: e.clientX - rect.left, y: e.clientY - rect.top};
  }

  canvas.addEventListener("mousedown", event => {
    // Gets rid of the annoying cursor when dragging.
    event.preventDefault();

    var pos = getMousePos(event);
    console.log(event);
    drawShadowRect = true;
    shadowRect = {start: invtz(pos.x), end: invtz(pos.x)};
  });

  canvas.addEventListener("mouseup", event => {
    console.log(event);
    persistentRects.push(shadowRect);
    drawShadowRect = false;
  });


  canvas.addEventListener("mousein", event => {
    mouseInCanvas = true;
    console.log(event);
    drawShadowRect = false;
  });

  canvas.addEventListener("mouseout", event => {
    mouseInCanvas = false;
    console.log(event);
    drawShadowRect = false;
  });

  canvas.addEventListener("mousemove", event => {
    // maybe this can be optimized.
    mouseInCanvas = true;
    var pos = getMousePos(event);

    if (drawShadowRect) {
      shadowRect.end = invtz(pos.x);
    }
  });

  window.addEventListener("keydown", event => {
    console.log("keypress");
    console.log(event);
    if (mouseInCanvas) {
      switch(event.key) {
        case 'w':
        case 'W':
        zoomLevel *= zoomStepFactor;
        break;

        case 's':
        case 's':
        zoomLevel /= zoomStepFactor;
        break;
      }
    }
  });


  window.requestAnimationFrame(drawLoop);
}



// Files stuff
var activeModel = null;
function setActiveModel(filename, data) {
  console.log("Setting active model");
  var model = new tr.Model();
  var importOptions = new tr.importer.ImportOptions();
  importOptions.pruneEmptyContainers = false;
  importOptions.showImportWarnings = true;
  importOptions.trackDetailedModelStats = true;
  var i = new tr.importer.Import(model, importOptions);
  i.importTracesWithProgressDialog([data]).then(
    function() {
      activeModel = model;
    }.bind(this),
    function(err) {
      tr.ui.b.Overlay.showError('Trace import error: ' + err);
      console.error(err);
    });
}

function handleFileSelect(evt) {
  console.log("Handling selected files");
  var files = evt.target.files; // FileList object
  var f = files[0];
  tr.ui.b.readFile(f).then(res => {
    setActiveModel(f.name, res);
  })
}

document.getElementById('files').addEventListener('change', handleFileSelect, false);
