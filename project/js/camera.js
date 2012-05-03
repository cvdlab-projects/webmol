var NScamera = new Object();

NScamera.rot = quat4.create([0,0,0,1]);
NScamera.center = vec3.create([0,0,0]);
NScamera.distance = 20;
NScamera.velocityX = 0;
NScamera.velocityY = 0;
NScamera.velocityZ = 0;
NScamera.dampening = 0.85;
NScamera.minDistance = 10;
NScamera.maxDistance = 50;
NScamera.stepPan = 10;

// Per utilizzare la camera al meglio bisogna tunare i parametri minDistance, maxDistance, distance, center, stepPan
// a seconda di cosa andiamo a disegnare sulla scena

vec3.angle = function(v1,v2) {
	return Math.acos(vec3.dot(v1,v2)/(vec3.length(v1)*vec3.length(v2)));
}

NScamera.setTarget = function(target) {
	NScamera.center = vec3.create(target.x, target.y, target.z);
	NScamera.initCenter = vec3.create(target.x, target.y, target.z);
}

NScamera.reset = function(){
	NScamera.center = vec3.create(this.initCenter[0], this.initCenter[1], this.initCenter[2]);
	NScamera.rot = quat4.create([0,0,0,1]);
	NScamera.velocityX = 0;
	NScamera.velocityY = 0;
	NScamera.velocityZ = 0;
}

NScamera.feed = function(mat) {
  var pos = [0,0,1];
  var up = [0,1,0];
  quat4.multiplyVec3(this.rot,pos);
  vec3.scale(pos,this.distance);
  vec3.add(pos, this.center);
  quat4.multiplyVec3(this.rot, up);
  mat4.multiply(mat, mat4.lookAt(pos,this.center,up));
}

NScamera.mousePan = function(dx,dy) {
  var panScale = Math.sqrt(this.distance *0.0001);
  this.pan(-dx*panScale, -dy*panScale);
}

NScamera.pan = function(dx,dy) {
  vec3.add(this.center,quat4.multiplyVec3(this.rot,[dx,dy,0]));	
}

NScamera.mouseRotate = function(dx,dy,mx,my) {
	var u = [0,0,-100*.6 * this.distance];

	var rho = Math.abs((gl.canvas.width / 2.0) - mx) / (gl.canvas.height/2.0);
	var adz = Math.abs(dy) * rho;
	var ady = Math.abs(dy) * (1 - rho);
	var ySign = dy < 0 ? -1 : 1;
	var vy = [0,0,0];
	vec3.add(u,[0,ady,0],vy);
	this.velocityX += vec3.angle(u,vy)*ySign;
	var vz = [0,0,0];
	vec3.add(u,[0,adz,0],vz);
	this.velocityZ += vec3.angle(u, vz) * -ySign * (mx < gl.canvas.width / 2 ? -1 : 1);

	var eccentricity = Math.abs((gl.canvas.height / 2.0) - my) / (gl.canvas.height / 2.0);
	var xSign = dx > 0 ? -1 : 1;
	adz = Math.abs(dx) * eccentricity;
	var adx = Math.abs(dx) * (1 - eccentricity);
	var vx = [0,0,0]
	vec3.add(u,[adx, 0, 0],vx);
	this.velocityY += vec3.angle(u,vx)*xSign;
	vec3.add(u,[0,adz,0],vz);
	this.velocityZ += vec3.angle(u,vz)*xSign * (my > gl.canvas.height / 2 ? -1 : 1);
	
}

NScamera.mouseZoom = function(delta) {
	this.distance = Math.max(this.minDistance, this.distance - delta * Math.sqrt(this.distance * .02));
	this.distance = Math.min(this.maxDistance, this.distance);
}

NScamera.step = function() {
  this.velocityX *= this.dampening;
  this.velocityY *= this.dampening;
  this.velocityZ *= this.dampening;
  if(Math.abs(this.velocityX) < 0.001) this.velocityX = 0;
  if(Math.abs(this.velocityY) < 0.001) this.velocityY = 0;
  if(Math.abs(this.velocityZ) < 0.001) this.velocityZ = 0;

  if(this.velocityX != 0) quat4.multiply(this.rot,quat4.create([Math.sin(this.velocityX/2.0),0,0,Math.cos(this.velocityX/2.0)]));
  if(this.velocityY != 0) quat4.multiply(this.rot,quat4.create([0,Math.sin(this.velocityY/2.0),0,Math.cos(this.velocityY/2.0)]));
  if(this.velocityZ != 0) quat4.multiply(this.rot,quat4.create([0,0,Math.sin(this.velocityZ/2.0),Math.cos(this.velocityZ/2.0)]));
}