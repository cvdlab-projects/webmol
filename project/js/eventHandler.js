		// Classe per la gestione degli Eventi

		var animation = new Animation();
		var selectedModel;

		function EventHandler(){
		  this.pos = {x: 0, y: 0};
		}
		//clearSelectionModel: Deseleziona l'atomo se ne era presente uno selezionato
		EventHandler.prototype.clearSelectionModel = function(){
			if(selectedModel){
				renderizer.protein.selectedAtom = undefined;
				selectedModel = undefined;
				$id('infoAtom').style.visibility='hidden';
				$id('infoAtom').innerHTML = "";
			}
		}
		/*onClick: gestisce l'evento di onClick del mouse, se non viene selezionato un atomo resetta la selezione
		in caso contrario gestisce l'aniazione della camera verso l'atomo e stampa a video le sue caratteristiche
		*/ 
		EventHandler.prototype.onClick = function(e, model){
			if(selectedModel || model==selectedModel){
				this.clearSelectionModel();
				
			}
			if(model && model!=selectedModel){
	            renderizer.protein.selectedAtom = model.atom;
	            animation.goToDistance(NScamera.distance, model.radius*10);
	            animation.goToCenter(model.position);
	            selectedModel = model;
	            $id('infoAtom').style.visibility='visible';
	            $id('infoAtom').innerHTML = "element: "+model.atom.element+
	            "<br>"+"name: "+model.atom.name+
	            "<br>"+"aminoacid: "+model.atom.aminoacid+
	            "<br>"+"chainID: "+model.atom.chainID+
	            "<br>"+"resSeq: "+model.atom.resSeq+
	            "<br>"+"id: "+model.atom.id;
          	}
		}
		//onDragStart: gestisce l'evento di dragStart del mouse settando la posizione attuale della telecamera
		EventHandler.prototype.onDragStart = function(e){
			var cX = e.x + canvas.width/2;
		    var cY = e.y + canvas.height/2;
		    this.pos = {
		      x: cX,
		      y: cY
		    };
		}
	  //onDragMove: gestisce l'evento di dragMove del mouse gestendo la rotazione della camera
      EventHandler.prototype.onDragMove= function(e) {
        	cX = e.x + canvas.width/2;
		    cY = e.y + canvas.height/2;
		    this.originRotation(cX,cY);
		    this.pos = {
		      x: cX,
		      y: cY
		    };
      }
      //originRotation: gestisce la rotazione della camera nell'origine
      EventHandler.prototype.originRotation= function(cX,cY){
      		NScamera.mouseRotate((cX-this.pos.x)*(NScamera.distance-NScamera.minDistance+1),
		     (cY-this.pos.y)*(NScamera.distance-NScamera.minDistance+1), cX, cY);
      	}
      	/*onKeyDown: gestisce gli eventi di input da tasiera
		w,a,s,d: effettuano il pan della telecamera
		r: reset della camera nella posizione originale
		v: mostra gli assi cartesiani nell'origine
		*/
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
		/*onMouseWheel: gestisce l'evento di scroll del mouse agendo sullo zoom della telecamera*/
		EventHandler.prototype.onMouseWheel = function(e) {
		    e.stop();
			NScamera.mouseZoom(e.wheel);
		}

