var ANG2RAD = 3.14159265358979323846/180.0;

function FrustumCulling(camera){
	this.ratio = camera.aspect;
	this.angle = camera.fov;
	this.nearD = camera.near;
	this.farD = camera.far;

	// compute width and height of the near and far plane sections
	var tang = Math.tan(ANG2RAD * this.angle * 0.5) ;

	this.nh = this.nearD * tang;
	this.nw = this.nh * this.ratio;
	this.fh = this.farD * tang;
	this.fw = this.fh * this.ratio;
	this.updatePlanes();
}

FrustumCulling.prototype.createPlane = function(p0, p1, p2) {
	var v = p1.sub(p0);
	var u = p2.sub(p0);
	var n = v.cross(u);
	n.$unit();
	var A = n.x;
	var B = n.y;
	var C = n.z;
	var D = n.neg().dot(p0);

	return [A,B,C,D];
}

FrustumCulling.prototype.isPointInFrustum = function(point){
	return this.isSphereInFrustum(point, 0);
}

FrustumCulling.prototype.isSphereInFrustum = function(point, radius){
	for(var key in this.pl){
		var plane = this.pl[key];
		var dist = this.distToPlane(plane, point);
		if(dist < -radius){
			return false;
		}
	}
	return true;
}

FrustumCulling.prototype.distToPlane = function(plane, point) {
	var A = plane[0], B = plane[1], C = plane[2], D = plane[3];
	var rx = point.x, ry = point.y, rz = point.z;

	var dist = A*rx + B*ry + C*rz + D;

	return dist;
}

FrustumCulling.prototype.updatePlanes = function(p, l, u){
	var dir,nc,fc,X,Y,Z;

	if(p!=undefined && l!=undefined && u!=undefined){
		Z = p.sub(l);
		Z.$unit();

		X = u.cross(Z);
		X.$unit();

		Y = Z.cross(X);

		nc = p.sub(Z.scale(this.nearD));
		fc = p.sub(Z.scale(this.farD));


		function computeCorners(c, h, w){
			tl = c.add(Y.scale(h)).sub(X.scale(w));
			tr = c.add(Y.scale(h)).add(X.scale(w));
			bl = c.sub(Y.scale(h)).sub(X.scale(w));
			br = c.sub(Y.scale(h)).add(X.scale(w));
			return [tl,tr,bl,br];
		}

		n = computeCorners(nc, this.nh, this.nw);
		f = computeCorners(fc, this.fh, this.fw);
		var ntl = n[0], ntr = n[1], nbl = n[2], nbr = n[3];
		var ftl = f[0], ftr = f[1], fbl = f[2], fbr = f[3];

		var pl = {};

		pl['TOP'] = this.createPlane(ntr,ntl,ftl);
		pl['BOTTOM'] = this.createPlane(nbl,nbr,fbr);
		pl['LEFT'] = this.createPlane(ntl,nbl,fbl);
		pl['RIGHT'] = this.createPlane(nbr,ntr,fbr);
		pl['NEAR'] = this.createPlane(ntl,ntr,nbr);
		pl['FAR'] = this.createPlane(ftr,ftl,fbl);

		this.pl = pl;
	}
}