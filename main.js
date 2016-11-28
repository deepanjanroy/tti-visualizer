// Constants
var zoomStepFactor = 1.3;

function draw(){
  var canvas = document.getElementById("demo-canvas");
  var mouseInCanvas = false;
  var showRect = false;
  var drawShadowRect = false;
  var shadowRect = null;
  var persistentRects = [];
  var zoomLevel = 100;

  function drawPersistentRects(ctx) {
    ctx.fillStyle = "rgb(200,0,200)";
    for (var rect of persistentRects) {
      ctx.fillRect(rect.start, 5, rect.end - rect.start, 40);
      ctx.strokeRect(rect.start, 5, rect.end - rect.start, 40);
    }
  }

  function drawLoop() {
    if (canvas.getContext) {
      console.log(zoomLevel);
      var ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, 1000, 50);

      drawPersistentRects(ctx);

      if (showRect) {
        ctx.fillStyle = "rgb(200,0,200)";
        ctx.fillRect (50, 5, 50, 40);
      }

      if (drawShadowRect) {
        ctx.fillStyle = "rgba(0, 150, 0, .5)";
        ctx.fillRect(shadowRect.start, 5, shadowRect.end - shadowRect.start, 40);
      }

      ctx.beginPath();
      for (var x = 0; x < 1000; x+= 50) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 20);
      }
      ctx.stroke();

      for (var x = 0; x < 1000; x+=50) {
        ctx.fillStyle = "rgb(0,0,0)";
        ctx.fillText("" + x, x, 10, 40);
      }

    }
    window.requestAnimationFrame(drawLoop);
  }

  canvas.addEventListener("mousedown", event => {
    event.preventDefault();
    console.log(event);
    drawShadowRect = true;
    shadowRect = {start: event.x, end: event.x};
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

    if (drawShadowRect) {
      shadowRect.end = event.x;
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



