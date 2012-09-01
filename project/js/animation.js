	/* Classe per la gestione delle animazioni della camera */

	/* Variabili per la durata delle animazioni */
	var GOTODISTANCE_DURATION = 1000;
	var GOTOROTATION_DURATION = 500;
	var GOTOCENTER_DURATION = 1000;

	function Animation(){}

	/* Animazione per portare la distanza della camera da un punto _to ad un punto _from */
	Animation.prototype.goToDistance = function(_to, _from){
		  var fx = new PhiloGL.Fx({
		    duration: GOTODISTANCE_DURATION,
		    transition: PhiloGL.Fx.Transition.Quad.easeOut,
		    onCompute: function(delta) {
		      var from = this.opt.from, to = this.opt.to;
		      NScamera.distance = PhiloGL.Fx.compute(from, to, delta);
		    }
		  });

		  fx.start({
              from: _to,
              to: _from });
		}

	/* Animazione per ruotare la camera */
	  Animation.prototype.goToRotationQuatCoord = function(_to, _coord){
	    var fx = new PhiloGL.Fx({
	        duration: GOTOROTATION_DURATION,
	        transition: PhiloGL.Fx.Transition.Quad.easeOut,
	        onCompute: function(delta) {
	          var from = this.opt.from, to = this.opt.to, coord = this.opt.coord;
	          NScamera.rot[coord] = PhiloGL.Fx.compute(from, to, delta);
	        }
	      });

	      fx.start({
	        from: NScamera.rot[_coord],
	        to: _to,
	        coord: _coord });
	   }

	/* Animazione per spostare il centro della camera alla coordinata _to dove (_coord = 0 (per x), 1 (per y), 2 (per z) ) */
	  Animation.prototype.goToCenterCoord = function(_to, _coord){
	    var fx = new PhiloGL.Fx({
	        duration: GOTOCENTER_DURATION,
	        transition: PhiloGL.Fx.Transition.Quad.easeOut,
	        onCompute: function(delta) {
	          var from = this.opt.from, to = this.opt.to, coord = this.opt.coord;
	          NScamera.center[coord] = PhiloGL.Fx.compute(from, to, delta);
	        }
	      });

	      fx.start({
	        from: NScamera.center[_coord],
	        to: _to,
	        coord: _coord });
	   }

	/* Funzione per resettare la rotazione della camera con un'animazione */
	  Animation.prototype.resetRotation = function(){
		this.goToRotationQuatCoord(0, 0);
	    this.goToRotationQuatCoord(0, 1);
	    this.goToRotationQuatCoord(0, 2);
	    this.goToRotationQuatCoord(1, 3);
	  }

	/* Funzione per spostare il centro della camera con un'animazione al punto vec */
	  Animation.prototype.goToCenter = function(vec){
		this.goToCenterCoord(vec.x, 0);
	    this.goToCenterCoord(vec.y, 1);
	    this.goToCenterCoord(vec.z, 2);
	  }