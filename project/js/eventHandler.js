		// Classe per la gestione degli Eventi

		var animation = new Animation();

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

		var selectedModel;
		EventHandler.prototype.onClick = function(e, model){
			$id('debug').innerHTML = "";
			if(selectedModel || model==selectedModel){
				var c = selectedModel.uniforms.color;
				selectedModel.uniforms.color = [c[0],c[1],c[2],1.0];
				selectedModel = undefined;
			}
			if(model && model!=selectedModel){
	            var c = model.uniforms.color;
	            model.uniforms.color = [c[0],c[1],c[2],0.8];
	            
	            animation.goToDistance(NScamera.distance, model.radius*10);
	            animation.goToCenter(model.position);
	            selectedModel = model;

	            $id('debug').innerHTML = "SELECTED ELEMENT: "+model.atom.name;
          	}
		}
		EventHandler.prototype.onDragStart = function(e){
			var cX = e.x + canvas.width/2;
		    var cY = e.y + canvas.height/2;
		    this.pos = {
		      x: cX,
		      y: cY
		    };
		}
      EventHandler.prototype.onDragMove= function(e) {
        	cX = e.x + canvas.width/2;
		    cY = e.y + canvas.height/2;
		    if(originRotationOn)
		    	this.originRotation(cX,cY);
		    else
		    	this.barycenterRotation(cX,cY);
		    this.pos = {
		      x: cX,
		      y: cY
		    };
      }
      EventHandler.prototype.originRotation= function(cX,cY){
      		NScamera.mouseRotate((cX-this.pos.x)*(NScamera.distance-NScamera.minDistance+1),
		     (cY-this.pos.y)*(NScamera.distance-NScamera.minDistance+1), cX, cY);
      	}
      	EventHandler.prototype.barycenterRotation= function(cX,cY){
    		var b = protein.barycenter();
   			//var x=-0,y=-0,z=-0;
    		var deltaX = cX - this.pos.x;
    		var deltaY = cY - this.pos.y;
    		var newRotationMatrix = new PhiloGL.Mat4();
    		newRotationMatrix.id();
    		newRotationMatrix.$rotateAxis( deltaX*(NScamera.distance-NScamera.minDistance+1)/100 , [0, 1, 0]);
    		newRotationMatrix.$rotateAxis( deltaY*(NScamera.distance-NScamera.minDistance+1)/100 , [1, 0, 0]);
    		for(i in renderizer.models){
    		//mat4.multiply(newRotationMatrix, renderizer.models[i].matrix, renderizer.models[i].matrix);
    		var newRotationMatrix2 = new PhiloGL.Mat4();
    		newRotationMatrix2.mulMat42(newRotationMatrix,renderizer.models[i].matrix); //the result is stored in m.
    		//newRotationMatrix2[3]=x - newRotationMatrix2[0]*x - newRotationMatrix2[1]*y - newRotationMatrix2[2]*z;
    		//newRotationMatrix2[7]=y - newRotationMatrix2[4]*x - newRotationMatrix2[5]*y - newRotationMatrix2[6]*z;
    		//newRotationMatrix2[11]=z - newRotationMatrix2[8]*x - newRotationMatrix2[9]*y - newRotationMatrix2[10]*z;
    		renderizer.models[i].matrix=newRotationMatrix2;
    		
			}
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
		      animation.resetRotation();
		      animation.goToDistance(NScamera.distance, NScamera.initDistance);
	          animation.goToCenter(new PhiloGL.Vec3(NScamera.initCenter[0], NScamera.initCenter[1], NScamera.initCenter[2] ));
		      break;
		    case 'v':
		      renderizer.showAxis = !renderizer.showAxis;
		      break;
		    case 'f':
		      this.toggleFullScreen();
		      break;
		    case 'space':
		        if(originRotationOn)
		    		originRotationOn=false;
		    	else originRotationOn=true;
		      break;
		    default:
		      break;
		  }
		}

		EventHandler.prototype.onMouseWheel = function(e) {
		    e.stop();
			NScamera.mouseZoom(e.wheel);
		}

