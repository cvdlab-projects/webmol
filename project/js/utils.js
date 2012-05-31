function vec3_angle(v1, v2) {
	return Math.acos(v1.dot(v2)/(v1.norm()*v2.norm()));
}

function quat_multiplyVec3(q, v){
	var c = v;
	var d=v[0],e=v[1],g=v[2], b=q[0];
	var f=q[1],h=q[2], a=q[3];
	var i=a*d+f*g-h*e,j=a*e+h*d-b*g,k=a*g+b*e-f*d,
	d=-b*d-f*e-h*g;
	c[0]=i*a+d*-b+j*-h-k*-f;
	c[1]=j*a+d*-f+k*-b-i*-h;
	c[2]=k*a+d*-h+i*-f-j*-b;
	return c;
}

function max(array,prop){
  var values = array.map(function (el){return el[prop];});
  return Math.max.apply(Math,values);
}

function min(array,prop){
  var values = array.map(function (el){return el[prop];});
  return Math.min.apply(Math,values);
}