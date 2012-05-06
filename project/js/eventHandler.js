		// Classe per la gestione degli Eventi

		function EventHandler(){
		  this.pos = {x: 0, y: 0};
		}

		EventHandler.prototype.toggleFullScreen = function() {  
			var el = document.getElementById('webMolCanvas');

			if ((document.fullScreenElement && document.fullScreenElement !== null) ||    // alternative standard method  
			      (!document.mozFullScreen && !document.webkitIsFullScreen)) {               // current working methods  
			    if (el.requestFullScreen) {  
			      el.requestFullScreen();  
			    } else if (el.mozRequestFullScreen) {  
			      el.mozRequestFullScreen();  
			    } else if (el.webkitRequestFullScreen) {  
			      el.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);  
			    } else {
			    	alert('Fullscreen not supported');
			    }
			  } else {  
			    if (document.cancelFullScreen) {  
			      document.cancelFullScreen();  
			    } else if (document.mozCancelFullScreen) {  
			      document.mozCancelFullScreen();  
			    } else if (document.webkitCancelFullScreen) {  
			      document.webkitCancelFullScreen();  
			    }  
			  }  
		}  

		function resize() {
		    var rect = window.screen;
		    canvas.width = rect.width;
		    canvas.height = rect.height;
		}

		function on_fullscreen_change() {
		    if(document.mozFullScreen || document.webkitIsFullScreen) {
		        resize();
		    }
		    else {
		        canvas.width = 640;
		        canvas.height = 480;
		    }
		}

		document.addEventListener('mozfullscreenchange', on_fullscreen_change);
		document.addEventListener('webkitfullscreenchange', on_fullscreen_change);

		EventHandler.prototype.onDragStart = function(e){
			var cX = e.x + canvas.width/2;
		    var cY = e.y + canvas.height/2;
		    this.pos = {
		      x: cX,
		      y: cY
		    };
		}

		EventHandler.prototype.onDragMove = function(e) {
		    cX = e.x + canvas.width/2;
		    cY = e.y + canvas.height/2;
		    NScamera.mouseRotate((cX-this.pos.x)*(NScamera.distance-NScamera.minDistance+1),
		     (cY-this.pos.y)*(NScamera.distance-NScamera.minDistance+1), cX, cY);

		    this.pos = {
		      x: cX,
		      y: cY
		    };
		}

		EventHandler.prototype.onKeyDown = function(e) {
		  switch(e.key){
		    case 'w':
		      NScamera.mousePan(0,NScamera.stepPan);
		      break;
		    case 'a':
		      NScamera.mousePan(-NScamera.stepPan,0);
		      break;
		    case 's':
		      NScamera.mousePan(0,-NScamera.stepPan);
		      break;
		    case 'd':
		      NScamera.mousePan(NScamera.stepPan,0);
		      break;
		    case 'r':
		      NScamera.reset();
		      break;
		    case 'v':
		      renderizer.showAxis = !renderizer.showAxis;
		      break;
		    case 'f':
		      this.toggleFullScreen();
		      break;
		    default:
		      break;
		  }
		}

		EventHandler.prototype.onMouseWheel = function(e) {
		    e.stop();
			NScamera.mouseZoom(e.wheel);
		}

