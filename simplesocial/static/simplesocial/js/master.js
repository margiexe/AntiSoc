
/* adjust these to your liking! */
var slowness=2;
var foregroundLeftColor="rgba(102, 51, 255,.8)";
var foregroundRightColor="rgba(0, 153, 204,.3)";
var backgroundLeftColor="rgba(102, 51, 255,.3)";
var backgroundRightColor="rgba(0, 153, 204,.8)";

/* code below */

var canvas = document.querySelector( 'canvas' );
var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight;
canvas.width=canvasWidth;
canvas.height=canvasHeight;

var ctx = canvas.getContext( '2d' );
var pi = Math.PI;


//this generates an array containing 'y' values, for a particular wave and for a particular point in time, and it's based on the sine wave equation: https://en.wikipedia.org/wiki/Sine_wave
function getWaveHeights(revsPerCanvas,waveSpeed,waveHeight,time,startAngle){
  var amplitude=waveHeight*canvasHeight/4;
  var frequency=revsPerCanvas/canvasWidth;
  var heightArray=[];
  waveSpeed/=slowness;
  for(x=0; x<=canvasWidth; x+=1){
      var y = Math.sin(x*frequency*2*pi-waveSpeed*time+startAngle)
        *amplitude;
      heightArray.push(y);
  }
  return heightArray;
}

var draw = function(summedHeights,colorLeft,colorRight){
  ctx.beginPath();
  ctx.moveTo(0,0);
  
  //this takes the summed sine waves and applies them across the center of the canvas
  for(x=0; x<=canvasWidth; x+=1){
      ctx.lineTo(x,
         canvasHeight/2 + summedHeights[x]);
  }
  //close path: far right bottom, far left bottom, close
  ctx.lineTo( canvasWidth, canvasHeight );
  ctx.lineTo( 0, canvasHeight );
  ctx.closePath();
  var gradient=ctx.createLinearGradient(0,0,canvasWidth,0);
  gradient.addColorStop(0,colorLeft);
  gradient.addColorStop(1,colorRight);
  ctx.fillStyle=gradient;
  ctx.fill();
}

var time=0;
function loop(){
	ctx.clearRect( 0, 0, canvasWidth, canvasHeight);
  
  // We're using a total of four sine waves:
  // Two waves interacting in the "background", and two interacting in the foreground.
  // All waves are moving at different speeds, and hence the chaotic-seeming nature of this.
  // I inserted arbitrary wave properties below -- feel free to play around!
  // getWaveHeights(
  //  revsPerCanvas,waveSpeed,waveHeight,time,startAngle
  //)
  var wave1B = getWaveHeights(1,.01,1,time,3);
  var wave2B = getWaveHeights(2,.005,.5,time,3.5);
  var sumWavesB = 
      wave1B.map((value, index) => value + wave2B[index]);
  draw(sumWavesB,backgroundLeftColor,backgroundRightColor);
  
  var wave1F = getWaveHeights(1,.007,.75,time,0);
  var wave2F = getWaveHeights(2,.003,.25,time,.5);
  var sumWavesF = 
      wave1F.map((value, index) => value + wave2F[index]);
  draw(sumWavesF,foregroundLeftColor,foregroundRightColor);
  time++;
  requestAnimationFrame( loop );
};

loop();