//Questa classe contiene varie funzioni di utilità

/*vec3_angle: calcola l'angolo compreso tra due vect3
*/
function vec3_angle(v1, v2) {
	return Math.acos(v1.dot(v2)/(v1.norm()*v2.norm()));
}
//quat_multiplyVec3: moltiplica un quaternione per un vec3
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
//max: ritorna il massimo valore di una coordinata prop in un array di coordinate
function max(array,prop){
  var values = array.map(function (el){return el[prop];});
  return Math.max.apply(Math,values);
}
//max: ritorna il minimo valore di una coordinata prop in un array di coordinate
function min(array,prop){
  var values = array.map(function (el){return el[prop];});
  return Math.min.apply(Math,values);
}

/* Funzioni per la gestione del drag&drop della finestra di dettaglio dell'atomo */
function drag_start(event) {
    var style = window.getComputedStyle(event.target, null);
    event.dataTransfer.setData("text/plain",
    (-parseInt(style.getPropertyValue("right"),10) - event.clientX) + ',' + (parseInt(style.getPropertyValue("top"),10) - event.clientY));
} 
function drag_over(event) { 
    event.preventDefault(); 
    return false; 
} 
function drop(event) { 
    var offset = event.dataTransfer.getData("text/plain").split(',');
    var dm = document.getElementById('infoAtom');
    dm.style.right = -(event.clientX + parseInt(offset[0],10)) + 'px';
    dm.style.top = (event.clientY + parseInt(offset[1],10)) + 'px';
    event.preventDefault();
    return false;
} 


//Trasformano un colore esadecimale nella matrice RGB
function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}