		// Classe per la gestione degli Eventi

		var animation = new Animation();
		var selectedModel;

		function EventHandler(){
		  this.pos = {x: 0, y: 0};
		}
		
		EventHandler.prototype.clearSelectionModel = function(){
			if(selectedModel){
				renderizer.protein.selectedAtom = undefined;
				selectedModel = undefined;
				$id('debug').innerHTML = "";
			}
		}

		EventHandler.prototype.onClick = function(e, model){
			if(selectedModel || model==selectedModel){
				this.clearSelectionModel();
			}
			if(model && model!=selectedModel){
	            renderizer.protein.selectedAtom = model.atom;
	            animation.goToDistance(NScamera.distance, model.radius*10);
	            animation.goToCenter(model.position);
	            selectedModel = model;

	            $id('debug').innerHTML = "SELECTED ELEMENT: "+model.atom.element;
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
		    this.originRotation(cX,cY);
		    this.pos = {
		      x: cX,
		      y: cY
		    };
      }
      EventHandler.prototype.originRotation= function(cX,cY){
      		NScamera.mouseRotate((cX-this.pos.x)*(NScamera.distance-NScamera.minDistance+1),
		     (cY-this.pos.y)*(NScamera.distance-NScamera.minDistance+1), cX, cY);
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
		      this.clearSelectionModel();
		      break;
		    case 'v':
		      renderizer.showAxis = !renderizer.showAxis;
		      renderizer.render(type);
		      break;
		    default:
		      break;
		  }
		}

		EventHandler.prototype.onMouseWheel = function(e) {
		    e.stop();
			NScamera.mouseZoom(e.wheel);
		}

