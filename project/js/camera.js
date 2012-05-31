var NScamera = new Object();

NScamera.rot = new PhiloGL.Quat(0,0,0,1);
NScamera.center = new PhiloGL.Vec3(0,0,0);
NScamera.distance = 20;
NScamera.velocityX = 0;
NScamera.velocityY = 0;
NScamera.velocityZ = 0;
NScamera.dampening = 0.8;
NScamera.sensibility = -250;
NScamera.minDistance = 0.1;
NScamera.maxDistance = 2000;
NScamera.stepPan = 10;

// Per utilizzare la camera al meglio bisogna tunare i parametri minDistance, maxDistance, distance, center, stepPan
// a seconda di cosa andiamo a disegnare sulla scena

NScamera.update = function(){
	view.id();
    NScamera.step();
    NScamera.feed(view);
	view.$invert();
	var oldp = camera.position, oldt = camera.target, oldu = camera.up;
	var p = new PhiloGL.Vec3(view[12],view[13],view[14]), t = NScamera.center, u = new PhiloGL.Vec3(view[4], view[5], view[6]);
	
	// Se cambia almeno una componente della camera, aggiorno la camera ed i piani della frustumCulling
	if(oldp.distTo(p)!=0 || oldt.distTo(t)!=0 || oldu.distTo(u)!=0){
		camera.position = p;
		camera.target = t;
		camera.up = u;
		camera.update();
		culling.updatePlanes(p, t, u);
		renderizer.render(type);
	}
}

NScamera.setTarget = function(target) {
	NScamera.center = new PhiloGL.Vec3(target[0], target[1], target[2]);
	NScamera.initCenter = new PhiloGL.Vec3(target[0], target[1], target[2]);
}

NScamera.setDistance = function(distance) {
	NScamera.distance = distance;
	NScamera.maxDistance = distance*4;
	NScamera.initDistance = distance;
}

NScamera.reset = function(){
	NScamera.velocityX = 0;
	NScamera.velocityY = 0;
	NScamera.velocityZ = 0;
}

NScamera.feed = function(mat) {
  var pos = new PhiloGL.Vec3(0,0,1);
  var up = new PhiloGL.Vec3(0,1,0);
  quat_multiplyVec3(this.rot,pos);
  pos.$scale(this.distance);
  pos.$add(this.center);
  quat_multiplyVec3(this.rot, up);
  mat.lookAt(pos, this.center, up);
}

NScamera.mousePan = function(dx,dy) {
  var panScale = Math.sqrt(this.distance *0.0001);
  this.pan(-dx*panScale, -dy*panScale);
}

NScamera.pan = function(dx,dy) {
  var v = new PhiloGL.Vec3(dx, dy, 0);
  this.center.$add(quat_multiplyVec3(this.rot, v));
}

NScamera.mouseRotate = function(dx,dy,mx,my) {
	var u = new PhiloGL.Vec3(0,0,this.sensibility * this.distance);
	var rho = Math.abs((gl.canvas.width / 2.0) - mx) / (gl.canvas.height/2.0);
	var adz = Math.abs(dy) * rho;
	var ady = Math.abs(dy) * (1 - rho);
	var ySign = dy < 0 ? -1 : 1;
	var vy = u.add(new PhiloGL.Vec3(0,ady,0));
	this.velocityX += vec3_angle(u,vy)*ySign;
	var _adz = new PhiloGL.Vec3(0,adz,0);
	var vz = u.add(_adz);
	this.velocityZ += vec3_angle(u, vz) * -ySign * (mx < gl.canvas.width / 2 ? -1 : 1);

	var eccentricity = Math.abs((gl.canvas.height / 2.0) - my) / (gl.canvas.height / 2.0);
	var xSign = dx > 0 ? -1 : 1;
	adz = Math.abs(dx) * eccentricity;
	var adx = Math.abs(dx) * (1 - eccentricity);

	var vx = u.add(new PhiloGL.Vec3(adx,0,0));
	this.velocityY += vec3_angle(u,vx)*xSign;
	var vz = u.add(_adz);
	this.velocityZ += vec3_angle(u,vz)*xSign * (my > gl.canvas.height / 2 ? -1 : 1);
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

  if(this.velocityX != 0)
  	this.rot.$mulQuat(new PhiloGL.Quat(Math.sin(this.velocityX/2.0),0,0,Math.cos(this.velocityX/2.0)));
  if(this.velocityY != 0)
  	this.rot.$mulQuat(new PhiloGL.Quat(0,Math.sin(this.velocityY/2.0),0,Math.cos(this.velocityY/2.0)));
  if(this.velocityZ != 0)
  	this.rot.$mulQuat(new PhiloGL.Quat(0,0,Math.sin(this.velocityZ/2.0),Math.cos(this.velocityZ/2.0)));
}