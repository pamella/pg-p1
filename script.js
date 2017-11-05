// canvas
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = parseFloat(window.getComputedStyle(canvas).width);
  canvas.height = parseFloat(window.getComputedStyle(canvas).height);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // drawing the points
  if (document.getElementById('controlPoints_cb').checked) {
    for (var i in points) { 
      ctx.beginPath();
      ctx.arc(points[i].x, points[i].y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = '#cc0052';
      ctx.fill();
    }
  }
  // drawing the lines
  if (document.getElementById('controlPolygonal_cb').checked) {
    var x = points[0].x;
    var y = points[0].y;
    ctx.beginPath();
    ctx.strokeStyle = '#ff3385'; 
    ctx.lineWidth = 1;
    for (var a in points) {
      if (a > 0) {
        ctx.moveTo(x, y);
        ctx.lineTo(points[a].x, points[a].y);
        x = points[a].x;
        y = points[a].y;
      }    
    }
    ctx.stroke();
  }

  // drawing the curve
  deCasteljau();
  if (document.getElementById('bezierCurve_cb').checked) {
    var u = curvePoints[0].x;
    var q = curvePoints[0].y;
    ctx.beginPath();
    ctx.strokeStyle = '#ffffff'; 
    ctx.lineWidth = 2;
    for (var b in curvePoints) {
      if (b > 0) {
        ctx.moveTo(u, q);
        ctx.lineTo(curvePoints[b].x, curvePoints[b].y);
        u = curvePoints[b].x;
        q = curvePoints[b].y;
      }    
    }
    ctx.stroke();
  }

}

// declarando variaveis
var points = [];
var curvePoints = [];
var auxpoints = [];
var move = false;
var index = -1;
var avaliations; //deve ser setada pelo usuario -> html

function deCasteljau() {
  avaliations = document.getElementById('avaliations').value;
  curvePoints = [];
  auxpoints = [];
  for (var c = 1; c < avaliations; c++){
    for(d in points){
      auxpoints.push(points[d]);
    }
    curvePoints.push(getCurvePoint(c/avaliations));
  }
}

function getCurvePoint (t) {
  if(auxpoints.length == 1){
    return auxpoints[0];
  } else {
    var auxpoints1=[];
    
    for (var i in auxpoints) {
      if (i != 0) {
        auxpoints1.push({x: (auxpoints[i-1].x * (1-t)) + (auxpoints[i].x * t), y: (auxpoints[i-1].y * (1-t)) + (auxpoints[i].y * t)})
      }
    }
    auxpoints=[];
    
    for (i in auxpoints1) {
      auxpoints.push(auxpoints1[i]);
    }

    return getCurvePoint(t);
  }
}

function degreeElevation() {
  auxpoints = [];
  for (i in points) {
    auxpoints.push(points[i]);
  }
  var n = points.length - 1;
  var a;
  var b;
  points = [];
  curvePoints = [];

  points.push(auxpoints[0]);
  for (var i = 1; i <= n; i++) {
    a = i / (n + 1);
    b = 1 - a;
    points.push({x: (a * auxpoints[i-1].x) + (b * auxpoints[i].x) , y: (a * auxpoints[i-1].y) + (b * auxpoints[i].y)});   
  }
  points.push(auxpoints[n]);

  draw();
}

function dist(p1, p2) {
  var v = {x: p1.x - p2.x, y: p1.y - p2.y};
  return Math.sqrt(v.x * v.x + v.y * v.y);
}

function getIndex(click) {
  for (var i in points) {
    if (dist(points[i], click) <= 10) {
      return i;
    }
  }
  return -1;
}

resizeCanvas();

canvas.addEventListener('mousedown', e => {
  var click = {x: e.offsetX, y: e.offsetY, v:{x: 0, y:0}};
  index = getIndex(click);
  if (index === -1) {
    points.push(click);
    draw();
  } else {
    move = true;
  }
});

canvas.addEventListener('mousemove', e => {
  if (move) {
    points[index] = {x: e.offsetX, y: e.offsetY};
    draw();
  }
});

canvas.addEventListener('mouseup', e => {
  move = false;
});

canvas.addEventListener('dblclick', e => {
  if (index !== -1) {
    points.splice(index, 1);
    draw();
  }
});

setInterval(() => {
  draw();
}, 1 / 300);
